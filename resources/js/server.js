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
      return axios.post('/api/' + url, data);
    }
  }

  static async get(url, params = null) {
    let bearer =  Cookies.get('Bearer');
    let server_url = '/api/';

    if (bearer) {
      server_url += 'authenticated/' + url + '?api_token=' + bearer;
      if (params) {
        server_url += '&' + params;
      }
    }
    else {
      server_url += url;
      if (params) {
        server_url += '?' + params;
      }
    }

    return axios.get(server_url);
  }
}

export default server