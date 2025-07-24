import { ApiClient } from "../api-client.js";
import { TaskClient } from "./task-client.js";

async function run() {
  const api = new ApiClient('https://echo.free.beeceptor.com/');
  const taskClient = new TaskClient(api);

  const tasks = await taskClient.listTasks();
  console.log(tasks);
}

run().catch(console.error);
