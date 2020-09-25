import React, { useEffect } from 'react';
import QuestionCard from '../molecule/QuestionCard';
import server from '../../server';

export default function MentalTraining({}) {
  const [questionsList, setQuestionsList] = React.useState([]);
  const currentQuestion = questionsList[0];

  React.useEffect(() => {
    if (!questionsList.length) {
      fetchQuestionsList();
    }
  }, [questionsList]);


  return (
    <div className="MentalTraining">
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
