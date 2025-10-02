export class MyApiClient {
  #fetch;

  constructor(fetchImpl) {
    // fetch implementation is passed in, could be global fetch, or another compatible library
    this.#fetch = fetchImpl;
  }

  async list() {
    const res = await this.#fetch('https://api.restful-api.dev/objects');
    return res.json();
  }
}