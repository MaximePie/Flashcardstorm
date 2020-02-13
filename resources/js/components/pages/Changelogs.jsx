import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Cookies from 'js-cookie';
import moment from 'moment';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';
import { toLocale } from '../../helper';
import server from '../../server';
import Icon from '../Icon';

Changelogs.propTypes = {
  isConnected: PropTypes.bool,
};

Changelogs.defaultProps = {
  isConnected: false,
};

export default function Changelogs(props) {
  const [changelogs, setChangelogs] = React.useState([]);
  const { isConnected } = props;

  React.useEffect(() => {
    Cookies.set('last_checked_at', moment()
      .subtract(1, 'hours')
      .format());
    updateChangelogs();
  }, []);

  return (
    <div className="Changelogs">
      <div className="Changelogs__title">
        <h1>Les petits changements</h1>
      </div>
      <div className="Changelogs__list">
        {!changelogs.length && (
          <p>Pas de changements pour l&aposinstant, nous allons revenir avec des bonnes nouvelles très bientôt !</p>
        )}
        {changelogs.map((changelog) => {
          const changelogsLikesLinkClassnames = classNames({
            'Changelogs__like-icon-link': true,
            'Changelogs__like-icon-link--liked': changelog.isSetForUser,
          });

          return (
            <Paper>
              <div className="Changelogs__log">
                <div className="Changelogs__log-like-section">
                  <Tooltip
                    title={
                      isConnected
                        ? 'Nombre de votes pour cette fonctionalité'
                        : 'Vous devez vous connecter pour pouvoir voter'
                    }
                  >
                    <a
                      id={`Changelogs__log-${changelog.id}`}
                      className={changelogsLikesLinkClassnames}
                      onClick={() => handleVote(changelog.id)}
                    >
                      <Icon
                        name="heart"
                        color="mediumspringgreen"
                        className="Changelogs__like-icon"
                      />
                    </a>
                  </Tooltip>
                  <span>
                    {changelog.numberOfVotes}
                  </span>
                </div>
                <div className="Changelogs__log-content">
                  <div>
                    <h3 className="Changelogs__log-title d-inline-flex mr-3">{changelog.title}</h3>
                    <span className="text-secondary text-muted">{toLocale(changelog.created_at)}</span>
                  </div>
                  <p className="Changelogs__log-text">{changelog.text}</p>
                  <p className="Changelogs__log-nextstep">
                    Prochaine étape :
                    {changelog.nextstep}
                  </p>
                </div>
              </div>
            </Paper>
          );
        })}
      </div>
    </div>
  );

  function updateChangelogs() {
    server.get('changelogs')
      .then((response) => {
        setChangelogs(response.data);
      });
  }

  function handleVote(changelogId) {
    if (props.isConnected) {
      server.get(`vote/${changelogId}`)
        .then((response) => {
          setChangelogs(response.data);
        });
    }
  }
}
