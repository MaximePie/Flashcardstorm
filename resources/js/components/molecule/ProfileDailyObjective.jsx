import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import server from '../../server';
import dailyObjectiveIllustration from '../../../images/dailyObjective.svg';

export default function ProfileDailyObjective() {
  const [dailyObjective, setDailyObjective] = React.useState({});

  useEffect(() => {
    fetchDailyObjective();
  }, []);

  return (
    <div className="ProfileDailyObjective">
      <h3 className="ProfileDailyObjective__header">Objectif du jour</h3>
      {dailyObjective && (
        <div className="ProfileDailyObjective__body">
          <img
            src={dailyObjectiveIllustration}
            alt="Objectif journalier"
            className="ProfileDailyObjective__illustration"
          />
          <span className="ProfileDailyObjective__body-text">
            {dailyObjective.numberOfQuestions && `${dailyObjective.numberOfQuestions} questions à répondre`}
          </span>
          <Link className="ProfileDailyObjective__body-action Button btn-primary btn" to="/soft_training">
            S'entraîner
          </Link>
        </div>
      )}
    </div>
  );

  /**
   * Fetch the DailyObjective and set it
   */
  function fetchDailyObjective() {
    server.get('me/dailyObjective')
      .then((response) => {
        const { dailyObjectiveData } = response.data;
        if (dailyObjectiveData) {
          setDailyObjective({ numberOfQuestions: dailyObjectiveData });
        }
      });
  }
}
