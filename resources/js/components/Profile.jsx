import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  LineChart, XAxis, YAxis, CartesianGrid, Line,
} from 'recharts';
import Cookies from 'js-cookie';
import Paper from '@material-ui/core/Paper';


export default function Profile() {
  const [user, setUser] = React.useState(undefined);
  const [statistics, setStatistics] = React.useState(undefined);
  const [memorizedQuestions, setMemorizedQuestions] = React.useState([]);

  React.useEffect(() => {
    fetchUserInfo();
  }, []);


  return (
    <div className="Profile">
      {user && (
        <>
          <div className="jumbotron">
            <h2>
              {`Bienvenue, ${user}`}
            </h2>
          </div>
          <div className="Profile__chart-zone">
            <h3>Progression des questions mémorisées</h3>
            <LineChart width={400} height={400} data={statistics}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
            </LineChart>
          </div>
          <h3>Questions mémorisées</h3>
          <div className="Profile__memorized-questions">
            {memorizedQuestions.map((question) => (
              <Paper className="Profile__memorized-question">
                <h4>
                  {question.wording}
                </h4>
                <h5>
                  {question.answer}
                </h5>
              </Paper>
            ))}
          </div>
        </>
      )}
    </div>
  );

  function fetchUserInfo() {
    axios.get(`api/me?api_token=${Cookies.get('Bearer')}`)
      .then((response) => {
        const {
          user: userData,
          statistics: statisticsData,
          memorizedQuestions: memorizedQuestionsData,
        } = response.data;
        const formatedStatistics = statisticsData.map((statistic) => ({
          // name: 'JAJA',
          name: moment(statistic.created_at)
            .format('MMM Do YY'),
          uv: statistic.memorized_questions,
          pv: 2400,
          amt: 2400,
        }));
        setUser(userData);
        setStatistics(formatedStatistics);
        setMemorizedQuestions(memorizedQuestionsData);
      });
  }
}
