import React from 'react';
import { Link } from 'react-router-dom';

import { PropTypes } from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import AchievementDialog from '../molecule/AchievementDialog';

ProfileAchievement.propTypes = {
  objective: PropTypes.shape({
    state: PropTypes.string,
    link: PropTypes.string,
    buttonWording: PropTypes.string,
    wording: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default function ProfileAchievement({ objective }) {
  const [objectiveModalIsOpen, setObjectiveModalIsOpen] = React.useState(false);

  let icon;

  switch (objective.state) {
    case 'achieved':
      icon = 'check-circle';
      break;
    case 'current':
      icon = 'hourglass-half';
      break;
    case 'incoming':
      icon = 'calendar-alt';
      break;
    default:
      icon = 'check-circle';
      break;
  }

  return (
    <>
      {objectiveModalIsOpen && (
        <AchievementDialog
          onClose={() => setObjectiveModalIsOpen(false)}
          objective={objective}
        />
      )}
      <div
        className={`ProfileAchievement ProfileAchievement--${objective.state}`}
        key={objective.wording}
        onClick={() => {
          setObjectiveModalIsOpen(true);
        }}
      >
        <div className="ProfileAchievement__circle">
          <i className={`ProfileAchievement__circle-icon fas fa-${icon}`} />
        </div>
        <Tooltip title="En savoir plus">
          <i
            className="ProfileAchievement__details-trigger fas fa-search"
            onClick={() => setObjectiveModalIsOpen(true)}
          />
        </Tooltip>
        <span className="ProfileAchievement__wording">{objective.wording}</span>
        <span>
          {objective.state === 'current' && (
            <Link
              className="Button btn btn-primary"
              to={objective.link}
            >
              {objective.buttonWording}
            </Link>
          )}
        </span>
      </div>
    </>
  );
}
