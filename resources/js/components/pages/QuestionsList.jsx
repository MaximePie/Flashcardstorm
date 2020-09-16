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
import { AuthenticationContext } from '../../Contexts/authentication';
import { viewportContext } from '../../Contexts/viewport';

export default function QuestionsList() {
  const isConnected = React.useContext(AuthenticationContext);
  const isMobile = React.useContext(viewportContext);

  const [questions, setQuestions] = React.useState();
  const { enqueueSnackbar } = useSnackbar();

  const [switchStatus, setSwitchStatus] = React.useState(false);

  React.useEffect(() => {
    document.getElementById('App').style.background = 'content-box no-repeat url("../images/registerbackground.jpeg")';
    document.getElementById('App').style.backgroundSize = 'cover';
  }, []);

  React.useEffect(() => {
    fetchQuestions();
  }, [switchStatus]);

  React.useEffect(() => {
  }, [questions?.data]);

  return (
    <div className="QuestionsList">
      <div className="QuestionsList__title">
        {header()}
        {isConnected && (
          <>
            <FormControlLabel
              control={<Switch checked={switchStatus} onChange={() => setSwitchStatus(!switchStatus)}/>}
              label="Afficher seulement mes questions"
            />
          </>
        )}
      </div>
      <form className="QuestionsList__form">
        <div className="QuestionsList__list">
          <div className="QuestionsList__questions-container">
            <div
              key={`question-Header`}
              className="QuestionsList__question list-group-item card QuestionsList__question--header"
            >
              <span>Question</span>
              <span>Réponse</span>
              <span>Prochain gain</span>
              <span>Prochaine question</span>
              <span>Catégorie</span>
              <span>Question inversée</span>
              <span>
                Actions
                <Checkbox
                  onChange={toggleAllQuestions}
                  value="toggleAll"
                  color="primary"
                  inputProps={{
                    'aria-label': 'secondary checkbox',
                  }}
                />
              </span>
            </div>

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
        </div>
      </form>
      {questions?.data?.length && (
        <>
          <div className="QuestionsList__actions">
            {isConnected &&
            <Button text={isMobile ? 'Enregistrer' : 'Enregistrer la sélection'} onClick={saveSelection}/>
            }
            {questions.last_page !== 1 && (
              <Pagination changePage={fetchQuestions} data={questions}/>
            )}
          </div>
        </>
      )}
    </div>
  );

  /**
   * Delete a question
   * @param id The id of the question we need to delete
   */
  function deleteQuestion(id) {
    const deletedQuestion = document.getElementById(`question${id}`);
    if (deletedQuestion) {
      deletedQuestion.classList.add('QuestionsList__question--disappearing')
    }
    server.get('question/delete/' + id)
      .then(response => {
        fetchQuestions();
      });
  }

  /**
   * Update the list of questions assigned to the user
   */
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

  /**
   * Activate or deactivate the question for the user
   * @param event The event to know if it is checked or not
   * @param id The ID, useless. :(
   * @param key The key in the questionsData bag
   */
  function toggleQuestionForUser(event, id, key) {
    let questionsData = Object.assign({}, questions.data);
    questionsData[key].isSetForUser = event.target.checked;
    setQuestions({
      ...questions,
      questionsData
    });
  }

  /**
   * Tick all the questions at once
   * @param event
   */
  function toggleAllQuestions(event) {
    let questionsData = Object.assign({}, questions.data);
    Object.values(questionsData)
      .forEach(selectedQuestion => {
        selectedQuestion.isSetForUser = event.target.checked;
      });

    setQuestions({
      ...questions,
      questionsData
    });
  }

  /**
   * Update the list of questions and set it
   * @param data
   */
  function fetchQuestions(data = null) {
    const url = switchStatus === true ? 'questions_list/for_user' : 'questions_list/all';
    let page = undefined;
    if (data?.page) {
      page = 'page=' + data.page;
    }
    server.get(url, page)
      .then(response => {
        setQuestions(response.data.questions || undefined);
      });
  }

  /**
   * Returns the header of the page
   */
  function header() {
    if (!isMobile) {
      return <h1>Liste des questions</h1>;
    } else {
      return <h2 className="QuestionsList__title">Liste des questions</h2>;
    }
  }
}
