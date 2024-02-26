import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class PuntosInteresService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getPuntosInteres = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<PuntoInteres>> =>
    this.client.get(
      `/que-hacer/puntos-interes?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default PuntosInteresService;

export type PuntoInteres = {
  id: number;
  nombre: string;
  descripcion: string;
  geojson: GeoJSON.Feature<GeoJSON.Point>;
  imagenPrincipal: number;
  imagenes: number[];
  habilitado: boolean;
};
