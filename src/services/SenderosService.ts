import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class SenderosService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getSenderos = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<Sendero>> =>
    this.client.get(
      `/que-hacer?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default SenderosService;

export type Sendero = {
  id: number;
  nombre: string;
  resumen: string;
  descripcion: string;
  duracion: number;
  longitud: number;
  // geojson: GeoJSON.FeatureCollection<GeoJSON.LineString> | null;
  geojson: any | null;
  // puntosAcceso: GeoJSON.FeatureCollection<GeoJSON.Point> | null;
  puntosAcceso: any | null;
  orden: number;
  habilitado: boolean;
  autorizacion: boolean;
  dificultad: number;
  imagenPrincipal: number | null;
  imagenes: number[];
  recomendaciones: number[];
  especies: number[];
  pois: number[];
};
