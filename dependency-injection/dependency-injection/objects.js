export const NoColor = Symbol();
/**
 * @param {import('./my-api-client.js').MyApiClient} client - would be even better to use a TypeScript interface here
 * @returns {Promise<Object<string, []>>}
 */
export async function objectsByColor({client}) {
  // client is passed in, so we can easily override it with a mock that has the same signature
  const list = await client.list();
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