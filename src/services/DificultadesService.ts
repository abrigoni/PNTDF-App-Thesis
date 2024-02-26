import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class DificultadesService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getDificultades = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<Dificultad>> =>
    this.client.get(
      `/senderos/dificultades?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default DificultadesService;

export type Dificultad = {
  id: number;
  orden: number;
  nombre: string;
};
