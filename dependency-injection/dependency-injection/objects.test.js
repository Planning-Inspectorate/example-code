import {describe, it, mock} from 'node:test';
import {NoColor, objectsByColor} from './objects.js';
import assert from "node:assert";

describe('objects', () => {
  describe('objectsByColor', () => {
    it('should return objects sorted into colors', async () => {
      const objectsToReturn = [
          {
            id: '1',
            name: 'Google Pixel 6 Pro',
            data: {
              color: 'Cloudy White',
              capacity: '128 GB'
            }
          },
          {
            id: '2',
            name: 'Apple iPhone 12 Mini, 256GB, Blue',
            data: null
          },
          {
            id: '3',
            name: 'Apple iPhone 12 Pro Max',
            data: {
              color: 'Cloudy White',
              'capacity GB': 512
            }
          }
      ];
      // easy to mock the API client, without concern for the underlying implementation details or external calls
      const mockClient = {
        list: mock.fn(() => objectsToReturn)
      };
      // can easily pass the mock implementation in
      const objects = await objectsByColor({client: mockClient});
      assert.strictEqual(objects['Cloudy White'].length, 2);
      assert.strictEqual(objects[NoColor].length, 1);
    });
  });
})