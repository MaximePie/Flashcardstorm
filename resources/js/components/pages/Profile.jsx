import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import server from '../../server';
import LoadingSpinner from '../atom/LoadingSpinner';
import ProfileDataContainer from '../molecule/ProfileDataContainer';
import ProfileDailyObjective from '../molecule/ProfileDailyObjective';
import ProfileAchievements from '../molecule/ProfileAchievements';
import { isMobile } from '../../helper';


export default function Profile() {
  const [user, setUser] = React.useState(undefined);
  const [loading, setLoadingState] = React.useState(false);
  const [questions, setMemorizedQuestions] = React.useState([]);
  const [allQuestionsDisplay, setAllQuestionsDisplay] = React.useState(false);

  React.useEffect(() => {
    fetchQuestions();
    fetchUserName();
  }, []);

  return (
    <div className="Profile">
      <>
        <div className="jumbotron Profile__title">
          <h2>
            {`Bienvenue, ${user || 'héros'}`}
          </h2>
        </div>
        <div className="Profile__heading-row">
          <ProfileDailyObjective />
          <ProfileDataContainer />
        </div>
        <div className="Profile__achievements-row">
          <ProfileAchievements />
        </div>
        <div className="Profile__questions-header-row">
          <h3 className="Profile__questions-title">
            Questions
            {filteredQuestions().length ? ` (${filteredQuestions().length})` : ''}
          </h3>
          <div className="Profile__questions-input-container">
            <label className="Profile__questions-input-label">
              Afficher les questions inverses
            </label>
            <input
              type="checkbox"
              className="Profile__questions-input"
              onChange={() => { setAllQuestionsDisplay(!allQuestionsDisplay); }}
              value={allQuestionsDisplay}
            />
          </div>
        </div>
        <div className="Profile__questions">
          {!loading && (
            <Paper className="Profile__questions-container">
              <div className="Profile__question-info Profile__question-info--header">
                <h4>Question</h4>
                <span className="Profile__question-details">Progression</span>
              </div>
              {filteredQuestions().map((question) => (
                <div className="Profile__question" key={`Question-${question.id}`}>
                  <div className="Profile__question-info">
                    <h4 className="Profile__question-info-wording">
                      {question.wording}
                    </h4>
                    <span
                      className={
                        `Profile__question-details Profile__question-details${
                          question.isMemorized ? '--memorized' : '--not-memorized'
                        }`
                      }
                    >
                      {!isMobile() && (question.isMemorized ? 'Mémorisée' : 'En cours')}
                      {isMobile() && (
                        question.isMemorized ? <i className="fas fa-check" /> : <i className="fas fa-clock" />
                      )}
                    </span>
                  </div>
                  <h5 className="Profile__question-info-answer">
                    {question.answer}
                  </h5>
                </div>
              ))}
            </Paper>
          )}
          {loading && <LoadingSpinner />}
        </div>
      </>
    </div>
  );

  /**
   * Get the user questions info
   */
  function fetchQuestions() {
    setLoadingState(true);

    server.get('myMemorizedQuestions')
      .then((response) => {
        const { memorizedQuestions: memorizedQuestionsData } = response.data;
        const sortedMemorizedQuestions = [...memorizedQuestionsData];
        sortedMemorizedQuestions.sort((questionA, questionB) => {
          if (!questionB.isMemorized) {
            return -1;
          }

          return 1;
        });
        setMemorizedQuestions(sortedMemorizedQuestions);
        setLoadingState(false);
      });
  }

  /**
   * Fetch the user name and set it in the user hook
   */
  function fetchUserName() {
    server.get('me').then((response) => {
      const userProfile = response.data.user;
      if (userProfile) {
        setUser(userProfile.name);
      }
    });
  }

  /**
   * Filter the questions according to active filters
   * @returns {*[]}
   */
  function filteredQuestions() {
    return questions.filter((question) => {
      if (allQuestionsDisplay) {
        return question;
      }
      return !question.reverse_question_id ? question : undefined;
    });
  }
}
