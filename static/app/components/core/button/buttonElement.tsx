import type * as React from 'react';
import isPropValid from '@emotion/is-prop-valid';
import {css, styled} from '@yak/react';

import {Link} from '@sentry/scraps/link';
// yak inlines static tokens into the CSS at build time. A theme token becomes a CSS variable.
// oxlint-disable-next-line @sentry/scraps/no-token-import
import {size as sizeTokens} from '@sentry/scraps/tokens/size';
// oxlint-disable-next-line @sentry/scraps/no-token-import
import {typography} from '@sentry/scraps/tokens/typography';
import {useClickTracking} from '@sentry/scraps/trackingContext';

import type {ResolvedLinkButtonProps} from './linkButton';
import type {ButtonSize, ButtonVariant} from './types';

interface ButtonStyleProps {
  $size: ButtonSize;
  shapeVariant: 'rectangular' | 'square';
  busy?: boolean;
  variant?: ButtonVariant;
}

/**
 * Renders a `<button>`, or the component that LinkButton passes. A `<button>`
 * receives only valid DOM props.
 *
 * This filter is not the native yak way. yak removes only `$` props, so
 * Button and LinkButton would pass their style inputs as `$` props and remove
 * their other non-DOM props themselves. But app code wraps Button with
 * `styled(Button)` and passes its own props, for example `expanded` or
 * `direction`. The Emotion version dropped these with `is-prop-valid`. Without
 * this filter they reach the DOM, so the native way would break the Button API.
 */
function ButtonTag({
  component: Component = 'button',
  ...props
}: {component?: React.ElementType} & Record<string, unknown>) {
  if (typeof Component !== 'string') {
    return <Component {...props} />;
  }
  const domProps: Record<string, unknown> = {};
  for (const key in props) {
    if (isPropValid(key)) {
      domProps[key] = props[key];
    }
  }
  return <Component {...domProps} />;
}

function isDisabled(p: {'aria-disabled'?: unknown; disabled?: unknown}) {
  // A button that is only aria-disabled stays focusable (so its tooltip can
  // open on focus) but must look and hover like a disabled one.
  return !!p.disabled || p['aria-disabled'] === true || p['aria-disabled'] === 'true';
}

/**
 * The shared element of Button and LinkButton.
 */
export const ButtonElement = styled(ButtonTag)<
  ButtonStyleProps & {'aria-disabled'?: unknown; disabled?: unknown}
>`
  --button-elevation: 2px;
  --button-lift: var(--button-elevation);
  /* The colors of each variant, from the global theme variables. */
  ${({variant}) => {
    switch (variant) {
      case 'primary':
        return css`
          --button-surface: var(--tokens-interactive-chonky-embossed-accent-background);
          --button-chonk: var(--tokens-interactive-chonky-embossed-accent-chonk);
          --button-content: var(--tokens-interactive-chonky-embossed-accent-content);
          --button-focus: var(--tokens-focus-onVibrant-light);
        `;
      case 'warning':
        return css`
          --button-surface: var(--tokens-interactive-chonky-embossed-warning-background);
          --button-chonk: var(--tokens-interactive-chonky-embossed-warning-chonk);
          --button-content: var(--tokens-interactive-chonky-embossed-warning-content);
          --button-focus: var(--tokens-focus-onVibrant-dark);
        `;
      case 'danger':
        return css`
          --button-surface: var(--tokens-interactive-chonky-embossed-danger-background);
          --button-chonk: var(--tokens-interactive-chonky-embossed-danger-chonk);
          --button-content: var(--tokens-interactive-chonky-embossed-danger-content);
          --button-focus: var(--tokens-focus-onVibrant-light);
        `;
      case 'transparent':
        return css`
          --button-surface: var(--tokens-interactive-transparent-neutral-background-rest);
          --button-chonk: var(--tokens-interactive-transparent-neutral-background-rest);
          --button-content: var(--tokens-interactive-transparent-neutral-content-primary);
        `;
      case 'link':
        return css`
          --button-surface: transparent;
          --button-chonk: transparent;
          --button-content: var(--tokens-interactive-link-accent-rest);
        `;
      default:
        return css`
          --button-surface: var(--tokens-interactive-chonky-embossed-neutral-background);
          --button-chonk: var(--tokens-interactive-chonky-embossed-neutral-chonk);
          --button-content: var(
            --tokens-interactive-chonky-embossed-neutral-content-primary
          );
        `;
    }
  }}

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: ${typography.font.weight.sans.medium};
  cursor: pointer;
  border: none;
  color: var(--button-content);
  background: none;

  &[disabled],
  &[aria-disabled='true'] {
    cursor: not-allowed;
  }

  /* The heights and fonts match theme.form. */
  ${({$size}) => {
    switch ($size) {
      case 'md':
        return css`
          --button-height: 36px;
          height: 36px;
          min-height: 36px;
          font-size: 0.875rem;
          line-height: 1rem;
          border-radius: ${sizeTokens.radius.lg};
          padding: ${sizeTokens.space.md} ${sizeTokens.space.xl};
        `;
      case 'sm':
        return css`
          --button-height: 32px;
          height: 32px;
          min-height: 32px;
          font-size: 0.875rem;
          line-height: 1rem;
          border-radius: ${sizeTokens.radius.md};
          padding: ${sizeTokens.space.md} ${sizeTokens.space.lg};
        `;
      case 'xs':
        return css`
          --button-elevation: 1px;
          --button-height: 28px;
          height: 28px;
          min-height: 28px;
          font-size: 0.75rem;
          line-height: 1rem;
          border-radius: ${sizeTokens.radius.sm};
          padding: ${sizeTokens.space.sm} ${sizeTokens.space.md};
        `;
      default:
        return css`
          --button-elevation: 0px;
          --button-height: 24px;
          height: 24px;
          min-height: 24px;
          font-size: 0.75rem;
          line-height: 1rem;
          border-radius: ${sizeTokens.radius.xs};
          padding: ${sizeTokens.space.xs} ${sizeTokens.space.sm};
        `;
    }
  }}

  /* Use min width as a progressive enhancement for square buttons. */
  ${({shapeVariant}) =>
    shapeVariant === 'square' &&
    css`
      padding: 0;
      min-width: var(--button-height);
    `}

  ${p =>
    isDisabled(p) &&
    css`
      opacity: 0.6;
    `}

  &::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    height: calc(100% - var(--button-elevation));
    top: var(--button-elevation);
    transform: translateY(calc(-1 * var(--button-elevation)));
    box-shadow: 0 var(--button-elevation) 0 0 var(--button-chonk);
    background: var(--button-chonk);
    border-radius: inherit;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    background: var(--button-surface);
    border-radius: inherit;
    border: 1px solid var(--button-chonk);
    transform: translateY(calc(-1 * var(--button-lift)));
    transition: transform 120ms cubic-bezier(0.8, -0.4, 0.5, 1);
  }

  &:focus-visible {
    outline: none;
  }

  ${({variant = 'secondary'}) =>
    variant === 'primary' || variant === 'warning' || variant === 'danger'
      ? css`
          &:focus-visible::after {
            border: 2px dotted var(--button-focus);
          }
        `
      : css`
          /* Three layers: the chonk color masks the offset ring copy, then the
           * ring is drawn at the lift offset and again at rest, so it closes
           * around the surface and chonk as a single outline. */
          &:focus-visible::after {
            box-shadow:
              0 var(--button-lift) 0 0 var(--button-chonk),
              0 var(--button-lift) 0 2px var(--tokens-focus-default),
              0 0 0 2px var(--tokens-focus-default);
          }
        `}

  ${p =>
    !isDisabled(p) &&
    !p.busy &&
    css`
      &:hover,
      &:focus-visible {
        color: var(--button-content);
      }
    `}

  > span:last-child {
    z-index: 1;
    position: relative;
    display: inherit;
    align-items: inherit;
    justify-content: inherit;
    flex: 1;
    gap: inherit;
    overflow: hidden;
    white-space: nowrap;
    transform: translateY(calc(-1 * var(--button-lift)));
    transition: transform 120ms cubic-bezier(0.8, -0.4, 0.5, 1);
  }

  &[aria-busy='true'] > span:last-child {
    overflow: visible;
  }

  &:hover {
    --button-lift: calc(var(--button-elevation) + 1px);
  }

  &:active,
  &[aria-expanded='true'],
  &[aria-checked='true'] {
    --button-lift: 0px;
  }

  &[aria-expanded='true'],
  &[aria-checked='true'] {
    &::after,
    > span:last-child {
      transition: none;
    }
  }

  &:disabled,
  &[aria-disabled='true'],
  &[aria-busy='true'] {
    --button-lift: 0px;
  }

  &[aria-busy='true'] {
    cursor: progress;
  }

  /* Borderless buttons are not chonky. */
  ${({variant}) =>
    (variant === 'transparent' || variant === 'link') &&
    css`
      transform: translateY(0px);

      &::before,
      &::after {
        display: none;
      }

      &:focus-visible {
        outline: none;
        box-shadow:
          0 0 0 0 var(--tokens-background-primary),
          0 0 0 2px var(--tokens-focus-default);
      }

      > span:last-child,
      &:hover > span:last-child,
      &:active > span:last-child {
        transform: translateY(0px);
      }

      &:hover,
      &:active {
        background-color: inherit;
      }
    `}

  ${p =>
    p.variant === 'transparent' &&
    !p.busy &&
    !isDisabled(p) &&
    css`
      &:hover {
        background-color: var(--colors-gray100);
      }

      &:active {
        background-color: var(--colors-gray200);
      }
    `}

  ${({variant}) =>
    variant === 'link' &&
    css`
      padding: 0;
      height: auto;
      min-height: auto;
      min-width: auto;

      > span:last-child {
        color: inherit;
      }
    `}
`;

// LinkButton renders its element here, so the CSS of Link loads before the CSS
// of ButtonElement and the button styles win.

// These props reach LinkButtonTag. It removes them before the DOM. Like
// ButtonTag, it filters with `is-prop-valid` to keep the LinkButton API.
const linkButtonProps = new Set([
  'analyticsEventKey',
  'analyticsEventName',
  'analyticsParams',
  'busy',
  'external',
  'replace',
  'preventScrollReset',
  'openInNewTab',
  'variant',
]);

export function LinkButtonTag(allProps: ResolvedLinkButtonProps) {
  const props = {} as ResolvedLinkButtonProps;
  for (const key in allProps) {
    if (linkButtonProps.has(key) || isPropValid(key)) {
      (props as Record<string, unknown>)[key] = allProps[key as keyof typeof allProps];
    }
  }
  const {handleClick} = useClickTracking(props, 'link');

  if ('to' in props && props.to) {
    const {openInNewTab, ...linkProps} = props;
    return (
      <Link
        {...linkProps}
        to={props.to}
        role="button"
        {...(openInNewTab ? {target: '_blank', rel: 'noreferrer noopener'} : {})}
      />
    );
  }

  if ('href' in props && props.href) {
    const {
      external,
      analyticsEventKey: _analyticsEventKey,
      analyticsEventName: _analyticsEventName,
      analyticsParams: _analyticsParams,
      busy: _busy,
      variant: _variant,
      ...rest
    } = props;
    return (
      <a
        {...rest}
        onClick={handleClick}
        {...(external ? {target: '_blank', rel: 'noreferrer noopener'} : {})}
        role="button"
      />
    );
  }

  const {
    external: _e,
    replace: _r,
    preventScrollReset: _p,
    openInNewTab: _o,
    analyticsEventKey: _analyticsEventKey,
    analyticsEventName: _analyticsEventName,
    analyticsParams: _analyticsParams,
    busy: _busy,
    variant: _variant,
    ...rest
    // cast because props cannot be statically determined at this point
  } = props as any;
  return <a {...rest} onClick={handleClick} role="button" />;
}
