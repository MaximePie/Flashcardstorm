import React from 'react';
import server from "../server";

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
          <li className="Changelogs__log">
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                This is a sheet of paper.
              </Typography>
              <Typography component="p">
                Paper can be used to build surface or other elements for your application.
              </Typography>
            </Paper>
            <h3 className="Changelogs__log-title">{changelog.title}</h3>
            <p className="Changelogs__log-text">{changelog.text}</p>
            <p className="Changelogs__log-nextstep">{changelog.nextstep}</p>
          </li>
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

