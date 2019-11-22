import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import axios from "axios";


export default function QuestionsList() {

  const [questions, updateQuestions] = React.useState(undefined);


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
            <li className="list-group-item">
              <h3 className="QuestionsList__question-wording">{question.wording}</h3>
              <span className="QuestionsList__question-answer">{question.answer}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )

  function updateQuestionsBag() {
    axios.get('api/questions_list').then(response => {
      updateQuestions(response.data)
    })
  }
}