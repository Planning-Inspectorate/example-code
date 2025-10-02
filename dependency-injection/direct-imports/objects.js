// directly importing the dependency
import client from "./my-api-client.js";

export const NoColor = Symbol();

/**
 * @returns {Promise<Object<string, []>>}
 */
export async function objectsByColor() {
  const list = await client.list(); // since client is imported directly it can be harder to mock
  const byColor = {
    [NoColor]: []
  };
  for (const obj of list) {
    if (obj.data?.color) {
      const arr = byColor[obj.data.color] || (byColor[obj.data.color] = [])
      arr.push(obj);
    } else {
      byColor[NoColor].push(obj);
    }
  }

  return byColor;
}