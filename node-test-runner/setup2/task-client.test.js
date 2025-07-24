import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import {TaskClient} from './task-client.js';

describe('task-client', () => {
  it('initialises', () => {
    const mockApi = {};
    const client = new TaskClient(mockApi);

    assert.equal(client instanceof TaskClient, true);
  });

  it('objects equal', async () => {
    const obj1 = {hello: 'World'};
    const obj2 = {hello: 'World'};

    assert.deepStrictEqual(obj1, obj2);
  });

  it.only('list tasks', async () => {
    const mockApi = {
      get: mock.fn(() => {
        return [{name: 'Task 1', status: 'Incomplete'}];
      })
    };
    const client = new TaskClient(mockApi);

    const tasks = await client.listTasks();

    assert.deepStrictEqual(tasks, [{name: 'Task 1', status: 'Incomplete'}]);
    assert.strictEqual(mockApi.get.mock.callCount(), 1);

    const args = mockApi.get.mock.calls[0].arguments;
    assert.deepStrictEqual(args, ['/tasks']);
  });
});