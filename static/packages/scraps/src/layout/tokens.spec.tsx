import {lightTheme} from '@sentry/scraps/theme';

import {fontSize, lineHeight, radius, space} from './tokens.yak';

describe('tokens.yak', () => {
  it('matches the theme tokens', () => {
    expect(space).toEqual(lightTheme.space);
    expect(radius).toEqual(lightTheme.radius);
    expect(fontSize).toEqual(lightTheme.font.size);
    expect(lineHeight).toEqual(lightTheme.font.lineHeight);
  });
});
