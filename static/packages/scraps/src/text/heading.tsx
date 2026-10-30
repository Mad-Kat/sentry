import type * as React from 'react';
import {css, styled} from '@yak/react';

import type {Responsive} from '@sentry/scraps/layout';
import type {HeadingSize} from '@sentry/scraps/theme';
// yak inlines static tokens into the CSS at build time. A theme token becomes a CSS variable.
// oxlint-disable-next-line @sentry/scraps/no-token-import
import {typography} from '@sentry/scraps/tokens/typography';

import {getTextDecoration} from './styles';
import {type BaseTextProps} from './text';
import {TextElement} from './textElement';

type BaseHeadingProps = Omit<BaseTextProps, 'bold' | 'uppercase'>;

type ExclusiveHeadingEllipsisProps =
  | {ellipsis?: true; wrap?: never}
  | {ellipsis?: never; wrap?: BaseTextProps['wrap']};

export type HeadingProps = BaseHeadingProps & {
  /**
   * The HTML element to render the title as.
   * @required
   */
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ref?: React.Ref<HTMLHeadingElement | null> | undefined;
  /**
   * The size of the text.
   * @default md
   */
  size?: Responsive<HeadingSize>;
  /**
   * Deprecated in favor of the Text component API.
   * If you have an is an unsupported use-case, please contact design engineering for support.
   * @deprecated
   */
  style?: React.CSSProperties;
} & Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
    'style'
  > &
  ExclusiveHeadingEllipsisProps;

export type HeadingPropsWithRenderFunction = BaseHeadingProps &
  ExclusiveHeadingEllipsisProps & {
    children: (props: {
      className: string;
      style: React.CSSProperties | undefined;
    }) => React.ReactNode | undefined;
    as?: never;
    ref?: never;
    size?: Responsive<HeadingSize>;
  } & Partial<
    Record<
      // HTMLAttributes extends from DOMAttributes which types children as React.ReactNode | undefined.
      // Therefore, we need to exclude it from the map, or the children will produce a never type.
      Exclude<
        keyof React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLHeadingElement>,
          HTMLHeadingElement
        >,
        'children'
      >,
      never
    >
  >;

type HeadingStyleProps = BaseHeadingProps & {
  as?: HeadingProps['as'];
  size?: Responsive<HeadingSize>;
};

export const Heading = styled(TextElement).attrs<HeadingStyleProps>(p => ({
  // An inherited heading keeps the parent font size unless it sets a size.
  size:
    p.size ??
    (p.variant === 'inherit' || !p.as ? undefined : getDefaultHeadingFontSize(p.as)),
}))<HeadingStyleProps>`
  ${({size, variant}) =>
    variant === 'inherit' &&
    size === undefined &&
    css`
      font-size: inherit;
    `}
  ${({density, variant}) =>
    variant === 'inherit' &&
    density === undefined &&
    css`
      line-height: inherit;
    `}
  ${({italic}) =>
    italic &&
    css`
      font-style: italic;
    `}
  ${({strikethrough, underline}) => {
    switch (getTextDecoration({strikethrough, underline})) {
      case 'line-through':
        return css`
          text-decoration: line-through;
        `;
      case 'underline':
        return css`
          text-decoration: underline;
        `;
      case 'underline dotted':
        return css`
          text-decoration: underline dotted;
        `;
      case 'line-through underline':
        return css`
          text-decoration: line-through underline;
        `;
      case 'line-through underline dotted':
        return css`
          text-decoration: line-through underline dotted;
        `;
      default:
        return false;
    }
  }}
  ${({variant}) => {
    switch (variant) {
      case 'inherit':
        return false;
      case 'muted':
      case 'secondary':
        return css`
          color: var(--tokens-content-secondary);
        `;
      case 'accent':
        return css`
          color: var(--tokens-content-accent);
        `;
      case 'danger':
        return css`
          color: var(--tokens-content-danger);
        `;
      case 'promotion':
        return css`
          color: var(--tokens-content-promotion);
        `;
      case 'success':
        return css`
          color: var(--tokens-content-success);
        `;
      case 'warning':
        return css`
          color: var(--tokens-content-warning);
        `;
      default:
        return css`
          color: var(--tokens-content-primary);
        `;
    }
  }}
  ${({ellipsis}) =>
    ellipsis &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  ${({ellipsis, wrap}) =>
    (ellipsis || wrap !== undefined) &&
    css<HeadingStyleProps>`
      white-space: ${({wrap}) => wrap ?? 'nowrap'};
    `}
  ${({textWrap}) => {
    switch (textWrap) {
      case 'wrap':
        return css`
          text-wrap: wrap;
        `;
      case 'nowrap':
        return css`
          text-wrap: nowrap;
        `;
      case 'balance':
        return css`
          text-wrap: balance;
        `;
      case 'pretty':
        return css`
          text-wrap: pretty;
        `;
      case 'stable':
        return css`
          text-wrap: stable;
        `;
      default:
        return false;
    }
  }}
  ${({wordBreak}) => {
    switch (wordBreak) {
      case 'normal':
        return css`
          word-break: normal;
        `;
      case 'break-all':
        return css`
          word-break: break-all;
        `;
      case 'keep-all':
        return css`
          word-break: keep-all;
        `;
      case 'break-word':
        return css`
          word-break: break-word;
        `;
      default:
        return false;
    }
  }}

  ${({monospace}) =>
    monospace
      ? css`
          font-family: ${typography.font.family.mono};
        `
      : css`
          font-family: ${typography.font.family.sans};
        `}
  ${({variant}) =>
    variant === 'inherit'
      ? css`
          font-weight: inherit;
        `
      : css`
          font-weight: ${typography.font.weight.sans.medium};
        `}
  ${({fraction, tabular}) =>
    tabular && fraction
      ? css`
          font-variant-numeric: tabular-nums diagonal-fractions;
        `
      : tabular
        ? css`
            font-variant-numeric: tabular-nums;
          `
        : fraction &&
          css`
            font-variant-numeric: diagonal-fractions;
          `}

  text-box-edge: text text;
  text-box-trim: trim-both;

  /* Reset any margin or padding that might be set by the global CSS styles. */
  margin: 0;
  padding: 0;
` as unknown as (
  props: HeadingProps | HeadingPropsWithRenderFunction
) => React.ReactElement;

function getDefaultHeadingFontSize(as: HeadingProps['as']): HeadingSize {
  switch (as) {
    case 'h1':
      return '2xl';
    case 'h2':
      return 'xl';
    case 'h3':
      return 'lg';
    case 'h4':
      return 'md';
    case 'h5':
      return 'sm';
    case 'h6':
      return 'xs';
    default:
      return '2xl';
  }
}
