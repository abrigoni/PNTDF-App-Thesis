import config from 'react-native-ultimate-config';

console.log(config);

const Config = {
  CODEPUSH_ENABLED_IN_DEV: config.CODEPUSH_ENABLED_IN_DEV,
  CODEPUSH_DEPLOYMENT_KEY: config.CODEPUSH_DEPLOYMENT_KEY,
  APP_NAME: config.APP_NAME,
  APP_VERSION: config.APP_VERSION,
  API_BASE_URL: config.API_BASE_URL,
  PARQUE_ID: config.PARQUE_ID,
  MAPBOX_ACCESS_TOKEN: config.MAPBOX_ACCESS_TOKEN,
  MAPBOX_STYLE_URL: config.MAPBOX_STYLE_URL,
};

export default Config;
