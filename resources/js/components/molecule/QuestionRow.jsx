import React from 'react';
import TextField from '@material-ui/core/TextField';
import { PropTypes } from 'prop-types';
import Icon from '../Icon';

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
        <span className="QuestionRow__question-icon">{categoryIcon()}</span>
      </h4>
      <TextField
        label="Réponse"
        onChange={(e) => setAnswer(e.target.value)}
        value={answer}
      />
    </form>
  );

  function categoryIcon() {
    return (
      <>
        {question.category && (
          <Icon
            name={question.category.icon}
            badge={question.category.name}
            color={question.category.color}
            isSmall
          />
        )}
        {!question.category && (
          <Icon
            name="question"
            badge="divers"
            color="grey"
            isSmall
          />
        )}
      </>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(answer);
  }
}
