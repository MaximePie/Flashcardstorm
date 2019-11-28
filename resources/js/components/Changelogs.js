import React from 'react';
import server from "../server";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

export default function Changelogs() {

  const [changelogs, setChangelogs] = React.useState([]);

  React.useEffect(() => {
    updateChangelogs()
    // TODO Créer une méthode updateUserInfo pour récupérer les infos (dont le score)
  }, []);

  return (
    <>
      <div className="jumbotron">
        <h1>Les petits changements</h1>
      </div>
      <div className="Changelogs container">
        {!changelogs.length && (
          <p>Pas de changements pour l'instant, nous allons revenir avec des bonnes nouvelles très bientôt !</p>
        )}
        <ul className="Changelogs__list">
        {changelogs.map(function (changelog) {
          return (
          <Paper className="Changelogs__log">
              <h3 className="Changelogs__log-title">{changelog.title}</h3>
              <p className="Changelogs__log-text">{changelog.text}</p>
              <p className="Changelogs__log-nextstep">{changelog.nextstep}</p>
          </Paper>
          )
        })}
        </ul>
      </div>
    </>
    );

  function updateChangelogs() {
    server.get('changelogs').then(response => {
      setChangelogs(response.data)
    })
  }
}

