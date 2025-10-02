import {objectsByColor} from "./objects.js";

export class MyService {
  async objectsByColor() {
    // this implicitly uses the global fetch implementation, and the default NotifyApiClient instance
    return await objectsByColor();
  }
}