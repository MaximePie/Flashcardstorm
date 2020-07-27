import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  CartesianGrid, Line, LineChart, XAxis, YAxis,
} from 'recharts';
import Cookies from 'js-cookie';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import { isMobile } from '../../helper';
import server from '../../server';
import LoadingSpinner from '../atom/LoadingSpinner';
import ProfileDataContainer from '../molecule/ProfileDataContainer';


export default function Profile() {
  const [user, setUser] = React.useState(undefined);
  const [loading, setLoadingState] = React.useState(false);
  const [questions, setMemorizedQuestions] = React.useState([]);

  React.useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="Profile">
      <>
        <div className="jumbotron Profile__title">
          <h2>
            {`Bienvenue, ${user && user}`}
          </h2>
        </div>
        <ProfileDataContainer />
        <h3 className="Profile__questions-title">
          Questions
          {questions.length ? ` (${questions.length})` : ''}
        </h3>
        <div className="Profile__questions">
          {!loading && (
            <Paper className="Profile__questions-container">
              <div className={'Profile__question-info Profile__question-info--header'}>
                <h4>Question</h4>
                <span className="Profile__question-details">Etat</span>
              </div>
              {questions.map((question) => (
                <div className="Profile__question">
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
}
