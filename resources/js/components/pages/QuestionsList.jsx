import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import server from "../../server";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {Pagination} from "react-laravel-paginex";
import Button from "../molecule/Button";
import {useSnackbar} from "notistack";
import Checkbox from "@material-ui/core/Checkbox";
import QuestionsListItem from "../molecule/QuestionsListItem";



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
          <div className="QuestionsList__global-checker">
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
          </div>
          {questions && questions.data && questions.data.length && questions.data.map(function(question, key){
            return (
              <QuestionsListItem
                question={question}
                questionKey={key}
                deleteQuestion={deleteQuestion}
                toggleQuestionForUser={toggleQuestionForUser}
                key={"question-"+key}
                is_connected={props.is_connected}
              />
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