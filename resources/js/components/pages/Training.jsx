import React from 'react';
import { useSnackbar } from 'notistack';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Cookies from 'js-cookie';
import Switch from '@material-ui/core/Switch';
import server from '../../server';
import QuestionCard from '../QuestionCard';
import { isMobile } from '../../helper';

export default function Training(props) {
  const [questions, updateQuestions] = React.useState([]);
  const [questionCardMessage, updateQuestionCardMessage] = React.useState(undefined);
  const [userProgress, updateUserProgress] = React.useState(undefined);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    Cookies.remove('number_of_new_questions');
    server.get('update_progress').then(() => {
      updateQuestionsBag();
    });
  }, []);

  return (
    <div className="Home">
      <div className="container">
        {pageHeader()}
        <div className="row">
          {questions[0] && (
            <QuestionCard
              question={questions[0] || undefined}
              onSubmit={submitAnswer}
              onSkip={() => updateQuestionsBag()}
              message={questionCardMessage}
            />
          )}
          {!questions[0] && (
            <div>
              {questionCardMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function submitAnswer(answer) {
    const submittedQuestions = questions[0];
    const currentQuestion = Array.from(questions);
    currentQuestion.shift();
    updateQuestions(currentQuestion);

    event.preventDefault();
    server.post(
      'question/submit_answer',
      {
        id: submittedQuestions.id,
        answer,
        mode: 'soft',
        is_golden_card: submittedQuestions.is_golden_card,
        is_reverse_question: submittedQuestions.is_reverse,
      },
    ).then((response) => {
      let snackbarText = response.data.text;
      if (response.data.status !== 200) {
        snackbarText += ` Réponses correctes : ${response.data.correct_answer}`;
      }

      const score = response.data.status === 200 && response.data.earned_points > 0 ? response.data.earned_points : undefined;

      enqueueSnackbar(
        <div className="Home__snackbar">
          {snackbarText}
          {score && (
            <span className="Home__snackbar-score">
              +
              {score}
            </span>
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

      if (response.data.status === 200) {
        props.updateUserScore();
      }
      updateQuestionsBag();
    });
  }

  function updateQuestionsBag() {
    let questions_in_bag = '';
    questions.forEach((question, index) => {
      questions_in_bag += index === 0 ? '/' : '';
      questions_in_bag += question.id;
      questions_in_bag += index < questions.length - 1 ? ',' : '';
    });

    server.get(`question/${props.mode}${questions_in_bag}`).then((response) => {
      questions.shift();
      response.data.questions && updateQuestions(questions.concat(response.data.questions));
      updateQuestionCardMessage(response.data.message);
      updateUserProgress(response.data.userProgress);
    });
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
        <LinearProgress variant="determinate" value={userProgress.daily_progress / userProgress.daily_objective * 100} />
      </div>
    );

    return props.mode === 'soft' ? (
      <>
        {!isMobile() && (
          <div className="jumbotron Home__title">
            <h1>Mode consolidation</h1>
            <p>Répondez aux questions en fonction du temps passé pour consolider vos mémorisations</p>
            <p>Seules les questions auxquelles vous n'avez pas répondu depuis assez longtemps apparaîtront</p>
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
          <div className="jumbotron Home__title">
            <h1>Mode tempête !</h1>
            <p>Répondez à un maximum de question toutes catégories confondues sans limite de temps ni d'essai</p>
            <p>Attention, en mode tempête les questions ne rapportent que 10 points chacunes !</p>
            {props.is_connected && (
              <FormControlLabel
                control={
                  <Switch checked={switchStatus} onChange={() => setSwitchStatus(!switchStatus)} />
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
