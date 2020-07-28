import React from 'react';
import { Link } from 'react-router-dom';
import {
  CartesianGrid, Line, LineChart, XAxis, YAxis,
} from 'recharts';
import moment from 'moment';
import LoadingSpinner from '../atom/LoadingSpinner';
import { isMobile } from '../../helper';
import server from '../../server';

export default function ProfileDataContainer() {
  const [isLoading, setLoadingState] = React.useState(false);
  const [statistics, setStatistics] = React.useState(undefined);

  React.useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="ProfileDataContainer">
      <div className="ProfileDataContainer__zone">
        <h3 className="ProfileDataContainer__zone-title">Progression des questions mémorisées</h3>
        {!isLoading && (
          <>
            {!statistics && (
              <>
                <p className="ProfileDataContainer__zone-text">
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
                </ul>
              </>
            )}
            {statistics && (
              <LineChart width={lineChartSize('width')} height={lineChartSize('height')} data={statistics}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
              </LineChart>
            )}
          </>
        )}
        {isLoading && (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );

  /**
   * Fetch user statistics
   */
  function fetchStatistics() {
    setLoadingState(true);
    server.get('me/statistics')
      .then((response) => {
        const { statistics: statisticsData } = response.data;
        const formatedStatistics = statisticsData.map((statistic) => ({
          name: moment(statistic.created_at)
            .format('MMM Do YY'),
          uv: statistic.memorized_questions,
          pv: 2400,
          amt: 2400,
        }));
        setStatistics(formatedStatistics);
        setLoadingState(false);
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
