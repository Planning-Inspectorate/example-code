import { HttpError } from "../http-error.js";

export class TaskClient {
  #client;

  constructor(client) {
    this.#client = client;
  }

  async listTasks() {
    return this.#client.get('/tasks');
  }

  async getTask(taskId) {
    try {
      return await this.#client.get(`/tasks/${taskId}`);
    } catch(e) {
      if (e instanceof HttpError && e.statusCode === 404) {
        return null;
      }
      throw e;
    }
  }

  async addTask(task) {
    task.createdAt = new Date();
    return this.#client.post(`/tasks`, task);
  }
}