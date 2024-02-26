import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class RecomendacionesService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getRecomendaciones = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<Recomendacion>> =>
    this.client.get(
      `/recomendaciones?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default RecomendacionesService;

export type Recomendacion = {
  thumb_url: string;
  large_url: string;
  descripcion: string;
};
