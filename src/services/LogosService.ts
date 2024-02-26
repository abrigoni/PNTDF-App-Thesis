import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class LogosService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getLogos = (lang: string, updatedAt: string): Promise<ApiResponse<Logo>> =>
    this.client.get(
      `/logos?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default LogosService;

export type Logo = {
  id: number;
  descripcion: string;
  thumb_url: string;
  large_url: string;
};
