export class MyApiClient {
  async list() {
    // implicitly uses global fetch with no override
    // so usage in tests would call the real API without some mocking
    const res = await fetch('https://api.restful-api.dev/objects');
    return res.json();
  }
}

export default new MyApiClient();