import React from 'react';
import { Link } from 'react-router-dom';

import { PropTypes } from 'prop-types';

ProfileAchievement.propTypes = {
  objective: PropTypes.shape({
    state: PropTypes.string,
    link: PropTypes.string,
    buttonWording: PropTypes.string,
    wording: PropTypes.string,
  }).isRequired,
};

export default function ProfileAchievement({ objective }) {
  return (
    <div
      className={`ProfileAchievement ProfileAchievement--${objective.state}`}
      key={objective.wording}
    >
      <div className="ProfileAchievement__circle" />
      <span className="ProfileAchievement__wording">{objective.wording}</span>
      {objective.state === 'current' && (
        <Link
          className="Button btn btn-primary"
          to={objective.link}
        >
          {objective.buttonWording}
        </Link>
      )}
    </div>
  );
}
