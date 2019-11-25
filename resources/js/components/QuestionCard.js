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
    <div className="QuestionCard card">
      <h3 className={"QuestionCard__question " + (!question && "QuestionCard__question--is-empty")}>
      {(question && question.wording) || 'Il n\'y a pas encore de question disponible... Cliquez sur "Ajouter des questions" pour en ajouter !'}
      </h3>
      <TextField label="Réponse" onChange={e => setAnswer(e.target.value)} value={answer}/>
      <Button onClick={() => props.onSubmit(answer)} text="Envoyer"/>
    </div>
  );
}

