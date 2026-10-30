import type * as React from 'react';
import {css} from '@emotion/react';
import {css as yakCss, styled} from '@yak/react';

import type {Theme} from '@sentry/scraps/theme';
// yak inlines static tokens into the CSS at build time. A theme token becomes a CSS variable.
// oxlint-disable-next-line @sentry/scraps/no-token-import
import {size} from '@sentry/scraps/tokens/size';
// oxlint-disable-next-line @sentry/scraps/no-token-import
import {typography} from '@sentry/scraps/tokens/typography';

export const kbdStyles = (theme: Theme, variant?: KbdProps['variant']) => css`
  margin: 0;
  padding: 0 ${theme.space.xs};
  height: 1.67em; /* 20px */

  font-family: ${theme.font.family.mono};
  font-size: ${theme.font.size.sm};
  font-weight: ${theme.font.weight.sans.medium};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: ${
    variant === 'debossed' ? theme.tokens.content.secondary : theme.tokens.content.primary
  };
  background: ${
    variant === 'debossed'
      ? theme.tokens.background.secondary
      : theme.tokens.background.primary
  };
  border: ${theme.border.md} solid ${theme.tokens.border.primary};
  border-top: ${
    variant === 'debossed'
      ? `${theme.border.xl} solid ${theme.tokens.border.primary}`
      : undefined
  };
  border-bottom: ${
    variant === 'debossed'
      ? undefined
      : `${theme.border.xl} solid ${theme.tokens.border.primary}`
  };
  border-radius: ${theme.radius.sm};
  box-shadow: none;
`;

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'embossed' | 'debossed';
}

export function Kbd({variant, ...props}: KbdProps) {
  return <StyledKbd $variant={variant} {...props} />;
}

const StyledKbd = styled.kbd<{$variant: KbdProps['variant']}>`
  margin: 0;
  padding: 0 ${size.space.xs};
  height: 1.67em; /* 20px */

  font-family: ${typography.font.family.mono};
  font-size: ${typography.font.size.sm};
  font-weight: ${typography.font.weight.sans.medium};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: ${size.border.md} solid var(--tokens-border-primary);
  border-radius: ${size.radius.sm};
  box-shadow: none;

  ${({$variant}) =>
    $variant === 'debossed'
      ? yakCss`
          color: var(--tokens-content-secondary);
          background: var(--tokens-background-secondary);
          border-top: ${size.border.xl} solid var(--tokens-border-primary);
        `
      : yakCss`
          color: var(--tokens-content-primary);
          background: var(--tokens-background-primary);
          border-bottom: ${size.border.xl} solid var(--tokens-border-primary);
        `}
`;
