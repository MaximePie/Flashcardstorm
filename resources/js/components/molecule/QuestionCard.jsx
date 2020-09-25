import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Icon from '../Icon';
import Button from '../atom/Button';
import { shuffle } from '../../helper';
import classNames from 'classnames';

export default function QuestionCard(props) {
  const { question, isDemo, isQuest } = props;
  const [answer, setAnswer] = React.useState('');
  const [selectedAnswerKey, setSelectedAnswerKey] = React.useState(0);
  const [additionalAnswers, setAdditionalAnswers] = React.useState([]);

  const classnames = classNames({
    QuestionCard: true,
    card: true,
    'QuestionCard--golden': question.is_golden_card,
    'QuestionCard--quest': isQuest,
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
    if (!isDemo) {
      inputRef?.current?.focus();
    }
  }, [question]);

  return (
    <form
      key={`QuestionCard-${question.id}`}
      onSubmit={() => props.onSubmit(answer)}
      className={classnames}
    >
      {icons()}
      <div className="QuestionCard__content">
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
        {question.is_reverse ? question.answer : question.wording || props.message}
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
    if (!question.additionalAnswers) {
      return <TextField
              inputRef={inputRef}
              label="Réponse"
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
            />;
    }
    else if (question.additionalAnswers) {
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

  /**
   * Returns the actions component
   * @returns {*}
   */
  function actionsComponent() {
    if (!isDemo) {
      return (
        <div className="QuestionCard__actions">
          <a type="button" className="Button btn Button--secondary Button--small" onClick={handleSkip}>Passer</a>
          <Button variant="small" onClick={() => props.onSubmit(answer)} text="Envoyer"/>
        </div>
      );
    }
  }

  /**
   * Handle the skip press button
   * @param event
   */
  function handleSkip(event) {
    event.preventDefault();
    event.stopPropagation();
    props.onSkip();
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
