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

      return axios.post('/api/authenticated/' + url,
        data, {
          headers: headers
        })
    }
    else {
      return axios.post('/api' + url, data);
    }
  }

  static async get(url, params = null) {
    let bearer =  Cookies.get('Bearer');
    if (bearer) {
      return axios.get('/api/authenticated/' + url + '?api_token=' + bearer + '&' + params)
    }
    else {
      return axios.get('/api/' + url + '?' + params);
    }
  }
}

export default server