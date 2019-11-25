import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";


export default function Profile() {

  const [user, setUser] = React.useState(undefined);

  React.useEffect(() => {
    fetchUserInfo()
  }, []);


  return (
    <div className="QuestionsList">
      {user && (
        <div className="jumbotron">
          <h2>Bienvenue, {user.name}</h2>
        </div>
      )}
    </div>
  );

  function fetchUserInfo() {
    axios.get('api/me?api_token='+ Cookies.get('Bearer')).then(response => {
      console.log(response);
      setUser(response.data)
    })
  }
}