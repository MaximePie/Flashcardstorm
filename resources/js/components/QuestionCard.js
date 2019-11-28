import React from 'react';
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import Icon from "./Icon";

export default function QuestionCard(props) {
  const question = props.question;
  const [answer, setAnswer] = React.useState("");

  React.useEffect(() => {
    setAnswer('');
  }, [props.question]);

  return (
    <form onSubmit={() => props.onSubmit(answer)} className={"QuestionCard card " + (props.question.is_golden_card && "QuestionCard--golden")}>
      {props.question.is_golden_card && (
        <Icon
          className={"QuestionCard--golden__icon"}
          name="star"
          badge="gold"
        />
      )}
      {props.question.is_new && (
        <Icon
          className={"QuestionCard--new__icon"}
          name="feather-alt"
          badge="new"
        />
      )}
      {props.question.category && (
        <Icon
          className={"QuestionCard--category__icon"}
          name={props.question.category.icon}
          badge={props.question.category.name}
          color={props.question.category.color}
        />
      )}
      <h3 className={"QuestionCard__question " + (!question && "QuestionCard__question--is-empty")}>
        {props.question.wording || props.message}
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

