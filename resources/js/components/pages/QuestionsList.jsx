import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import server from '../../server';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Pagination } from 'react-laravel-paginex';
import Button from '../atom/Button';
import { useSnackbar } from 'notistack';
import Checkbox from '@material-ui/core/Checkbox';
import QuestionsListItem from '../molecule/QuestionsListItem';
import { isMobile } from '../../helper';
import { AuthenticationContext } from '../../Contexts/authentication';

export default function QuestionsList() {
  const isConnected = React.useContext(AuthenticationContext);

  const [questions, updateQuestions] = React.useState();
  const { enqueueSnackbar } = useSnackbar();

  const [switchStatus, setSwitchStatus] = React.useState(false);

  React.useEffect(() => {
    document.getElementById('App').style.background = 'content-box no-repeat url("../images/registerbackground.jpeg")';
    document.getElementById('App').style.backgroundSize = 'cover';
  }, [])

  React.useEffect(() => {
    updateQuestionsBag();
  }, [switchStatus]);

  React.useEffect(() => {
  }, [questions?.data]);

  return (
    <div className="QuestionsList">
      <div className="QuestionsList__title">
        {!isMobile() && (
          <>
            <h1>Liste des questions</h1>
            {isConnected && questions?.data && isMobile() && (
              <>
                <p>Cliquez sur la Checkmark pour ajouter ou retirer une question de votre collection</p>
                <p>Une question est automatiquement intégrée à votre collection quand vous créez une question ou quand vous
                  y répondez depuis le mode Tempête</p>
                <Button text="Enregistrer la sélection" onClick={saveSelection}/>
              </>
            )}
          </>
        )}
        {isMobile() && (
          <h2 className="QuestionsList__title">Liste des questions</h2>
        )}
        {isConnected && (
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
      <form className="QuestionsList__form">
        <ul className="QuestionsList__list">
          {questions?.data?.length && isConnected && (
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
          )}

          <div className="QuestionsList__questions-container">
            {questions?.data?.map(function (question, key) {
              return (
                <QuestionsListItem
                  question={question}
                  questionKey={key}
                  deleteQuestion={deleteQuestion}
                  toggleQuestionForUser={toggleQuestionForUser}
                  key={'question-' + key}
                />
              );
            })}
          </div>
        </ul>
      </form>
      {questions?.data?.length && (
        <>
          <div className="QuestionsList__actions">
            {isConnected &&
              <Button text={isMobile() ? "Enregistrer" : "Enregistrer la sélection"} onClick={saveSelection}/>
            }
            {questions.last_page !== 1 && (
              <Pagination changePage={updateQuestionsBag} data={questions}/>
            )}
          </div>
        </>
      )}
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
