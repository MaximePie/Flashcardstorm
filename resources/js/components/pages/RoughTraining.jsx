import React from 'react';
import server from '../../server';
import QuestionRow from '../molecule/QuestionRow';

export default function RoughTraining() {
  const [questions, updateQuestions] = React.useState([]);
  const [failed, setFailed] = React.useState(0);
  const [success, setSuccess] = React.useState(0);

  React.useEffect(() => {
    updateQuestionsBag();
  }, []);

  return (
    <div className="RoughTraining">
      <h2 className="RoughTraining__score">
        <span className="RoughTraining__success">{success}</span>
        /
        <span className="RoughTraining__failed">{failed}</span>
      </h2>
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
        setSuccess(success + 1);
      } else if (response.data.status === 500) {
        setFailed(failed + 1);
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
