import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import server from '../../server';

export default function ProfileDailyObjective() {
  const [dailyObjective, setDailyObjective] = React.useState({});

  useEffect(() => {
    fetchUsersDailyObjective();
  });

  return (
    <div className="ProfileDailyObjective">
      <h3 className="ProfileDailyObjective__header">Objectif du jour (Bêta)</h3>
      <div className="ProfileDailyObjective__body">
        <div className="ProfileDailyObjective__progress">
          <div className="ProfileDailyObjective__progress-step ProfileDailyObjective__progress-step--current">
            <div className="ProfileDailyObjective__progress-step-circle" />
            <span className="ProfileDailyObjective__progress-step-wording">Saisir les informations</span>
            <Link className="ProfileDailyObjective__progress-wording-action Button btn btn-primary" to="/">Allez</Link>
          </div>
          <div className="ProfileDailyObjective__progress-step ProfileDailyObjective__progress-step--incoming">
            <div className="ProfileDailyObjective__progress-step-circle" />
            <span className="ProfileDailyObjective__progress-step-wording">Saisir les informations</span>
            <Link className="ProfileDailyObjective__progress-wording-action Button btn btn-primary" to="/">Allez</Link>
          </div>
          <div className="ProfileDailyObjective__progress-step ProfileDailyObjective__progress-step--incoming">
            <div className="ProfileDailyObjective__progress-step-circle" />
            <span className="ProfileDailyObjective__progress-step-wording">Saisir les informations</span>
            <Link className="ProfileDailyObjective__progress-wording-action Button btn btn-primary" to="/">Allez</Link>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Fetch the users Daily Objective and set it
   */
  function fetchUsersDailyObjective() {
    server.get('me/dailyObjectives').then((response) => {
      const { objective } = response.data;
      if (objective) {
        setDailyObjective(objective);
      }
    });
  }
}
