declare module 'react-native-config' {
  export interface NativeConfig {
    BASE_URL?: string;
    API_BASE_URL?: string;
    APP_ENV?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
