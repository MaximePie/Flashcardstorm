import React from 'react';
import { useSnackbar } from 'notistack';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { PropTypes } from 'prop-types';
import server from '../../server';
import HintDialog from '../molecule/HintDialog';
import QuestionCard from '../molecule/QuestionCard';
import { areSimilar, isMobile } from '../../helper';
import { AuthenticationContext } from '../../Contexts/authentication';
import LoadingSpinner from '../atom/LoadingSpinner';

Training.propTypes = {
  mode: PropTypes.string,
  updateUserScore: PropTypes.func.isRequired,
};

Training.defaultProps = {
  mode: 'soft',
};

export default function Training(props) {
  const isConnected = React.useContext(AuthenticationContext);

  const [questionsList, updateStateQuestionsList] = React.useState([]);
  const [isLoading, setLoadingState] = React.useState(false);

  const [userProgress, setUserProgress] = React.useState(undefined);
  const [hintModalState, setHintModalState] = React.useState({
    questionId: undefined,
    isOpen: false,
  });

  const [serverSwitch, setServerSwitch] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { updateUserScore, mode } = props;

  React.useEffect(() => {
    server.get('update_progress')
      .then((response) => {
        const { userProgress: userProgressData } = response.data;
        setUserProgress(userProgressData);
      });
  }, []);

  React.useEffect(() => {
    if (!questionsList.length) {
      fetchQuestions();
    }
  }, [questionsList]);

  return (
    <div className="Home">
      {pageHeader()}
      {hintModalState.isOpen && (
        <HintDialog
          questionId={hintModalState.questionId}
          onClose={() => setHintModalState({
            ...hintModalState,
            isOpen: false,
          })}
        />
      )}
      {!isLoading && (
        <>
          {questionsList[0] && (
            <div className="Home__QuestionCard-row">
              <QuestionCard
                question={questionsList[0] || undefined}
                onSubmit={submitAnswer}
                onSkip={displayNextQuestion}
                key={`QuestionCard-${questionsList[0].id}`}
              />
            </div>
          )}
          {!questionsList[0] && (
            <div className="Home--no-question">
              Pas de question pour le moment.
            </div>
          )}
        </>
      )}
      {isLoading && (
        <div className="Home__QuestionCard--loading">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );

  /**
   * Submit the answer to the server and display the next question from questionsBag
   * @param answer: string the answer we want to submit
   */
  function submitAnswer(answer) {
    const currentQuestions = [...questionsList];
    const submittedQuestions = currentQuestions[0];
    displayNextQuestion();
    const { answer: correctAnswer, score, hint } = submittedQuestions;
    const isCorrect = areSimilar(answer, correctAnswer);

    let snackbarText = '';

    let variant = '';

    if (isCorrect) {
      snackbarText = 'Bien joué !';
      variant = 'success';
    } else {
      snackbarText = `Oups ! Réponse : ${correctAnswer} `;
      variant = 'warning';
      if (hint) {
        snackbarText += ` Mémo : ${hint.wording}`;
      }
    }

    enqueueSnackbar(
      <div className="Home__snackbar">
        {snackbarText}
        {isCorrect && (
          <span className="Home__snackbar-score">
              +
            {score}
          </span>
        )}
        {!isCorrect && (
          <i
            className="fas fa-bolt Home__snackbar-icon"
            onClick={() => setHintModalState({
              questionId: submittedQuestions.id,
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
        variant,
      },
    );

    server.post(
      'questionUser/save',
      {
        id: submittedQuestions.id,
        isCorrect,
        mode: 'soft',
        is_golden_card: false,
        is_reverse_question: submittedQuestions.is_reverse,
      },
    )
      .then((response) => {
        setUserProgress(response.data.userProgress);
        updateUserScore();
      });
  }

  /**
   * Fills the questions bag
   */
  function fetchQuestions() {
    setLoadingState(true)
    server.get('dailyQuestions')
      .then((response) => {
        updateStateQuestionsList(response.data.questions);
        setLoadingState(false);
      });
  }


  /**
   * Shift the questions list to display the next one.
   * If the questions list is empty, fills by calling fetchQuestions
   */
  function displayNextQuestion() {
    const currentQuestions = [...questionsList];
    currentQuestions.shift();
    updateStateQuestionsList(currentQuestions);
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
