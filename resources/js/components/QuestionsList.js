import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "./Snackbar";



export default function QuestionsList() {

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
      </div>
      <ul className="container list-group list-group-flush">
        {questions && questions.map(function(question){
          return (
            <li key={`question${question.id}`} className="QuestionsList__question list-group-item">
              <span>
                <h3 className="QuestionsList__question-wording">{question.wording}</h3>
                <span className="QuestionsList__question-answer">{question.answer}</span>
              </span>
              <IconButton
                aria-label="delete"
                color="primary"
                className="QuestionsList__delete-button"
                onClick={(id) => deleteQuestion(question.id)}
              >
                <i className="far fa-trash-alt QuestionsList__delete-icon"/>
              </IconButton>
            </li>
          )
        })}
      </ul>
      <Snackbar is_open={is_open} on_close={() => setOpen(false)}/>
    </div>
  );

  function deleteQuestion(id) {
    axios.get('api/question/delete/' + id).then(response => {
      updateQuestions(response.data);
      setOpen(true)
    });
  }

  function updateQuestionsBag() {
    axios.get('api/questions_list').then(response => {
      updateQuestions(response.data)
    })
  }
}