import React, { useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Icon from '../Icon';
import Button from '../atom/Button';
import { shuffle } from '../../helper';
import classNames from 'classnames';

import { PropTypes } from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';

QuestionCard.propTypes = {
  question: PropTypes.shape({
    score: PropTypes.number,
    next_question_at: PropTypes.string,
    id: PropTypes.number,
    is_reverse: PropTypes.bool,
    wording: PropTypes.string,
    answer: PropTypes.string,
    category: PropTypes.shape({
      icon: PropTypes.string,
    }),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired, // mental, byHeart, demo, quest
};

QuestionCard.defaultProps = {
  message: '',
};

export default function QuestionCard({ question, mode, onSubmit, onSkip, message }) {
  const [answer, setAnswer] = useState('');
  const [selectedAnswerKey, setSelectedAnswerKey] = useState(0);
  const [additionalAnswers, setAdditionalAnswers] = useState([]);

  // Activate this on mental mode when the user has tried to mentally answer the question
  const [isCorrectAnswerDisplayed, setIsCorrectAnswerDisplayed] = useState(false);

  const classnames = classNames({
    QuestionCard: true,
    card: true,
    'QuestionCard--golden': question.is_golden_card,
    'QuestionCard--quest': mode === 'quest',
  });

  const inputRef = useRef();

  React.useEffect(() => {
    setAnswer('');
    if (question.additionalAnswers) {
      const additionnalAnswers = shuffle([...question.additionalAnswers.split(','), question.answer]);
      setAdditionalAnswers(additionnalAnswers);
      setSelectedAnswerKey(0);
      setAnswer(additionnalAnswers[0]);
    }
    if (mode === 'mental') {
      inputRef?.current?.focus();
    }
  }, [question]);

  return (
    <form
      key={`QuestionCard-${question.id}`}
      onSubmit={() => onSubmit(answer)}
      className={classnames}
    >
      {icons()}
      <div className="QuestionCard__content">
        {mode === 'mental' && (
          <div className="QuestionCard__progress">
            <LinearProgress
              variant="determinate"
              value={question.mentalProgression * 100}
            />
          </div>
        )}
        {questionWording()}
        {answerComponent()}
        {actionsComponent()}
      </div>
    </form>
  );


  /**
   * Returns icons
   * @returns {*}
   */
  function icons() {
    return (
      <div className="QuestionCard__icons">
        {question.is_golden_card && (
          <Icon
            className="QuestionCard--golden__icon hide_on_small"
            name="star"
            badge="gold"
            color="goldenrod"
          />
        )}
        {question.reverse_question_id && (
          <Icon
            className="QuestionCard--reverse__icon hide_on_small"
            name="sync"
            badge="reverse"
          />
        )}
        {question.is_new && (
          <Icon
            className="QuestionCard--new__icon hide_on_small"
            name="feather-alt"
            badge="new"
            color="mediumspringgreen"
          />
        )}
        {question.category && (
          <Icon
            className="QuestionCard--category__icon hide_on_small"
            name={question.category.icon}
            badge={question.category.name}
            color={question.category.color}
          />
        )}
      </div>
    );
  }

  /**
   * Return the question Wording component
   */
  function questionWording() {
    return (
      <h3 className={`QuestionCard__question ${!question && 'QuestionCard__question--is-empty'}`}>
        {question.is_reverse ? question.answer : question.wording || message}
        {question.image_path && (
          <img
            src={question.image_path}
            alt={question.image_path}
            className="QuestionCard__image"
          />
        )}
      </h3>
    );
  }

  /**
   * Returns the answer component
   */
  function answerComponent() {
    if (mode === 'byHeart') {
      if (!question.additionalAnswers) {
        return <TextField
          inputRef={inputRef}
          label="Réponse"
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
        />;
      } else if (question.additionalAnswers) {
        return (
          <RadioGroup
            className="QuestionCard__multi-answer-group"
            aria-label="Réponse"
            name="answer"
            value={selectedAnswerKey}
            onChange={handleSelection}
          >
            {additionalAnswers.map((answerChoice, key) => (
              <FormControlLabel
                key={`answer-${answerChoice}`}
                value={key}
                control={<Radio/>}
                label={answerChoice}
              />
            ))}
          </RadioGroup>
        );
      }
    }
    else if (mode === 'mental') {
      if (isCorrectAnswerDisplayed) {
        return (
          <h3>
            {question.is_reverse ? question.wording : question.answer || message}
          </h3>
        )
      }
    }
  }

  /**
   * Returns the actions component
   * @returns {*}
   */
  function actionsComponent() {
    if (mode === 'byHeart') {
      return (
        <div className="QuestionCard__actions">
          <a type="button" className="Button btn Button--secondary Button--small" onClick={handleSkip}>Passer</a>
          <Button variant="small" onClick={() => onSubmit(answer)} text="Envoyer"/>
        </div>
      );
    } else if (mode === 'mental') {
      if (isCorrectAnswerDisplayed) {
        return (
          <div className="QuestionCard__actions">
            <Button variant="small" onClick={() => onSubmit(false)} text="Oups!"/>
            <Button variant="small" onClick={() => onSubmit(true)} text="C'est dans la poche!"/>
          </div>
        )
      }
      else if (!isCorrectAnswerDisplayed) {
        return (
          <div className="QuestionCard__actions">
            <Button variant="small" onClick={() => setIsCorrectAnswerDisplayed(true)} text="Afficher la réponse"/>
          </div>
        );
      }
    }
  }

  /**
   * Handle the skip press button
   * @param event
   */
  function handleSkip(event) {
    event.preventDefault();
    event.stopPropagation();
    onSkip();
  }

  /**
   * Set the selected answer for mcq case
   * @param event
   */
  function handleSelection(event) {
    setAnswer(additionalAnswers[event.target.value]);
    setSelectedAnswerKey(parseInt(event.target.value, 10));
  }
}
