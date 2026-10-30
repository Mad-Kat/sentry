import type * as React from 'react';

import type {CSS} from '@sentry/scraps/cssTypes';
import type {
  BorderVariant,
  RadiusSize,
  SpaceSize,
  SurfaceVariant,
} from '@sentry/scraps/theme';

import {StyledContainer} from './generatedStyles';
import type {Responsive, Shorthand} from './styles';

type Margin = SpaceSize | 'auto' | '0';

/* eslint-disable @sentry/sort-interface-keys */
export interface ContainerLayoutProps {
  background?: Responsive<Exclude<SurfaceVariant, 'overlay'>>;
  display?: Responsive<CSS['display']>;

  padding?: Responsive<Shorthand<SpaceSize, 4>>;
  paddingTop?: Responsive<SpaceSize>;
  paddingBottom?: Responsive<SpaceSize>;
  paddingLeft?: Responsive<SpaceSize>;
  paddingRight?: Responsive<SpaceSize>;

  position?: Responsive<CSS['position']>;

  inset?: Responsive<CSS['inset']>;
  top?: Responsive<CSS['inset']>;
  bottom?: Responsive<CSS['inset']>;
  left?: Responsive<CSS['inset']>;
  right?: Responsive<CSS['inset']>;

  overflow?: Responsive<'visible' | 'hidden' | 'scroll' | 'auto'>;
  overflowX?: Responsive<'visible' | 'hidden' | 'scroll' | 'auto'>;
  overflowY?: Responsive<'visible' | 'hidden' | 'scroll' | 'auto'>;

  overscrollBehavior?: Responsive<'contain' | 'auto' | 'none'>;

  pointerEvents?: Responsive<CSS['pointerEvents']>;

  cursor?: Responsive<CSS['cursor']>;

  contain?: Responsive<CSS['contain']>;

  /**
   * Declares this element as a query container, so descendants' container
   * responsive props (bare breakpoint keys like `{xs: …}`) resolve against its
   * size. Maps to the CSS `container-type`.
   *
   * Prefer `inline-size`: it only contains the inline (width) axis, so height
   * still flows from content. `size` additionally contains the block axis, so
   * the element must get its height from elsewhere or its content collapses —
   * only reach for it when you genuinely need height-based queries. `normal`
   * (the default) means the element is not a size query container, so
   * descendants resolve against the next container up — equivalent to omitting
   * the prop.
   */
  containerType?: 'inline-size' | 'size' | 'normal';

  radius?: Responsive<Shorthand<RadiusSize, 4>>;

  width?: Responsive<CSS['width']>;
  minWidth?: Responsive<CSS['minWidth']>;
  maxWidth?: Responsive<CSS['maxWidth']>;

  height?: Responsive<CSS['height']>;
  minHeight?: Responsive<CSS['minHeight']>;
  maxHeight?: Responsive<CSS['maxHeight']>;

  border?: Responsive<BorderVariant>;
  borderTop?: Responsive<BorderVariant>;
  borderBottom?: Responsive<BorderVariant>;
  borderLeft?: Responsive<BorderVariant>;
  borderRight?: Responsive<BorderVariant>;

  // Grid Item Properties
  area?: Responsive<CSS['gridArea']>;
  row?: Responsive<CSS['gridRow']>;
  column?: Responsive<CSS['gridColumn']>;

  // Flex Item Properties
  order?: Responsive<CSS['order']>;
  flex?: Responsive<CSS['flex']>;
  flexGrow?: Responsive<CSS['flexGrow']>;
  flexShrink?: Responsive<CSS['flexShrink']>;
  flexBasis?: Responsive<CSS['flexBasis']>;
  alignSelf?: Responsive<CSS['alignSelf']>;
  justifySelf?: Responsive<CSS['justifySelf']>;

  visibility?: Responsive<'visible' | 'hidden' | 'collapse'>;

  // Text Wrapping
  whiteSpace?: Responsive<
    'break-spaces' | 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap'
  >;

  /**
   * @deprecated Use the `gap` prop on `Flex` or `Grid` instead.
   */
  margin?: Responsive<Shorthand<Margin, 4>>;
  /**
   * @deprecated Use the `gap` prop on `Flex` or `Grid` instead.
   */
  marginTop?: Responsive<Margin>;
  /**
   * @deprecated Use the `gap` prop on `Flex` or `Grid` instead.
   */
  marginBottom?: Responsive<Margin>;
  /**
   * @deprecated Use the `gap` prop on `Flex` or `Grid` instead.
   */
  marginLeft?: Responsive<Margin>;
  /**
   * @deprecated Use the `gap` prop on `Flex` or `Grid` instead.
   */
  marginRight?: Responsive<Margin>;
}

/* eslint-enable @sentry/sort-interface-keys */
export type ContainerElement =
  | 'article'
  | 'aside'
  | 'blockquote'
  | 'div'
  | 'dl'
  | 'fieldset'
  | 'figure'
  | 'footer'
  | 'header'
  | 'label'
  | 'li'
  | 'main'
  | 'nav'
  | 'ol'
  | 'section'
  | 'span'
  | 'summary'
  | 'td'
  | 'th'
  | 'ul'
  | 'hr';

export type ContainerProps<T extends ContainerElement = 'div'> = ContainerLayoutProps & {
  as?: T;
  children?: React.ReactNode;
  htmlFor?: T extends 'label' ? string : never;
  ref?: React.Ref<HTMLElementTagNameMap[T] | null>;
  /**
   * Deprecated in favor of the Container component API.
   * If you have an is an unsupported use-case, please contact design engineering for support.
   * @deprecated
   */
  style?: React.CSSProperties;
} & Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElementTagNameMap[T]>,
      HTMLElementTagNameMap[T]
    >,
    'style'
  >;

export type ContainerPropsWithRenderFunction<T extends ContainerElement = 'div'> = Omit<
  ContainerLayoutProps,
  'containerType'
> & {
  children: (props: {
    className: string;
    style: React.CSSProperties | undefined;
  }) => React.ReactNode | undefined;
  as?: never;
  /**
   * Declaring a query container is not supported with the render-prop form: the
   * styled component must own the DOM node to observe it for JS resolution,
   * which the render prop hands to the caller. Use the standard children form.
   */
  containerType?: never;
  htmlFor?: never;
  ref?: never;
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

export const Container = StyledContainer as unknown as <
  T extends ContainerElement = 'div',
>(
  props: ContainerProps<T> | ContainerPropsWithRenderFunction<T>
) => React.ReactElement;
