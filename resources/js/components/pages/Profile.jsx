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


export default function Profile() {
  const [user, setUser] = React.useState(undefined);
  const [loading, setLoadingState] = React.useState({
    user: false,
    memorizedQuestions: false,
  });
  const [statistics, setStatistics] = React.useState(undefined);
  const [memorizedQuestions, setMemorizedQuestions] = React.useState([]);

  React.useEffect(() => {
    fetchUserInfo();
  }, []);


  return (
    <div className="Profile">
      <>
        <div className="jumbotron Profile__title">
          <h2>
            {`Bienvenue, ${user && user}`}
          </h2>
        </div>
        <div className="Profile__chart-zone">
          <h3>Progression des questions mémorisées</h3>
          {!loading.user && (
            <>
              {statistics && (
                <>
                  <p className="Profile__chart-zone-text">
                    Vous n'avez mémorisé aucune question pour le moment. Pour mémoriser des questions :
                  </p>
                  <ul>
                    <li>Vérifiez que vous ayiez bien des questions dans votre kit</li>
                    <li>
                      Répondez 10 fois correctement à une question en
                      <Link to="/training"> mode entraînement </Link>
                      ou
                      <Link to="rough_training"> mode rapide </Link>
                    </li>
                    <ul />
                  </ul>
                </>
              )}
              {!statistics && (
                <LineChart width={lineChartSize('width')} height={lineChartSize('height')} data={statistics}>
                  <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" />
                </LineChart>
              )}
            </>
          )}
          {loading.user && (
            <LoadingSpinner />
          )}
        </div>
        <h3 className="Profile__memorized-questions-title">
          Questions
          {memorizedQuestions.length ? ` (${memorizedQuestions.length})` : ''}
        </h3>
        <div className="Profile__memorized-questions">
          {!loading.memorizedQuestions && (
            <Paper className="Profile__memorized-question">
              <div className="Profile__memorized-question-info">
                <h4>Question</h4>
                <span className="Profile__memorized-question-details">Etat</span>
              </div>
              {memorizedQuestions.map((question) => (
                <div>
                  <div className="Profile__memorized-question-info">
                    <h4>
                      {question.wording}
                    </h4>
                    <span
                      className={
                        `Profile__memorized-question-details Profile__memorized-question-details${
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
          {loading.memorizedQuestions && <LoadingSpinner />}
        </div>
      </>
    </div>
  );

  function fetchUserInfo() {
    setLoadingState({
      user: true,
      memorizedQuestions: true,
    });
    axios.get(`api/me?api_token=${Cookies.get('Bearer')}`)
      .then((response) => {
        const {
          user: userData,
          statistics: statisticsData,
        } = response.data;
        const formatedStatistics = statisticsData.map((statistic) => ({
          name: moment(statistic.created_at)
            .format('MMM Do YY'),
          uv: statistic.memorized_questions,
          pv: 2400,
          amt: 2400,
        }));
        setUser(userData);
        setStatistics(formatedStatistics);
        setLoadingState({
          ...loading,
          user: false,
        });
      });

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
        setLoadingState({
          ...loading,
          memorizedQuestions: false,
        });
      });
  }

  /**
   * Calculates the size of the chart component according to its viewport type
   * @param dimension Width or Height we want to size
   * @returns {number}
   */
  function lineChartSize(dimension) {
    if (isMobile()) {
      return 280;
    }

    return dimension === 'width' ? 800 : 400;
  }
}
