import React from 'react';
import Button from "./molecule/Button";
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
      {icons()}
      <div className="QuestionCard__content">
        <h3 className={"QuestionCard__question " + (!question && "QuestionCard__question--is-empty")}>
          {question.is_reverse ? question.answer : question.wording || props.message}
        </h3>
        <TextField label="Réponse" onChange={e => setAnswer(e.target.value)} value={answer}/>
        <div className="QuestionCard__actions">
          <a type="button" className="Button btn Button--secondary" onClick={handleSkip}>Passer</a>
          <Button onClick={() => props.onSubmit(answer)} text="Envoyer"/>
        </div>
      </div>
    </form>
  );

  function icons() {
    return (
      <div className="QuestionCard__icons">
        {question.is_golden_card && (
          <Icon
            className={"QuestionCard--golden__icon hide_on_small"}
            name="star"
            badge="gold"
            color="goldenrod"
          />
        )}
        {question.reverse_question_id && (
          <Icon
            className={"QuestionCard--reverse__icon hide_on_small"}
            name="sync"
            badge="reverse"
          />
        )}
        {question.is_new && (
          <Icon
            className={"QuestionCard--new__icon hide_on_small"}
            name="feather-alt"
            badge="new"
            color="mediumspringgreen"
          />
        )}
        {question.category && (
          <Icon
            className={"QuestionCard--category__icon hide_on_small"}
            name={question.category.icon}
            badge={question.category.name}
            color={question.category.color}
          />
        )}
      </div>
    )
  }

  function handleSkip(event) {
    event.preventDefault();
    event.stopPropagation();
    props.onSkip();
  }
}

