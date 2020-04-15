import React from 'react';
import server from '../../server';
import QuestionRow from '../molecule/QuestionRow';

export default function RoughTraining() {
  const [questions, updateQuestions] = React.useState([]);

  React.useEffect(() => {
    updateQuestionsBag();
  }, []);

  return (
    <div className="RoughTraining">
      <div className="RoughTraining__questions">
        {questions.map((question) => (
          <QuestionRow
            question={question}
            onSubmit={(answer) => submitAnswer(answer, question)}
            key={`QuestionRow-${questions[0].id}`}
          />
        ))}
      </div>
    </div>
  );

  function submitAnswer(answer, question) {
    server.post(
      'question/submit_answer',
      {
        id: question.id,
        answer,
        mode: 'soft',
        is_golden_card: false,
        is_reverse_question: question.is_reverse,
      },
    ).then((response) => {
      const questionCard = document.getElementById(`question-${question.id}`);
      if (response.data.status === 200) {
        questionCard.classList.add('QuestionRow--success');
      } else if (response.data.status === 500) {
        questionCard.classList.add('QuestionRow--failed');
      }
    });
  }

  function updateQuestionsBag() {
    server.get('allDailyQuestions')
      .then((response) => {
        updateQuestions(response.data.questions);
      });
  }
}
