import { HttpError } from '../http-error.js';
import client from './api.client.js';

export class TaskClient {
  async listTasks() {
    return client.get('/tasks');
  }

  async getTask(taskId) {
    try {
      return await client.get(`/tasks/${taskId}`);
    } catch(e) {
      if (e instanceof HttpError && e.statusCode === 404) {
        return null;
      }
      throw e;
    }
  }

  async addTask(task) {
    task.createdAt = new Date();
    return client.post(`/tasks`, task);
  }
}
