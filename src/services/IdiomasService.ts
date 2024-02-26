import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class IdiomasService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getIdiomas = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<Idioma>> =>
    this.client.get(
      `/conf/idiomas?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default IdiomasService;

export type Idioma = {
  id: number;
  orden: number;
  langcode: string;
  nombre: string;
};
