import React from 'react';
import Button from "./Button";
import TextField from "@material-ui/core/TextField";

export default function QuestionCard(props) {
  const question = props.question;
  const [answer, setAnswer] = React.useState("");

  React.useEffect(() => {
    setAnswer('');
  }, [props.question]);

  return (
    <form onSubmit={() => props.onSubmit(answer)} className="QuestionCard card">
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

