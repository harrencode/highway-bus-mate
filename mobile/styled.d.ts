import 'styled-components';
import 'styled-components/native';

import {commonTheme} from './src/atomic/obj.app-theme';

type CommonTheme = typeof commonTheme;

declare module 'styled-components' {
  type Theme = CommonTheme;
  export interface DefaultTheme extends Theme {}
}

declare module 'styled-components/native' {
  type Theme = CommonTheme;
  export interface DefaultTheme extends Theme {}
}