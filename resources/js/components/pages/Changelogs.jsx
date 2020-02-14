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
import Button from '../molecule/Button';

Changelogs.propTypes = {
  isConnected: PropTypes.bool,
};

Changelogs.defaultProps = {
  isConnected: false,
};

export default function Changelogs(props) {
  const [changelogs, setChangelogs] = React.useState([]);
  const [potentialChangelogs, setPotentialChangelogs] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('potential');
  const { isConnected } = props;

  React.useEffect(() => {
    updateChangelogs();
  }, []);

  function changelogsList(displayedChangelogs) {
    return (
      <>
        {!potentialChangelogs.length && (
          <p>Pas de changements pour l&aposinstant, nous allons revenir avec des bonnes nouvelles très bientôt !</p>
        )}
        {displayedChangelogs.map((changelog) => {
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
                  {changelog.nextstep && (
                    <p className="Changelogs__log-nextstep">
                      Prochaine étape :
                      {changelog.nextstep}
                    </p>
                  )}
                </div>
              </div>
            </Paper>
          );
        })}
      </>
    );
  }

  return (
    <div className="Changelogs">
      <div className="Changelogs__title">
        <h1>Les petits changements</h1>
      </div>
      <div className="Changelogs__tabs">
        <div className="Changelogs__tabs-actions">
          <Button
            text="Fonctionnalités potentielles"
            className="Changelogs__tab-button"
            variant={activeTab !== 'potential' ? 'inactive' : undefined}
            onClick={() => setActiveTab('potential')}
          />
          <Button
            text="Mises à jour"
            className="Changelogs__tab-button"
            variant={activeTab !== 'changelogs' ? 'inactive' : undefined}
            onClick={() => setActiveTab('changelogs')}
          />
        </div>
        {isConnected && (
          <Button
            text="Proposez une amélioration !"
            className="Changelogs__tab-button"
            href="/add_changelog"
            onClick={() => { document.location = '/add_changelog';}}
          />
        )}
      </div>
      <div className="Changelogs__list">
        {activeTab === 'potential' && (
          changelogsList(potentialChangelogs)
        )}
        {activeTab === 'changelogs' && (
          changelogsList(changelogs)
        )}
      </div>
    </div>
  );

  function updateChangelogs() {
    server.get('changelogs')
      .then((response) => {
        const { changelogs, potentialChangelogs } = response.data;
        setChangelogs(Object.values(changelogs));
        setPotentialChangelogs(Object.values(potentialChangelogs));
      });
  }

  function handleVote(changelogId) {
    if (props.isConnected) {
      server.get(`vote/${changelogId}`)
        .then((response) => {
          const { changelogs, potentialChangelogs } = response.data;
          setChangelogs(Object.values(changelogs));
          setPotentialChangelogs(Object.values(potentialChangelogs));
        });
    }
  }
}
