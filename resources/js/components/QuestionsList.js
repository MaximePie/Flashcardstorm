import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "./Snackbar";
import server from "../server";



export default function QuestionsList(props) {

  const [questions, updateQuestions] = React.useState(undefined);
  const [is_open, setOpen] = React.useState(false);

  React.useEffect(() => {
    updateQuestionsBag()
    // TODO Créer une méthode updateUserInfo pour récupérer les infos (dont le score)
  }, []);

  return (
    <div className="QuestionsList">
      <div className="jumbotron QuestionsList__title">
        <h1>Liste des questions</h1>
        <p>Cliquez sur la Checkmark pour ajouter ou retirer une question de votre collection</p>
        <p>Une question est automatiquement intégrée à votre collection quand vous créez une question ou quand vous y répondez depuis le mode Tempête</p>
      </div>
      <ul className="container list-group list-group-flush">
        {questions && questions.length && questions.map(function(question, key){
          return (
            <li key={`question${question.id}`} className="QuestionsList__question list-group-item">
              <span>
                <h3 className="QuestionsList__question-wording">{question.wording}</h3>
                <div className="QuestionsList__question-answer">{question.answer}</div>
                {props.is_connected && (
                  <div className="QuestionsList__question-score">Prochain gain : +{question.score}</div>
                )}
              </span>
              <div className="QuestionsList__actions">
                {props.is_connected && (
                  <IconButton
                    aria-label="delete"
                    color="primary"
                    className={"QuestionsList__delete-button QuestionsList__toggleButton" + (question.is_set_for_user ? "--set" : "--unset")}
                    onClick={() => toggleQuestionForUser(question.id, key)}
                  >
                    <i className="far fa-check-circle QuestionsList__delete-icon"/>
                  </IconButton>
                )}
                <IconButton
                  aria-label="delete"
                  color="primary"
                  className="QuestionsList__delete-button"
                  onClick={() => deleteQuestion(question.id)}
                >
                  <i className="far fa-trash-alt QuestionsList__delete-icon"/>
                </IconButton>
              </div>
            </li>
          )
        })}
      </ul>
      <Snackbar is_open={is_open} on_close={() => setOpen(false)}/>
    </div>
  );

  function deleteQuestion(id) {
    server.get('question/delete/' + id).then(response => {
      updateQuestions(response.data);
      setOpen(true)
    });
  }

  function toggleQuestionForUser(id, key) {
    server.get('question/toggle/' + id).then(response => {
      let questionsBag = questions;
      questionsBag[key].is_set_for_user = response.data.is_set_for_user;
      updateQuestions([...questionsBag]);
      setOpen(true)
    });
  }

  function updateQuestionsBag() {
    server.get('questions_list').then(response => {
      updateQuestions(response.data)
    })
  }
}