import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import server from '../../server';

export default function ProfileDailyObjective() {
  const [dailyObjectives, setDailyObjectives] = React.useState([]);

  useEffect(() => {
    fetchUsersDailyObjective();
  }, []);

  return (
    <div className="ProfileDailyObjective">
      <h3 className="ProfileDailyObjective__header">Succès</h3>
      <div className="ProfileDailyObjective__body">
        <div className="ProfileDailyObjective__progress">
          {dailyObjectives.map((objective) => (
            <div
              className={
              `ProfileDailyObjective__progress-step ProfileDailyObjective__progress-step--${objective.state}`
            }
              key={objective.wording}
            >
              <div className="ProfileDailyObjective__progress-step-circle" />
              <span className="ProfileDailyObjective__progress-step-wording">{objective.wording}</span>
              <Link
                className="ProfileDailyObjective__progress-wording-action Button btn btn-primary"
                to={objective.link}
              >
                {objective.buttonWording}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * Fetch the users Daily Objective and set it
   */
  function fetchUsersDailyObjective() {
    server.get('me/dailyObjectives')
      .then((response) => {
        const { objectives } = response.data;
        if (objectives) {
          setDailyObjectives(objectives);
        }
      });
  }
}
