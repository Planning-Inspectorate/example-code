import {describe, it, mock} from 'node:test';
import {NoColor, objectsByColor} from './objects.js';
import assert from "node:assert";

describe('objects', () => {
  describe('objectsByColor', () => {
    it('should return objects sorted into colors', async () => {
      // this will call the real API - it is harder to mock it due to direct imports
      const objects = await objectsByColor();
      assert.strictEqual(objects['Cloudy White'].length, 2);
      assert.strictEqual(objects[NoColor].length, 1);
    });
  });
})