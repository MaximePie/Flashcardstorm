import React, { useEffect } from 'react';
import QuestionCard from '../molecule/QuestionCard';
import server from '../../server';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function MentalTraining({}) {
  const [questionsList, setQuestionsList] = React.useState([]);
  const currentQuestion = questionsList[0];
  const [remainingCount, setRemainingCount] = React.useState(undefined);
  const [currentAnsweredQuestionsCount, setCurrentAnsweredQuestionsCount] = React.useState(0);

  React.useEffect(() => {
    if (!questionsList.length) {
      fetchQuestionsList();
    }
  }, [questionsList]);

  React.useEffect(() => {
    server.get('update_progress')
      .then((response) => {
        const { userMentalProgress: userProgressData } = response.data;
        setRemainingCount(userProgressData);
      });
  }, []);


  const userProgressComponent = remainingCount && (
    <div className="daily_progress">
      <p className="daily-progress__counter">
        <span>Progression journalière: </span>
        {currentAnsweredQuestionsCount} {' '} / {' '} {remainingCount}
      </p>
      <LinearProgress
        variant="determinate"
        value={(currentAnsweredQuestionsCount/ remainingCount) * 100}
      />
    </div>
  );


  return (
    <div className="MentalTraining">
      {userProgressComponent && userProgressComponent}
      <div className="MentalTraining__question-card">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onSubmit={submit}
            key={`QuestionCard-${questionsList[0].id}`}
            mode="mental"
          />
        )}
      </div>
    </div>
  );

  /**
   * Fetch the questionsList and set it
   */
  function fetchQuestionsList() {
    server.get('mentalQuestions')
      .then((response) => {
        const { questions } = response.data;
        if (questions) {
          setQuestionsList(questions);
        }
      });
  }

  /**
   * Send the data to the back office
   * @param isSuccessfullyAnswered A flag to tell if the response was successful or not
   */
  function submit(isSuccessfullyAnswered) {
    const submitedQuestion = questionsList[0];
    displayNextQuestion();
    if (isSuccessfullyAnswered) {
      setCurrentAnsweredQuestionsCount(currentAnsweredQuestionsCount + 1);
    }
    server.post('submitMentalQuestion', {
      questionId: submitedQuestion.id,
      isSuccessfullyAnswered,
    });
  }

  /**
   * Shift the questions list to display the next one.
   * If the questions list is empty, fills by calling fetchQuestions
   */
  function displayNextQuestion() {
    const currentQuestions = [...questionsList];
    currentQuestions.shift();
    setQuestionsList(currentQuestions);
  }
}
