import React from 'react';
import Button from "./Button";
import TextField from "@material-ui/core/TextField";

export default function QuestionCard(props) {
  const question = props.question;
  const [answer, setAnswer] = React.useState("");

  return (
    <div className="QuestionCard card">
      <p className={"QuestionCard__question " + (!question.wording && "QuestionCard__question--is-empty")}>
      {question.wording || 'Il n\'y a pas encore de question disponible... Cliquez sur "Add knowledge" pour en ajouter !'}
      </p>
      <TextField label="Réponse" onChange={e => setAnswer(e.target.value)}/>
      <Button onClick={() => props.onSubmit(answer)} text="Envoyer"/>
    </div>
  );
}

