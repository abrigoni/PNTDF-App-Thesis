import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class EspeciesService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getEspecies = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<Especie>> =>
    this.client.get(
      `/especies?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default EspeciesService;

export type Especie = {
  id: number;
  nombre_cientifico: string;
  orden: number;
  categoria: number;
  imagenPrincipal: number | null;
  imagenes: number[];
  nombre: string;
  resumen: string;
  descripcion: string;
};
