import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class InformacionService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getInformacion = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<BloqueInfo>> =>
    this.client.get(
      `/conf/bloques-info?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default InformacionService;

export type BloqueInfo = {
  id: number;
  slug: string;
  contenido: string;
};
