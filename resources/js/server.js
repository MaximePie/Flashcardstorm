import axios from "axios";
import Cookies from "js-cookie";

class server {
  static async post(url, data) {
    let bearer =  Cookies.get('Bearer');
    if (bearer) {
      let headers = {
        Authorization: 'Bearer ' + bearer,
        Accept: 'application/json',
      };

      return axios.post('/api' + url + '/authenticated',
        data, {
          headers: headers
        })
    }
    else {
      return axios.post('/api' + url, data);
    }
  }

  static async get(url) {
    let bearer =  Cookies.get('Bearer');
    if (bearer) {
      return axios.get('api/' + url + '?api_token='+ bearer)
    }
    else {
      return axios.get('/api' + url);
    }
  }
}

export default server