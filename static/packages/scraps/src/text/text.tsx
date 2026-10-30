import type * as React from 'react';
import {css, styled} from '@yak/react';

import type {Responsive} from '@sentry/scraps/layout';
import type {ContentVariant, TextSize, Theme} from '@sentry/scraps/theme';
// yak inlines static tokens into the CSS at build time. A theme token becomes a CSS variable.
// oxlint-disable-next-line @sentry/scraps/no-token-import
import {typography} from '@sentry/scraps/tokens/typography';

import {getTextDecoration} from './styles';
import {TextElement} from './textElement';

export interface BaseTextProps {
  /**
   * Horizontal alignment of the text.
   *
   */
  align?: Responsive<'left' | 'center' | 'right' | 'justify'>;
  bold?: boolean;

  /**
   * Determines the cursor style when hovering over the text.
   * @default 'default'
   */
  cursor?: 'default' | 'pointer' | 'text' | 'move' | 'not-allowed' | 'wait' | 'help';

  /**
   * Density determines the line height of the text.
   * Defaults to 1.2, but supports the following density variants:
   * - compressed: 1
   * - default: 1.2
   * - comfortable: 1.4
   * - fixed: 1rem
   */
  density?: Responsive<keyof Theme['font']['lineHeight']>;
  /**
   * If true, the text will be truncated with an ellipsis,
   * overflow will be hidden and white-space will be set to nowrap.
   * @default false
   */
  ellipsis?: boolean;
  /**
   * Determines if fractional numbers should be displayed using diagonal fractions.
   * @default false
   */
  fraction?: boolean;

  /**
   * Determines if the text should be italic.
   * @default false
   */
  italic?: boolean;

  /**
   * If true, the text will be displayed in a monospace font.
   */
  monospace?: boolean;

  /**
   * Strikethrough the text.
   * @default false
   */
  strikethrough?: boolean;

  /**
   * If true, the text will be displayed in a tabular font (fixed width numbers)
   */
  tabular?: boolean;

  /**
   * Determines how text wrapping is handled using the CSS text-wrap property.
   * @default undefined
   */
  textWrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable';

  /**
   * Determines how text should be underlined.
   * @default undefined
   */
  underline?: boolean | 'dotted';

  /**
   * Uppercase the text.
   */
  uppercase?: boolean;

  /**
   * Variant determines the style of the text.
   * - Use a semantic variant (e.g. `primary`, `muted`) to apply a token-based color.
   * - Use `inherit` to explicitly inherit the color from the parent element.
   * @default primary
   */
  variant?: ContentVariant | 'muted' | 'inherit';

  /**
   * Determines where line breaks appear when wrapping the text.
   * @default undefined
   */
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';

  /**
   * Determines text wrapping.
   */
  wrap?: 'nowrap' | 'normal' | 'pre' | 'pre-line' | 'pre-wrap';
}

type ExclusiveTextEllipsisProps =
  | {
      // ellipsis always needs a block-level box to truncate
      display?: never;
      ellipsis?: true;
      wrap?: never;
    }
  | {
      display?: Responsive<DisplayValue>;
      ellipsis?: never;
      wrap?: BaseTextProps['wrap'];
    };

interface TextAttributes<T extends TextPrimitive = 'span'>
  extends
    BaseTextProps,
    Omit<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap[T]>,
        HTMLElementTagNameMap[T]
      >,
      'style'
    > {
  /**
   * Our decision to make children required conflicts with the optional signature of the React.DetailedHTMLProps type.
   * To resolve it, we move the children definition after the React.DetailedHTMLProps type,
   * which narrows the type from optional to required as expected.
   */
  children: React.ReactNode;
  /**
   * The HTML element to render the text as - defaults to span.
   * @default span
   */
  as?: T;
  /**
   * Forbid color HTML attribute from being passed to the component, all usage should be variant-based.
   */
  color?: never;
  dateTime?: T extends 'time' ? string : never;

  /**
   * This could have been avoided by using React.JSX.IntrinsicElements<T>, however doing so would be
   * grosely inefficient, as it would cause type helpers like DistributedOmit to traverse the entire
   * type HTML Attribute set of each element, slowing down our type compilation. In my test, using
   * React.JSX.IntrinsicElements<T> caused native ts compilation to take 2x longer.
   *
   */
  htmlFor?: T extends 'label' ? string : never;
  /**
   * The size of the text.
   * @default md
   */
  size?: Responsive<TextSize>;

  /**
   * Deprecated in favor of the Text component API.
   * If you have an is an unsupported use-case, please contact design engineering for support.
   * @deprecated
   */
  style?: React.CSSProperties;
}

type TextPrimitive = 'span' | 'p' | 'label' | 'div' | 'time' | 'legend';

type DisplayValue = 'inline' | 'block' | 'inline-block' | 'none';

type TextStyleProps = BaseTextProps & {
  as?: TextPrimitive;
  display?: Responsive<DisplayValue>;
  size?: Responsive<TextSize>;
};

function getDefaultDisplay(p: {
  align?: BaseTextProps['align'];
  as?: TextPrimitive;
  ellipsis?: boolean;
}): DisplayValue | undefined {
  if (p.as === 'div') {
    return 'block';
  }
  if (p.ellipsis || p.align) {
    return p.as === 'span' ? 'inline-block' : 'block';
  }
  return undefined;
}

function getNativeDisplay(as: TextPrimitive | undefined): DisplayValue {
  return as === 'p' || as === 'div' || as === 'legend' ? 'block' : 'inline';
}

/**
 * When no explicit `display` prop is set, the derived default is applied.
 * For a responsive prop we seed the base (`zero`) slot when the consumer left it unset
 * (with the derived default, or the element's native display when there is none)
 * so unspecified small breakpoints keep the sensible default instead of inheriting the value of
 * the smallest specified breakpoint (which would otherwise become the base).
 */
function getTextDisplay(p: TextStyleProps): Responsive<DisplayValue> | undefined {
  const fallback = getDefaultDisplay(p);

  if (p.display === undefined) {
    return fallback;
  }

  if (typeof p.display === 'string') {
    return p.display;
  }

  return p.display.zero === undefined
    ? {zero: fallback ?? getNativeDisplay(p.as), ...p.display}
    : p.display;
}

export type TextProps<T extends TextPrimitive> = TextAttributes<T> &
  ExclusiveTextEllipsisProps;

export type TextPropsWithRenderFunction<T extends TextPrimitive = 'span'> =
  BaseTextProps &
    ExclusiveTextEllipsisProps & {
      children: (props: {
        className: string;
        style: React.CSSProperties | undefined;
      }) => React.ReactNode | undefined;
      as?: never;
      color?: never;
      dateTime?: never;
      htmlFor?: never;
      ref?: never;
      size?: Responsive<TextSize>;
    } & Partial<
      Record<
        // HTMLAttributes extends from DOMAttributes which types children as React.ReactNode | undefined.
        // Therefore, we need to exclude it from the map, or the children will produce a never type.
        Exclude<
          keyof React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElementTagNameMap[T]>,
            HTMLElementTagNameMap[T]
          >,
          'children'
        >,
        never
      >
    >;

export const Text = styled(TextElement).attrs<TextStyleProps>(p => ({
  display: getTextDisplay(p),
}))<TextStyleProps>`
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
  ${({cursor}) => {
    switch (cursor) {
      case 'default':
        return css`
          cursor: default;
        `;
      case 'pointer':
        return css`
          cursor: pointer;
        `;
      case 'text':
        return css`
          cursor: text;
        `;
      case 'move':
        return css`
          cursor: move;
        `;
      case 'not-allowed':
        return css`
          cursor: not-allowed;
        `;
      case 'wait':
        return css`
          cursor: wait;
        `;
      case 'help':
        return css`
          cursor: help;
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
      width: 100%;
    `}
  ${({ellipsis, wrap}) => {
    switch (wrap ?? (ellipsis ? 'nowrap' : undefined)) {
      case 'nowrap':
        return css`
          white-space: nowrap;
        `;
      case 'normal':
        return css`
          white-space: normal;
        `;
      case 'pre':
        return css`
          white-space: pre;
        `;
      case 'pre-line':
        return css`
          white-space: pre-line;
        `;
      case 'pre-wrap':
        return css`
          white-space: pre-wrap;
        `;
      default:
        return false;
    }
  }}
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
  ${({bold, monospace}) =>
    bold === true &&
    (monospace
      ? css`
          font-weight: ${typography.font.weight.mono.medium};
        `
      : css`
          font-weight: ${typography.font.weight.sans.medium};
        `)}
  ${({bold, monospace}) =>
    bold === false &&
    (monospace
      ? css`
          font-weight: ${typography.font.weight.mono.regular};
        `
      : css`
          font-weight: ${typography.font.weight.sans.regular};
        `)}
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
  ${({uppercase}) =>
    uppercase &&
    css`
      text-transform: uppercase;
    `}

  text-box-edge: text text;
  ${({trim}) =>
    trim === false
      ? css`
          text-box-trim: none;
        `
      : css`
          text-box-trim: trim-both;
        `}

  /* Reset any margin or padding that might be set by the global CSS styles. */
  margin: 0;
  padding: 0;
` as unknown as <T extends TextPrimitive = 'span'>(
  props: TextProps<T> | TextPropsWithRenderFunction<T>
) => React.ReactElement;
