import RestApiBaseService, {ApiResponse} from '@/services/RestApiBaseService';
import config from '@/config/ConfigVariables';

class ContenidosPDFService extends RestApiBaseService {
  constructor() {
    super({
      baseURL: config.API_BASE_URL,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  getContenidos = (
    lang: string,
    updatedAt: string,
  ): Promise<ApiResponse<ContenidoPDF>> =>
    this.client.get(
      `/contenidos-pdf?parque_id=${config.PARQUE_ID}&actualizado_el=${updatedAt}&lang=${lang}`,
    );
}

export default ContenidosPDFService;

export type ContenidoPDF = {
  id: number;
  nombre: string;
  slug: string;
  contenido: number;
  file: Archivo;
};

export type Archivo = {
  id_archivo: number;
  descripcion: string;
  url: string;
  path?: string | null;
  peso: any;
  descargas: any;
  fecha_actualizacion: any;
  Nombre: string;
  Creacion: string;
  Creador: string;
  Modificacion: string;
  Modificador: string;
};
