import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import server from '../../server';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Pagination } from 'react-laravel-paginex';
import Button from '../molecule/Button';
import { useSnackbar } from 'notistack';
import Checkbox from '@material-ui/core/Checkbox';
import QuestionsListItem from '../molecule/QuestionsListItem';
import { isMobile } from '../../helper';


export default function QuestionsList(props) {

  const [questions, updateQuestions] = React.useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [switchStatus, setSwitchStatus] = React.useState(false);

  React.useEffect(() => {
    updateQuestionsBag();
  }, [switchStatus]);

  React.useEffect(() => {
  }, [questions?.data]);

  return (
    <div className="QuestionsList">
      <div className="card QuestionsList__content">
        <div className="QuestionsList__title">
          {!isMobile() && (
            <>
              <h1>Liste des questions</h1>
              <p>Cliquez sur la Checkmark pour ajouter ou retirer une question de votre collection</p>
              <p>Une question est automatiquement intégrée à votre collection quand vous créez une question ou quand vous
                y répondez depuis le mode Tempête</p>
              {props.is_connected && questions?.data && (
                <Button text="Enregistrer la sélection" onClick={saveSelection}/>
              )}
            </>
          )}
          {isMobile() && (
            <h2 className="QuestionsList__title">Liste des questions</h2>
          )}
          {props.is_connected && (
            <>
              <FormControlLabel
                control={
                  <Switch checked={switchStatus} onChange={() => setSwitchStatus(!switchStatus)}/>
                }
                label="Afficher seulement mes questions"
              />

            </>
          )}
        </div>
        <form className="QuestionsList__list">
          <ul className="list-group list-group-flush">
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
                label={'Cocher toutes les questions'}
              />
            </div>
            {questions?.data?.map(function (question, key) {
              return (
                <QuestionsListItem
                  key={key}
                  question={question}
                  questionKey={key}
                  deleteQuestion={deleteQuestion}
                  toggleQuestionForUser={toggleQuestionForUser}
                  key={'question-' + key}
                  isConnected={props.is_connected}
                />
              );
            })}
          </ul>
        </form>
        {questions?.data?.length && (
          <>
            <div className="QuestionsList__actions">
              <Button text={isMobile() ? "Enregistrer" : "Enregistrer la sélection"} onClick={saveSelection}/>
              <Pagination changePage={updateQuestionsBag} data={questions}/>
            </div>
          </>
        )}
      </div>
    </div>
  );

  function deleteQuestion(id) {
    server.get('question/delete/' + id)
      .then(response => {
        updateQuestionsBag();
      });
  }


  function saveSelection() {
    server.post('question/toggle', { questions: questions.data })
      .then(response => {
        enqueueSnackbar('Votre sélection a bien été enregistrée !', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          }
        });
      });
  }

  function toggleQuestionForUser(event, id, key) {
    console.log(id, key)
    let questionsData = Object.assign({}, questions.data);
    questionsData[key].isSetForUser = event.target.checked;
    console.log(questionsData)
    updateQuestions({
      ...questions,
      questionsData
    });
  }

  function toggleAllQuestions(event) {
    let questionsData = Object.assign({}, questions.data);
    Object.values(questionsData)
      .forEach(selectedQuestion => {
        selectedQuestion.isSetForUser = event.target.checked;
      });

    updateQuestions({
      ...questions,
      questionsData
    });
  }

  function updateQuestionsBag(data = null) {
    const url = switchStatus === true ? 'questions_list/for_user' : 'questions_list/all';
    let page = undefined;
    if (data?.page) {
      page = 'page=' + data.page;
    }
    server.get(url, page)
      .then(response => {
        updateQuestions(response.data.questions || undefined);
      });
  }
}
