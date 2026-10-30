import type * as React from 'react';
import {css, styled} from '@yak/react';

import type {ButtonVariant} from '@sentry/scraps/theme';
import {type AnalyticsProps, useClickTracking} from '@sentry/scraps/trackingContext';

import {useLinkBehavior} from './linkBehaviorContext';

export interface LinkProps
  extends
    React.RefAttributes<HTMLAnchorElement>,
    AnalyticsProps,
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
      'href' | 'target' | 'as' | 'css'
    > {
  [key: `data-${string}`]: string | undefined;
  /**
   * The string path or destination object. A LinkBehaviorContextProvider can
   * normalize destinations and handle client-side routing.
   */
  to:
    | string
    | {
        hash?: string;
        pathname?: string;
        query?: Record<string, unknown>;
        search?: string;
        state?: unknown;
      };
  /**
   * Indicator if the link should be disabled
   */
  disabled?: boolean;
  preventScrollReset?: boolean;
  reloadDocument?: boolean;
  replace?: boolean;
  state?: unknown;
}

/**
 * Where something leads: a route inside the product, or an external URL
 * outside it. The two are mutually exclusive, so a component can pick `Link`
 * or `ExternalLink` from whichever one it was handed.
 */
export type LinkDestination =
  | {to: LinkProps['to']; externalHref?: never}
  | {externalHref: string; to?: never};

const linkStyles = css<{$disabled?: boolean}>`
  text-box-edge: text text;
  text-box-trim: trim-both;
  font-family: inherit;
  border-radius: 2px;
  color: ${({theme}) => theme.tokens.interactive.link.accent.rest};

  &:hover,
  &:focus-visible {
    color: ${({theme}) => theme.tokens.interactive.link.accent.hover};
  }

  &:focus-visible {
    text-decoration: none;
    outline: none;
    box-shadow:
      0 0 0 0 ${({theme}) => theme.tokens.background.primary},
      0 0 0 2px ${({theme}) => theme.tokens.focus.default};
  }

  ${({$disabled}) =>
    $disabled &&
    css`
      pointer-events: none;

      &,
      &:hover,
      &:focus-visible {
        color: ${({theme}) => theme.tokens.content.disabled};
      }
    `}
`;

// The `disabled` attribute is not valid on an anchor, so it becomes a style prop.
const Anchor = styled.a.attrs<{disabled?: LinkProps['disabled']}>(({disabled}) => ({
  $disabled: disabled,
  disabled: undefined,
}))<{$disabled?: boolean}>`
  ${linkStyles}
`;

type LinkPropsWithButtonBehavior = LinkProps & {
  busy?: boolean;
  variant?: ButtonVariant;
};

function LinkBase(props: LinkPropsWithButtonBehavior) {
  const {Component, behavior} = useLinkBehavior(props);
  // LinkButton reuses this component for router links and passes these
  // button-only props through at runtime. They are consumed by tracking and
  // removed before reaching the router or DOM element.
  const propsWithBehavior = behavior();
  const {handleClick} = useClickTracking(propsWithBehavior, 'link');

  const {
    analyticsEventKey: _analyticsEventKey,
    analyticsEventName: _analyticsEventName,
    analyticsParams: _analyticsParams,
    busy: _busy,
    variant: _variant,
    ...linkProps
  } = props.disabled ? props : propsWithBehavior;

  if (props.disabled) {
    const {
      to: _to,
      replace: _replace,
      preventScrollReset: _preventScrollReset,
      reloadDocument: _reloadDocument,
      state: _state,
      ...restProps
    } = linkProps;
    return <Anchor {...restProps} />;
  }

  return <Component {...linkProps} onClick={handleClick} />;
}

const StyledLink = styled(LinkBase).attrs(({disabled}) => ({$disabled: disabled}))<{
  $disabled?: boolean;
}>`
  ${linkStyles}
`;

export function Link(props: LinkProps) {
  return <StyledLink {...props} />;
}

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: LinkProps['disabled'];
  openInNewTab?: boolean;
}

export function ExternalLink({openInNewTab = true, ...props}: ExternalLinkProps) {
  if (openInNewTab) {
    return <Anchor {...props} target="_blank" rel="noreferrer noopener" />;
  }

  return <Anchor {...props} href={props.href} />;
}
