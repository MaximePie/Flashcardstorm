import React, { useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import QuestionCard from '../molecule/QuestionCard';
import server from '../../server';
import { UserContext } from '../../Contexts/user';

export default function MentalTraining({}) {
  const { mentalQuestionsCount, decrementMentalQuestionsCount } = React.useContext(UserContext);
  const [questionsList, setQuestionsList] = React.useState([]);
  const currentQuestion = questionsList[0];
  const [currentAnsweredQuestionsCount, setCurrentAnsweredQuestionsCount] = React.useState(0);


  useEffect(() => {
    if (!questionsList.length) {
      fetchQuestionsList();
    }
  }, [questionsList]);

  const userProgressComponent = mentalQuestionsCount && (
    <div className="daily_progress">
      <p className="daily-progress__counter">
        <span>Progression journalière: </span>
        {currentAnsweredQuestionsCount}
        /
        {mentalQuestionsCount}
      </p>
      <LinearProgress
        variant="determinate"
        value={(currentAnsweredQuestionsCount / mentalQuestionsCount) * 100}
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
    server.post('submitMentalQuestion', {
      questionId: submitedQuestion.id,
      isSuccessfullyAnswered,
    });
    if (isSuccessfullyAnswered) {
      setCurrentAnsweredQuestionsCount(currentAnsweredQuestionsCount + 1);
      decrementMentalQuestionsCount();
    }
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
