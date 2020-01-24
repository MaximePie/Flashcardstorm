import React from 'react';
import Paper from '@material-ui/core/Paper';
import Cookies from 'js-cookie';
import moment from 'moment';
import { toLocale } from '../../helper';
import server from '../../server';

export default function Changelogs() {
  const [changelogs, setChangelogs] = React.useState([]);

  React.useEffect(() => {
    Cookies.set('last_checked_at', moment().subtract(1, 'hours').format());
    updateChangelogs();
  }, []);

  return (
    <div className="Changelogs">
      <div className="Changelogs__title">
        <h1>Les petits changements</h1>
      </div>
      <div className="Changelogs__list">
        {!changelogs.length && (
          <p>Pas de changements pour l'instant, nous allons revenir avec des bonnes nouvelles très bientôt !</p>
        )}
        {changelogs.map((changelog) => (
          <Paper className="Changelogs__log">
            <div>
              <h3 className="Changelogs__log-title d-inline-flex mr-3">{changelog.title}</h3>
              <span className="text-secondary text-muted">{toLocale(changelog.created_at)}</span>
            </div>
            <p className="Changelogs__log-text">{changelog.text}</p>
            <p className="Changelogs__log-nextstep">
Prochaine étape :
              {changelog.nextstep}
            </p>
          </Paper>
        ))}
      </div>
    </div>
  );

  function updateChangelogs() {
    server.get('changelogs').then((response) => {
      setChangelogs(response.data);
    });
  }
}
