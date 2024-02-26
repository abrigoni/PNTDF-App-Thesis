import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

class RestApiBaseService {
  client: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    const defaultConfig: AxiosRequestConfig = {
      headers: {'Cache-Control': 'no-cache'},
      timeout: 10000, // 10 second timeout...
    };
    const finalConf = Object.assign(defaultConfig, config);
    this.client = axios.create(finalConf);
  }
}

export default RestApiBaseService;

export type ApiResponse<T> = AxiosResponse<{
  error: boolean;
  error_msg: string;
  data: T[];
}>;
