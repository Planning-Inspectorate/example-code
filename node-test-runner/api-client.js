import { HttpError } from "./http-error.js";

export class ApiClient {
  #url;

  constructor(url) {
    this.#url = url;
  }

  async get(path) {
    const res = await fetch(this.#url + path);
    if (!res.ok) {
      throw new HttpError(res.status, res.statusText);
    }
    return await res.json();
  }

  async post(path, body) {
    const res = await fetch(this.#url + path, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new HttpError(res.status, res.statusText);
    }
    return await res.json();
  }
}