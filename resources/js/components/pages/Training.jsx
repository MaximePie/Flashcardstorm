import React from 'react';
import { useSnackbar } from 'notistack';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { PropTypes } from 'prop-types';
import server from '../../server';
import HintDialog from '../molecule/HintDialog';
import QuestionCard from '../molecule/QuestionCard';
import { isMobile } from '../../helper';

Training.propTypes = {
  mode: PropTypes.string,
  is_connected: PropTypes.bool,
  updateUserScore: PropTypes.func.isRequired,
};

Training.defaultProps = {
  mode: 'soft',
  is_connected: false,
};

export default function Training(props) {
  const [questionsBag, updateQuestionsBag] = React.useState({
    questions: [],
    unwantedIdsList: [],
    questionCardMessage: undefined,
  });

  const [userProgress, setUserProgress] = React.useState(undefined);
  const [hintModalState, setHintModalState] = React.useState({ questionId: undefined, isOpen: false });

  const [serverSwitch, setServerSwitch] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { is_connected: isConnected, updateUserScore, mode } = props;

  React.useEffect(() => {
    server.get('update_progress')
      .then((response) => {
        const { userProgress: userProgressData } = response.data;
        setUserProgress(userProgressData);
        updateQuestionsList();
      });
  }, []);

  React.useEffect(() => {
    updateQuestionsList();
  }, [serverSwitch]);

  const { questions, questionCardMessage } = questionsBag;

  return (
    <div className="Home">
      {pageHeader()}
      {hintModalState.isOpen && (
        <HintDialog
          questionId={hintModalState.questionId}
          onClose={() => setHintModalState({ ...hintModalState, isOpen: false })}
        />
      )}
      {questions[0] && (
        <div className="Home__QuestionCard-row">
          <QuestionCard
            question={questions[0] || undefined}
            onSubmit={submitAnswer}
            onSkip={goNext}
            message={questionCardMessage}
            key={`QuestionCard-${questions[0].id}`}
          />
        </div>
      )}
      {!questions[0] && (
        <div className="Home--no-question">
          {questionCardMessage}
        </div>
      )}
    </div>
  );

  /**
   * Submit the answer to the server and display the next question from questionsBag
   * @param answer: string the answer we want to submit
   */
  function submitAnswer(answer) {
    const currentQuestions = [...questions];
    const submittedQuestions = currentQuestions[0];
    goNext();

    server.post(
      'question/submit_answer',
      {
        id: submittedQuestions.id,
        answer,
        mode: 'soft',
        is_golden_card: submittedQuestions.is_golden_card,
        is_reverse_question: submittedQuestions.is_reverse,
      },
    )
      .then((response) => {
        let snackbarText = response.data.text;
        if (response.data.status !== 200) {
          snackbarText += ` Réponse : ${response.data.correct_answer} `;
          if (response.data.hint) {
            snackbarText += ` Mémo : ${response.data.hint}`;
          }
        }

        const score = response.data.status === 200
        && response.data.earned_points > 0
          ? response.data.earned_points
          : undefined;


        enqueueSnackbar(
          <div className="Home__snackbar">
            {snackbarText}
            {score && (
              <span className="Home__snackbar-score">
              +
                {score}
              </span>
            )}
            {!score && (
              <i
                className="fas fa-bolt Home__snackbar-icon"
                onClick={() => setHintModalState({
                  questionId: response.data.questionId,
                  isOpen: true,
                })}
              />
            )}
          </div>,
          {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: response.data.status === 200 ? 'success' : 'warning',
          },
        );
        setUserProgress(response.data.userProgress);
        updateUserScore();
      });
  }

  function updateQuestionsList() {
    const { unwantedIdsList } = questionsBag;
    let questionsInList = '';
    const storedForbiddenIds = [...unwantedIdsList];
    storedForbiddenIds.shift();

    storedForbiddenIds.forEach((id, index) => {
      questionsInList += index === 0 ? '/' : '';
      questionsInList += id;
      questionsInList += index < unwantedIdsList.length - 1 ? ',' : '';
    });

    const currentQuestions = [...questions];

    server.get(`question/${mode}${questionsInList}`)
      .then((response) => {
        const { message, questions: questionsData } = response.data;
        const updatedQuestions = currentQuestions.concat(questionsData);
        const forbiddenIds = [];
        updatedQuestions.forEach((question) => {
          if (question) {
            forbiddenIds.push(question.id);
          }
        });

        updateQuestionsBag({
          questions: updatedQuestions,
          unwantedIdsList: forbiddenIds,
          questionCardMessage: message,
        });
      });
  }

  function goNext() {
    const currentQuestions = [...questions];
    currentQuestions.shift();

    const unwantedIds = [...questionsBag.unwantedIdsList];
    unwantedIds.shift();
    updateQuestionsBag({
      ...questionsBag,
      unwantedIdsList: unwantedIds,
      questions: currentQuestions,
    });
    setServerSwitch(!serverSwitch);
  }

  function pageHeader() {
    const userProgressComponent = userProgress && (
      <div className="daily_progress">
        <p className="daily-progress__counter">
          <span>Progression journalière: </span>
          {userProgress.daily_progress}
          {' '}
          /
          {userProgress.daily_objective}
        </p>
        <LinearProgress
          variant="determinate"
          value={(userProgress.daily_progress / userProgress.daily_objective) * 100}
        />
      </div>
    );

    return mode === 'soft' ? (
      <>
        {!isMobile() && (
        <div className="Home__title">
          <h1>Mode consolidation</h1>
          <p>Répondez aux questions en fonction du temps passé pour consolider vos mémorisations</p>
          <p>Seules les questions auxquelles vous n&apos;avez pas répondu depuis assez longtemps apparaîtront</p>
          <div>
            {userProgressComponent}
          </div>
        </div>
        )}
        {isMobile() && (
          <>
            <h2 className="Home__title">Mode consolidation</h2>
            <div>
              {userProgressComponent}
            </div>
          </>
        )}
      </>
    )
      : (
        <>
          {!isMobile() && (
            <div className="Home__title">
              <h1>Mode tempête !</h1>
              <p>Répondez à un maximum de question toutes catégories confondues sans limite de temps ni d&apos;essai</p>
              <p>Attention, en mode tempête les questions ne rapportent que 10 points chacunes !</p>
              {isConnected && (
                <FormControlLabel
                  control={
                    <Switch checked={serverSwitch} onChange={() => setServerSwitch(!serverSwitch)} />
                  }
                  label="Afficher seulement mes questions"
                />
              )}
            </div>
          )}
          {isMobile() && (
            <h2 className="Home__title">Mode tempête !</h2>
          )}
        </>
      );
  }
}
