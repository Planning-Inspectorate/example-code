import {objectsByColor} from "./objects.js";
import {MyApiClient} from "./my-api-client.js";

export class MyService {
  #client;

  constructor() {
    // pass dependencies down
    this.#client = new MyApiClient(fetch);
  }

  async objectsByColor() {
    // pass dependencies down
    return await objectsByColor({client: this.#client});
  }
}