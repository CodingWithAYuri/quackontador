class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetch(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };

    const finalOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (finalOptions.body) {
      finalOptions.body = JSON.stringify(finalOptions.body);
    }

    try {
      const response = await fetch(url, finalOptions);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  get(path, options = {}) {
    return this.fetch(path, { ...options, method: 'GET' });
  }

  post(path, body, options = {}) {
    return this.fetch(path, { ...options, body, method: 'POST' });
  }

  put(path, body, options = {}) {
    return this.fetch(path, { ...options, body, method: 'PUT' });
  }

  delete(path, options = {}) {
    return this.fetch(path, { ...options, method: 'DELETE' });
  }
}

export default HttpClient;  // Adicionando a exportação padrão
