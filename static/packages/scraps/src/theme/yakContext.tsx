import type {Theme as SentryTheme} from './index';

/**
 * yak reads its theme through `@yak/react/context`. The build points that
 * module here, so yak components get the theme of the nearest Emotion
 * ThemeProvider. Nested and inverted themes work without a second provider.
 */
export {ThemeProvider as YakThemeProvider, useTheme} from '@emotion/react';

declare module '@yak/react' {
  export interface YakTheme extends SentryTheme {}
}
