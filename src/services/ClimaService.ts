import RestApiBaseService from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';
import {AxiosResponse} from 'axios';

class ClimaService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  /* getAll = (lang: string, updatedAt: string): Promise<AxiosResponse> =>
    this.client.get(
      `/conf/bloques-info?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    ); */
}

export default ClimaService;
