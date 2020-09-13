import React from 'react';
import TextField from '@material-ui/core/TextField';
import { PropTypes } from 'prop-types';

QuestionRow.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number,
    is_reverse: PropTypes.bool,
    wording: PropTypes.string,
    answer: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.string,
  timestamp: PropTypes.string,
};

QuestionRow.defaultProps = {
  message: '',
  timestamp: '',
};

export default function QuestionRow({
  question,
  message,
  timestamp,
  onSubmit,
}) {
  const [answer, setAnswer] = React.useState('');
  return (
    <form
      onSubmit={handleSubmit}
      className="QuestionRow card"
      id={`question-${question.id}-${timestamp}`}
    >
      <h4 className={`QuestionRow__question ${!question && 'QuestionRow__question--is-empty'}`}>
        {question.is_reverse ? question.answer : question.wording || message}
      </h4>
      <TextField
        label="Réponse"
        onChange={(e) => setAnswer(e.target.value)}
        value={answer}
      />
    </form>
  );

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(answer);
  }
}
