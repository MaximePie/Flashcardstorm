import React from 'react';
import server from '../../server';
import QuestionRow from '../molecule/QuestionRow';
import Button from '../atom/Button';
import { areSimilar } from '../../helper';

export default function RoughTraining() {
  const [questions, updateQuestions] = React.useState([]);
  const [timeStamp, setTimeStamp] = React.useState(undefined);
  const [failed, setFailed] = React.useState(0);
  const [success, setSuccess] = React.useState(0);

  React.useEffect(() => {
    updateQuestionsBag();
  }, []);

  return (
    <div className="RoughTraining">
      <div className="container RoughTraining__container">
        <h2 className="RoughTraining__score">
          <span className="RoughTraining__success">{success}</span>
          /
          <span className="RoughTraining__failed">{failed}</span>
        </h2>
        <div className="RoughTraining__questions">
          {questions.length && questions.map((question) => (
            <QuestionRow
              question={question}
              onSubmit={(answer) => submitAnswer(answer, question)}
              key={`QuestionRow-${question.id}-${timeStamp}`}
              timestamp={timeStamp}
            />
          ))}
          {questions.length > 0 && (
            <Button className="RoughTraining__action" text="Charger d'autres questions" onClick={updateQuestionsBag} />
          )}
        </div>
      </div>
    </div>
  );

  function submitAnswer(answer, question) {
    const questionCard = document.getElementById(`question-${question.id}-${timeStamp}`);
    if (areSimilar(answer, question.answer)) {
      questionCard.classList.add('QuestionRow--success');
      setSuccess(success + 1);
      server.post(
        'questionUser/save',
        {
          id: question.id,
          isCorrect: true,
          mode: 'soft',
          is_golden_card: false,
          is_reverse_question: question.is_reverse,
        },
      );
    } else {
      setFailed(failed + 1);
      questionCard.classList.add('QuestionRow--failed');

      server.post(
        'questionUser/save',
        {
          id: question.id,
          isCorrect: false,
          mode: 'soft',
          is_golden_card: false,
          is_reverse_question: question.is_reverse,
        },
      );
    }
  }


  function updateQuestionsBag() {
    server.get('dailyQuestions')
      .then((response) => {
        setTimeStamp(response.data.timestamp);
        updateQuestions(response.data.questions);
      });
  }
}
