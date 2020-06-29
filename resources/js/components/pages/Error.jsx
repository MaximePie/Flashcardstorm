import React from 'react';
import { PropTypes } from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '../molecule/Button';

Error.propTypes = {
  code: PropTypes.number.isRequired,
};

export default function Error(props) {
  const { code } = props;

  return (
    <div className="Error">
      <Card>
        <Typography gutterBottom variant="h5" component="h2" className="Error__title">
          Oups...
        </Typography>
        {code === 403 && (
          <CardContent>Vous devez vous connecter pour accéder à cette partie du site.</CardContent>
        )}
        <CardActions>
          <Button text="Se connecter" onClick={() => redirectTo('login')} />
          <button
            type="button"
            className="Button btn Button--secondary Button--small"
            onClick={() => redirectTo('register')}
          >
            S'enregistrer
          </button>
        </CardActions>
      </Card>
    </div>
  );

  /**
   * Redirects the user to login page
   */
  function redirectTo(path) {
    document.location = `/${path}`;
  }
}
