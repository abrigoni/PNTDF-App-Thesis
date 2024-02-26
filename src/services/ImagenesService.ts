import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class ImagenesService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getImagenes = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<Imagen>> =>
    this.client.get(
      `/imagenes?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default ImagenesService;

export type Imagen = {
  id: number;
  thumb_url: string;
  large_url: string;
  descripcion: string;
};
