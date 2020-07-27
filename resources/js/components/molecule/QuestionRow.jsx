import React from 'react';
import TextField from '@material-ui/core/TextField';
import { PropTypes } from 'prop-types';
import Button from '../atom/Button';

QuestionRow.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number,
    is_reverse: PropTypes.bool,
    wording: PropTypes.string,
    answer: PropTypes.string,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  message: PropTypes.string,
};

QuestionRow.defaultProps = {
  message: '',
};

export default function QuestionRow(props) {
  const { question, message } = props;
  const [answer, setAnswer] = React.useState('');
  return (
    <form
      onSubmit={handleSubmit}
      className="QuestionRow card"
      id={`question-${question.id}`}
    >
      <h3 className={`QuestionRow__question ${!question && 'QuestionRow__question--is-empty'}`}>
        {question.is_reverse ? question.answer : question.wording || message}
      </h3>
      <TextField
        label="Réponse"
        onChange={(e) => setAnswer(e.target.value)}
        value={answer}
      />
    </form>
  );

  function handleSubmit(event) {
    event.preventDefault();
    props.onSubmit(answer);
  }
}
