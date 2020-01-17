import axios from 'axios';
import Cookies from 'js-cookie';

class server {
  static async post(url, data) {
    const bearer = Cookies.get('Bearer');
    if (bearer) {
      const headers = {
        Authorization: `Bearer ${bearer}`,
        Accept: 'application/json',
      };

      return axios.post(`/api/authenticated/${url}`,
        data, {
          headers,
        });
    }

    return axios.post(`/api/${url}`, data);
  }

  static async get(url, params = null) {
    const bearer = Cookies.get('Bearer');
    let serverUrl = '/api/';

    if (bearer) {
      serverUrl += `authenticated/${url}?api_token=${bearer}`;
      if (params) {
        serverUrl += `&${params}`;
      }
    } else {
      serverUrl += url;
      if (params) {
        serverUrl += `?${params}`;
      }
    }

    return axios.get(serverUrl);
  }
}

export default server;
