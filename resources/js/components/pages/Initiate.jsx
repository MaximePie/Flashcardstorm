import React from 'react';
import server from '../../server';

export default function Component() {
  const [questions, updateQuestions] = React.useState([]);
  const [answers, updateAnswers] = React.useState([]);
  const [selectedQuestion, setSelectedQuestion] = React.useState(undefined);
  const [selectedAnswer, setSelectedAnswer] = React.useState(undefined);

  React.useEffect(() => {
    if (questions.length === 0 && answers.length === 0) {
      updateQuestionsBag();
    }
  }, [questions, answers]);

  React.useEffect(() => {
    if (selectedQuestion && selectedAnswer) {
      submitTuple();
    }
  }, [selectedQuestion, selectedAnswer]);

  return (
    <div className="Initiate">
      <div className="Initiate__questions-container">
        {questions.map((question) => (
          <div
            className={
              `Initiate__question${isSelected(question.id, 'question') ? ' Initiate__question--selected' : ''}`
            }
            onClick={() => setSelectedQuestion(question.id)}
          >
            {question.wording}
          </div>
        ))}
        {answers.map((answer) => (
          <div
            className={`Initiate__question${isSelected(answer.id, 'answer') ? ' Initiate__question--selected' : ''}`}
            onClick={() => setSelectedAnswer(answer.id)}
          >
            {answer.wording}
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Fetch the questions list and update the local questions hook
   */
  function updateQuestionsBag() {
    server.get('nonInitiatedQuestions')
      .then((response) => {
        if (response.data.questions.length && response.data.answers.length) {
          updateQuestions(response.data.questions);
          updateAnswers(response.data.answers);
        } else {
          alert("Vous avez initialisé toutes vos questions, c'est l'heure de passer à la vitesse supérieure !");
        }
      });
  }

  /**
   * Check if the question is selected or not
   */
  function isSelected(cardId, type) {
    if (type === 'question') {
      return cardId === selectedQuestion;
    }
    return cardId === selectedAnswer;
  }

  /**
   * Sends the two selected Ids to check if the duo is correct
   */
  function submitTuple() {
    server.post('question/initiate', {
      question: selectedQuestion,
      answer: selectedAnswer,
    }).then((response) => {
      if (response.data === 200) {
        const updatedQuestions = questions.filter(
          (question) => (question.id !== selectedQuestion ? question : undefined),
        );
        updateQuestions([...updatedQuestions]);
        const updatedAnswers = answers.filter(
          (answer) => (answer.id !== selectedAnswer ? answer : undefined),
        );
        updateAnswers([...updatedAnswers]);

        if (updatedQuestions.length === 0 && updatedAnswers.length === 0) {
          updateQuestionsBag();
        }
      }
      setSelectedQuestion(undefined);
      setSelectedAnswer(undefined);
    });
  }
}
