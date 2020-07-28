import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import server from '../../server';
import LoadingSpinner from '../atom/LoadingSpinner';
import ProfileDataContainer from '../molecule/ProfileDataContainer';
import ProfileDailyObjective from '../molecule/ProfileDailyObjective';
import ProfileAchievements from '../molecule/ProfileAchievements';


export default function Profile() {
  const [user, setUser] = React.useState(undefined);
  const [loading, setLoadingState] = React.useState(false);
  const [questions, setMemorizedQuestions] = React.useState([]);

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
        <h3 className="Profile__questions-title">
          Questions
          {questions.length ? ` (${questions.length})` : ''}
        </h3>
        <div className="Profile__questions">
          {!loading && (
            <Paper className="Profile__questions-container">
              <div className="Profile__question-info Profile__question-info--header">
                <h4>Question</h4>
                <span className="Profile__question-details">Etat</span>
              </div>
              {questions.map((question) => (
                <div className="Profile__question" key={`Question-${question.id}`}>
                  <div className="Profile__question-info">
                    <h4>
                      {question.wording}
                    </h4>
                    <span
                      className={
                        `Profile__question-details Profile__question-details${
                          question.isMemorized ? '--memorized' : '--not-memorized'
                        }`
                      }
                    >
                      {question.isMemorized ? 'Mémorisée' : 'En cours'}
                    </span>
                  </div>
                  <h5>
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
}
