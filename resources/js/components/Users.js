import React from 'react';
import server from '../server'

export default function Users() {
  const [users, setUsers] = React.useState(undefined);

  React.useEffect(() => {
    fetchUsers()
  }, []);

  return (
    <>
      <div className="jumbotron Users__title">
        <h1>Liste des utilisateurs</h1>
        <p>à venir : Podium </p>
        <p>à venir : Pagination </p>
        <p>à venir : Affichage d'avatars </p>
      </div>
      <div className="container Users">
        {users && users.length && users.map(function(user){
          return (
            <li key={`user${user.id}`} className="Users__user list-group-item">
              <span>
                <div className="Users__user-answer">{user.name}</div>
                <div className="Users__user-answer">{user.score}</div>
              </span>
            </li>
          )
        })}
      </div>
    </>
  );

  function fetchUsers() {
    server.get('users').then(response => {
      setUsers(response.data.users || undefined);
    })
  }
}

