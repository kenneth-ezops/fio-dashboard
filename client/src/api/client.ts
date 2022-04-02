import superagent, { SuperAgentRequest } from 'superagent';

import config from '../config';

export default class ApiClient {
  prefix: string;
  baseUrl: string;
  token: string | null;

  constructor(prefix: string) {
    if (!prefix) throw new Error('[apiPrefix] required');
    this.prefix = prefix;
    this.baseUrl = config.apiBaseUrl || '';
    this.token = window.localStorage.getItem('token') || null;
  }

  setToken(token: string) {
    this.token = token;
    window.localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    window.localStorage.removeItem('token');
  }

  get(url: string, params: any = {}) {
    return this._request({ url, method: 'get', params });
  }

  post(url: string, body: any) {
    return this._request({ url, method: 'post', body });
  }

  patch(url: string, body: any) {
    return this._request({ url, method: 'patch', body });
  }

  put(url: string, body: any) {
    return this._request({ url, method: 'put', body });
  }

  delete(url: string, body: any) {
    return this._request({ url, method: 'delete', body });
  }

  _request({
    url,
    method,
    params,
    body,
  }: {
    url: string;
    method: 'get' | 'post' | 'patch' | 'put' | 'delete';
    params?: any;
    body?: any;
  }) {
    const req: SuperAgentRequest = superagent[method](
      `${this.baseUrl}${this.prefix}${url}`,
    );

    if (params) req.query(params);
    if (body) req.send(body);
    if (this.token) req.set('Authorization', `Bearer ${this.token}`);

    return req.then(res => {
      if (!res.body.status) throw res.body.error;
      return res.body.data;
    });
  }
}