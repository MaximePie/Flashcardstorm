import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import server from "../../server";
import Icon from "../Icon";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {Pagination} from "react-laravel-paginex";



export default function QuestionsList(props) {

  const [questions, updateQuestions] = React.useState(undefined);
  const [is_open, setOpen] = React.useState(false);

  const [switchStatus, setSwitchStatus] = React.useState(false);

  React.useEffect(() => {
    updateQuestionsBag()
  }, [switchStatus]);

  return (
    <div className="QuestionsList">
      <div className="jumbotron QuestionsList__title">
        <h1>Liste des questions</h1>
        <p>Cliquez sur la Checkmark pour ajouter ou retirer une question de votre collection</p>
        <p>Une question est automatiquement intégrée à votre collection quand vous créez une question ou quand vous y répondez depuis le mode Tempête</p>
        {props.is_connected && (
          <FormControlLabel
            control={
              <Switch checked={switchStatus} onChange={() => setSwitchStatus(!switchStatus)}/>
            }
            label="Afficher seulement mes questions"
          />
        )}
      </div>
      <ul className="container list-group list-group-flush">
        {questions && questions.data && questions.data.length && questions.data.map(function(question, key){
          return (
            <li key={`question${question.id}`} className="QuestionsList__question list-group-item">
              {question.category && (
                <Icon
                  className={"QuestionsList__category-icon"}
                  name={question.category.icon}
                  badge={question.category.name}
                  color={question.category.color}
                />
              )}
              {!question.category && (
                <Icon
                  className={"QuestionsList__category-icon"}
                  name={'question'}
                  badge={'divers'}
                  color={'grey'}
                />
              )}
              <div>
                <h3 className="QuestionsList__question-wording">{question.wording}</h3>
                <div className="QuestionsList__question-answer">{question.answer}</div>
                {props.is_connected && (
                  <>
                    {question.score && (
                      <div className="QuestionsList__question-score">Prochain gain : +{question.score}</div>
                    )}
                    {question.next_question_at && (
                      <div className="QuestionsList__question-next">Prochaine question le {question.next_question_at}</div>
                    )}
                  </>
                )}
              </div>
              <div className="QuestionsList__actions">
                {props.is_connected && (
                  <>
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      className={"QuestionsList__delete-button QuestionsList__toggleButton" + (question.is_set_for_user ? "--set" : "--unset")}
                      onClick={() => toggleQuestionForUser(question.id, key)}
                    >
                      <i className="far fa-check-circle QuestionsList__delete-icon"/>
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      className="QuestionsList__delete-button"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      <i className="far fa-trash-alt QuestionsList__delete-icon"/>
                    </IconButton>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      {questions && questions.data && questions.data.length && (
        <Pagination changePage={updateQuestionsBag} data={questions}/>
      )}
    </div>
  );

  function deleteQuestion(id) {
    server.get('question/delete/' + id).then(response => {
      updateQuestions(response.data);
    });
  }

  function toggleQuestionForUser(id, key) {
    server.get('question/toggle/' + id).then(response => {
      let questionsBag = questions;
      questionsBag[key].is_set_for_user = response.data.is_set_for_user;
      updateQuestions([...questionsBag]);
    });
  }

  function updateQuestionsBag(data = null) {
    const url = switchStatus === true ? 'questions_list/for_user' : 'questions_list/all';
    let page = undefined;
    if(data && data.page) {
      page = 'page=' + data.page;
    }
    console.log(page)
    console.log(data)
    server.get(url, page).then(response => {
      updateQuestions(response.data.questions || undefined)
    });
  }
}