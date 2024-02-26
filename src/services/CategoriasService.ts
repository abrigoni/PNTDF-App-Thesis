import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class CategoriasService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getCategorias = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<Categoria>> =>
    this.client.get(
      `/especies/categorias?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default CategoriasService;

export type Categoria = {
  id: number;
  orden: number;
  nombre: string;
};
