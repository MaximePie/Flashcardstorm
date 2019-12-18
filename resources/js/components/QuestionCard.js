import React from 'react';
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import Icon from "./Icon";

export default function QuestionCard(props) {
  const question = props.question;
  const [answer, setAnswer] = React.useState("");

  React.useEffect(() => {
    setAnswer('');
  }, [question]);

  return (
    <form onSubmit={() => props.onSubmit(answer)} className={"QuestionCard card " + (question.is_golden_card && "QuestionCard--golden")}>
      {question.is_golden_card && (
        <Icon
          className={"QuestionCard--golden__icon"}
          name="star"
          badge="gold"
        />
      )}
      {question.reverse_question_id && (
        <Icon
          className={"QuestionCard--reverse__icon"}
          name="sync"
          badge="reverse"
        />
      )}
      {question.is_new && (
        <Icon
          className={"QuestionCard--new__icon"}
          name="feather-alt"
          badge="new"
        />
      )}
      {question.category && (
        <Icon
          className={"QuestionCard--category__icon"}
          name={question.category.icon}
          badge={question.category.name}
          color={question.category.color}
        />
      )}
      <h3 className={"QuestionCard__question " + (!question && "QuestionCard__question--is-empty")}>
        {question.is_reverse ? question.answer : question.wording || props.message}
      </h3>
      <TextField label="Réponse" onChange={e => setAnswer(e.target.value)} value={answer}/>
      <div className="QuestionCard__actions">
        <a type="button" className="Button btn btn-secondary" onClick={handleSkip}>Passer</a>
        <Button onClick={() => props.onSubmit(answer)} text="Envoyer"/>
      </div>
    </form>
  );

  function handleSkip(event) {
    event.preventDefault();
    event.stopPropagation();
    props.onSkip();
  }
}

