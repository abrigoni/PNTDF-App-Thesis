import CategoriasSlice, {CategoriasSliceName} from '@/redux/CategoriasSlice';
import ConfiguracionSlice, {
  ConfiguracionSliceName,
} from '@/redux/ConfiguracionSlice';
import ContenidosPDFSlice, {
  ContenidosPDFSliceName,
} from '@/redux/ContenidosPDFSlice';
import DificultadesSlice, {
  DificultadesSliceName,
} from '@/redux/DificultadesSlice';
import EmergenciasSlice, {EmergenciasSliceName} from '@/redux/EmergenciasSlice';
import EspeciesSlice, {EspeciesSliceName} from '@/redux/EspeciesSlice';
import IdiomasSlice, {IdiomasSliceName} from '@/redux/IdiomasSlice';
import ImagenesSlice, {ImagenesSliceName} from '@/redux/ImagenesSlice';
import InformacionSlice, {InformacionSliceName} from '@/redux/InformacionSlice';
import LogosSlice, {LogosSliceName} from '@/redux/LogosSlice';
import PuntosInteresSlice, {
  PuntosInteresSliceName,
} from '@/redux/PuntosInteresSlice';
import RecomendacionesSlice, {
  RecomendacionesSliceName,
} from '@/redux/RecomendacionesSlice';
import SenderosSlice, {SenderosSliceName} from '@/redux/SenderosSlice';
import {combineReducers} from 'redux';

const RootReducer = combineReducers({
  [CategoriasSliceName]: CategoriasSlice,
  [DificultadesSliceName]: DificultadesSlice,
  [EspeciesSliceName]: EspeciesSlice,
  [IdiomasSliceName]: IdiomasSlice,
  [ImagenesSliceName]: ImagenesSlice,
  [InformacionSliceName]: InformacionSlice,
  [LogosSliceName]: LogosSlice,
  [PuntosInteresSliceName]: PuntosInteresSlice,
  [RecomendacionesSliceName]: RecomendacionesSlice,
  [SenderosSliceName]: SenderosSlice,
  [ConfiguracionSliceName]: ConfiguracionSlice,
  [EmergenciasSliceName]: EmergenciasSlice,
  [ContenidosPDFSliceName]: ContenidosPDFSlice,
});

export type RootState = ReturnType<typeof RootReducer>;

export default RootReducer;
