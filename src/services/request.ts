import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const getBaseHeaders = (headers: any = {}) => {
  // const authToken = localStorage.getItem('token')

  // if (authToken) {
  //   return {
  //     ...headers,
  //     'AUTH_TOKEN': authToken,
  //   }
  // }

  return headers;
};

class Request {
  private instance: AxiosInstance;

  constructor(apiUrl: string) {
    this.instance = axios.create({
      baseURL: apiUrl,
      headers: {
        ...getBaseHeaders(),
      },
    });
  }

  get = async <T>(dest: string, params = {}, config: Partial<AxiosRequestConfig> = {}): Promise<T> => {
    const { data } = await this.instance.get<T>(dest, {
      ...config,
      headers: getBaseHeaders(config.headers),
      params,
    });

    return data;
  };

  delete = async <T>(dest: string, params = {}, config: Partial<AxiosRequestConfig> = {}): Promise<T> => {
    const { data } = await this.instance.delete<T>(dest, {
      ...config,
      headers: getBaseHeaders(config.headers),
      params,
    });

    return data;
  };

  post = async <T>(
    dest: string,
    body: Record<string, unknown>,
    params = {},
    config: Partial<AxiosRequestConfig> = {}
  ): Promise<T> => {
    const { data } = await this.instance.post<T>(dest, body, {
      ...config,
      headers: getBaseHeaders(config.headers),
      params,
    });

    return data;
  };

  put = async <T>(
    dest: string,
    body: Record<string, unknown>,
    params = {},
    config: Partial<AxiosRequestConfig> = {}
  ): Promise<T> => {
    const { data } = await this.instance.put<T>(dest, body, {
      ...config,
      headers: getBaseHeaders(config.headers),
      params,
    });

    return data;
  };

  patch = async <T>(
    dest: string,
    body: Record<string, unknown>,
    params = {},
    config: Partial<AxiosRequestConfig> = {}
  ): Promise<T> => {
    const { data } = await this.instance.patch<T>(dest, body, {
      ...config,
      headers: getBaseHeaders(config.headers),
      params,
    });

    return data;
  };

  multipart = async <T>(
    dest: string,
    formData: FormData,
    params = {},
    config: Partial<AxiosRequestConfig> = {}
  ): Promise<T> => {
    const { data } = await this.instance.post<T>(dest, formData, {
      ...config,
      params,
      headers: getBaseHeaders({
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      }),
    });

    return data;
  };

  urlencoded = async <T>(
    dest: string,
    formData: FormData,
    params = {},
    config: Partial<AxiosRequestConfig> = {}
  ): Promise<T> => {
    const { data } = await this.instance.post<T>(dest, formData, {
      ...config,
      params,
      headers: getBaseHeaders({
        ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });

    return data;
  };
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

const request = new Request(apiUrl);

export default request;
