import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import server from '../../server';

import ProfileAchievement from '../atom/ProfileAchievement';

export default function ProfileAchievementsCard() {
  const [dailyObjectives, setDailyObjectives] = React.useState([]);

  useEffect(() => {
    fetchUsersDailyObjective();
  }, []);

  return (
    <div className="ProfileAchievements">
      <h3 className="ProfileAchievements__header">Succès</h3>
      <div className="ProfileAchievements__progress">
        {dailyObjectives.map((objective) => (
          <ProfileAchievement objective={objective} />
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
