import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import { PropTypes } from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import { Link } from 'react-router-dom';
import CloseIcon from '../atom/CloseIcon';
import Button from '../atom/Button';

AchievementDialog.propTypes = {
  objective: PropTypes.shape({
    state: PropTypes.string,
    link: PropTypes.string,
    buttonWording: PropTypes.string,
    wording: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};


export default function AchievementDialog({ onClose, objective }) {
  /**
   * Returns the DialogActions component
   */
  function dialogActions() {
    return (
      <DialogActions>
        {objective.state === 'current' && (
          <>
            <Button variant="secondary" text="Retour" onClick={onClose} />
            <Link
              className="Button btn btn-primary"
              to={objective.link}
            >
              {objective.buttonWording}
            </Link>
          </>
        )}
        {objective.state !== 'current' && (
          <Button variant="secondary" text="Retour" onClick={onClose}/>
        )}
      </DialogActions>
    );
  }

  return (
    <Dialog open onClose={onClose} className="AchievementDialog">
      <DialogTitle className="AchievementDialog__header">
        Prochaine étape :
        {' '}
        {objective.wording}
        <CloseIcon className="AchievementDialog__close" onClick={onClose}/>
      </DialogTitle>
      <DialogContent className="AchievementDialog__content">
        {objective.description}
      </DialogContent>
      {dialogActions()}
    </Dialog>
  );
}
