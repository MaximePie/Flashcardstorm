import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import server from '../../server';

export default function ProfileAchievements() {
  const [dailyObjectives, setDailyObjectives] = React.useState([]);

  useEffect(() => {
    fetchUsersDailyObjective();
  }, []);

  return (
    <div className="ProfileAchievements">
      <h3 className="ProfileAchievements__header">Succès</h3>
      <div className="ProfileAchievements__progress">
        {dailyObjectives.map((objective) => (
          <div
            className={
              `ProfileAchievements__progress-step ProfileAchievements__progress-step--${objective.state}`
            }
            key={objective.wording}
          >
            <div className="ProfileAchievements__progress-step-circle" />
            <span className="ProfileAchievements__progress-step-wording">{objective.wording}</span>
            {objective.state === 'current' && (
              <Link
                className="ProfileAchievements__progress-wording-action Button btn btn-primary"
                to={objective.link}
              >
                {objective.buttonWording}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );


  /**
   * Fetch the users Daily Objective and set it
   */
  function fetchUsersDailyObjective() {
    server.get('me/achievements')
      .then((response) => {
        const { objectives } = response.data;
        if (objectives) {
          setDailyObjectives(objectives);
        }
      });
  }
}
