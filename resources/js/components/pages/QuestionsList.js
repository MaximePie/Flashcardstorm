import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import server from "../../server";
import Icon from "../Icon";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {Pagination} from "react-laravel-paginex";
import Button from "../Button";
import {useSnackbar} from "notistack";
import Checkbox from "@material-ui/core/Checkbox";
import toLocale from '../../helper';



export default function QuestionsList(props) {

  const [questions, updateQuestions] = React.useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [switchStatus, setSwitchStatus] = React.useState(false);

  React.useEffect(() => {
    updateQuestionsBag()
  }, [switchStatus]);

  React.useEffect(() => {
  }, [questions && questions.data]);

  return (
    <div className="QuestionsList">
      <div className="jumbotron QuestionsList__title">
        <h1>Liste des questions</h1>
        <p>Cliquez sur la Checkmark pour ajouter ou retirer une question de votre collection</p>
        <p>Une question est automatiquement intégrée à votre collection quand vous créez une question ou quand vous y répondez depuis le mode Tempête</p>
        {props.is_connected && (
          <>
          <FormControlLabel
            control={
              <Switch checked={switchStatus} onChange={() => setSwitchStatus(!switchStatus)}/>
            }
            label="Afficher seulement mes questions"
          />
          {props.is_connected && questions && questions.data && (
            <Button text="Enregistrer la sélection" onClick={saveSelection}/>
          )}
          </>
        )}
      </div>
      <form className="QuestionsList__list">
        <ul className="container list-group list-group-flush">
          <FormControlLabel
            control={
              <Checkbox
                onChange={toggleAllQuestions}
                value="toggleAll"
                color="primary"
                inputProps={{
                  'aria-label': 'secondary checkbox',
                }}
              />
              }
            label={"Cocher toutes les questions"}
          />
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
                        <div className="QuestionsList__question-next">Prochaine question le {toLocale(question.next_question_at)}</div>
                      )}
                    </>
                  )}
                </div>
                <div className="QuestionsList__actions">
                  {props.is_connected && (
                    <>
                      <input
                        type="checkbox"
                        value={question.id}
                        checked={question.is_set_for_user}
                        onChange={(event) => toggleQuestionForUser(event, question.id, key)}
                        className="QuestionsList__toggle-button"
                        />
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
      </form>
      {questions && questions.data && questions.data.length && (
        <>
          <Button text="Enregistrer la sélection" onClick={saveSelection}/>
          <Pagination changePage={updateQuestionsBag} data={questions}/>
        </>
      )}
    </div>
  );

  function deleteQuestion(id) {
    server.get('question/delete/' + id).then(response => {
      updateQuestionsBag();
    });
  }


  function saveSelection() {
    server.post('question/toggle', {questions: questions.data}).then(response => {
      enqueueSnackbar('Votre sélection a bien été enregistrée !', {variant: "success", anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        }});
    });
  }

  function toggleQuestionForUser(event, id, key) {
    let questionsData = Object.assign({}, questions.data);
    questionsData[key].is_set_for_user = event.target.checked;
    updateQuestions({...questions, questionsData});
  }

  function toggleAllQuestions(event) {
    let questionsData = Object.assign({}, questions.data);
    Object.values(questionsData).forEach(selectedQuestion => {
      selectedQuestion.is_set_for_user = event.target.checked;
    });
    console.log(questionsData)
    updateQuestions({...questions, questionsData});
  }

  function updateQuestionsBag(data = null) {
    const url = switchStatus === true ? 'questions_list/for_user' : 'questions_list/all';
    let page = undefined;
    if(data && data.page) {
      page = 'page=' + data.page;
    }
    server.get(url, page).then(response => {
      updateQuestions(response.data.questions || undefined)
    });
  }
}