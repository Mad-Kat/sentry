import type * as React from 'react';
import {useMemo, useRef} from 'react';
import isPropValid from '@emotion/is-prop-valid';
import {mergeRefs} from '@react-aria/utils';
import {atoms, css, styled} from '@yak/react';

import type {CSS} from '@sentry/scraps/cssTypes';
import type {
  BorderVariant,
  RadiusSize,
  SpaceSize,
  SurfaceVariant,
} from '@sentry/scraps/theme';

import {
  backgroundAt,
  borderAt,
  ContainerQueryProvider,
  getBackground,
  getBorder,
  getMargin,
  getRadius,
  getSpacing,
  asPlain,
  isResponsive,
  marginAt,
  radiusAt,
  spacingAt,
  valueAt,
  type Responsive,
  type Shorthand,
} from './styles';

type Margin = SpaceSize | 'auto' | '0';

/* eslint-disable @sentry/sort-interface-keys */
interface ContainerLayoutProps {
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

// yak forwards all props to the wrapped component. These props style the
// element and never reach the DOM. The list includes the props of Flex and Grid,
// which wrap Container.
const omitLayoutProps = new Set<string>([
  'align',
  'alignContent',
  'areas',
  'autoColumns',
  'autoRows',
  'columns',
  'direction',
  'flow',
  'gap',
  'justify',
  'justifyItems',
  'rows',
  'wrap',
  'alignSelf',
  'area',
  'as',
  'background',
  'border',
  'borderTop',
  'borderBottom',
  'borderLeft',
  'borderRight',
  'bottom',
  'column',
  'contain',
  'cursor',
  'display',
  'flex',
  'flexBasis',
  'flexGrow',
  'flexShrink',
  'height',
  'inset',
  'justifySelf',
  'left',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'order',
  'overflow',
  'overflowX',
  'overflowY',
  'overscrollBehavior',
  'pointerEvents',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'position',
  'radius',
  'right',
  'row',
  'top',
  'visibility',
  'width',
  'whiteSpace',
]);

function ContainerBase<T extends ContainerElement = 'div'>(
  props: (ContainerProps<T> | ContainerPropsWithRenderFunction<T>) & {
    className?: string;
  }
) {
  // Hooks must run unconditionally, before the render-prop early return.
  const containerRef = useRef<HTMLElement>(null);
  const {as, containerType, ref, ...rest} = props;

  // A query container needs its size observed in JS so descendants can resolve
  // container-mode responsive props (e.g. Stack orientation). We only attach a
  // ref + observer when this element is actually a container, keeping the
  // common (non-container) path free of any ResizeObserver overhead.
  const isContainer = !!containerType && containerType !== 'normal';

  const containerRefs = useMemo(
    // This code moved unchanged out of the Emotion styled() callback, where the
    // rule did not see a component.
    // oxlint-disable-next-line react/refs
    () => (isContainer ? mergeRefs(ref as React.Ref<any>, containerRef) : ref),
    [isContainer, ref]
  );

  if (typeof props.children === 'function') {
    // The render prop receives the class names and the CSS variables of the
    // styles. The caller puts both on its element.
    return props.children({className: props.className ?? '', style: props.style});
  }

  const Component = as ?? 'div';

  const domProps: Record<string, unknown> = {};
  for (const key in rest) {
    if (!omitLayoutProps.has(key) && isPropValid(key)) {
      domProps[key] = rest[key as keyof typeof rest];
    }
  }

  const node = <Component {...(domProps as any)} ref={containerRefs} />;

  if (isContainer) {
    return (
      <ContainerQueryProvider elementRef={containerRef}>{node}</ContainerQueryProvider>
    );
  }

  return node;
}

// One mixin for each prop. A responsive value uses the responsive mixin: it sets
// one variable per breakpoint, and each breakpoint carries the value of the
// smaller ones.
const containerTypeStyles = css<ContainerLayoutProps>`
  container-type: ${({containerType}) => containerType};
`;

const displayStyles = css<ContainerLayoutProps>`
  display: ${({display}) => asPlain(display)};
`;

const responsiveDisplayStyles = css<ContainerLayoutProps>`
  --display-container: initial;
  --display-screen: initial;
  display: var(
    --display-screen,
    var(--display-container, ${({display}) => valueAt(display, 'zero')})
  );
  @container (min-width: 320px) {
    --display-container: ${({display}) => valueAt(display, '3xs')};
  }
  @container (min-width: 384px) {
    --display-container: ${({display}) => valueAt(display, '2xs')};
  }
  @container (min-width: 448px) {
    --display-container: ${({display}) => valueAt(display, 'xs')};
  }
  @container (min-width: 512px) {
    --display-container: ${({display}) => valueAt(display, 'sm')};
  }
  @container (min-width: 576px) {
    --display-container: ${({display}) => valueAt(display, 'md')};
  }
  @container (min-width: 640px) {
    --display-container: ${({display}) => valueAt(display, 'lg')};
  }
  @container (min-width: 768px) {
    --display-container: ${({display}) => valueAt(display, 'xl')};
  }
  @container (min-width: 896px) {
    --display-container: ${({display}) => valueAt(display, '2xl')};
  }
  @container (min-width: 1024px) {
    --display-container: ${({display}) => valueAt(display, '3xl')};
  }
  @container (min-width: 1152px) {
    --display-container: ${({display}) => valueAt(display, '4xl')};
  }
  @container (min-width: 1280px) {
    --display-container: ${({display}) => valueAt(display, '5xl')};
  }
  @media (min-width: 0px) {
    --display-screen: ${({display}) => valueAt(display, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --display-screen: ${({display}) => valueAt(display, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --display-screen: ${({display}) => valueAt(display, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --display-screen: ${({display}) => valueAt(display, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --display-screen: ${({display}) => valueAt(display, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --display-screen: ${({display}) => valueAt(display, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --display-screen: ${({display}) => valueAt(display, 'screen:2xl')};
  }
`;

const positionStyles = css<ContainerLayoutProps>`
  position: ${({position}) => asPlain(position)};
`;

const responsivePositionStyles = css<ContainerLayoutProps>`
  --position-container: initial;
  --position-screen: initial;
  position: var(
    --position-screen,
    var(--position-container, ${({position}) => valueAt(position, 'zero')})
  );
  @container (min-width: 320px) {
    --position-container: ${({position}) => valueAt(position, '3xs')};
  }
  @container (min-width: 384px) {
    --position-container: ${({position}) => valueAt(position, '2xs')};
  }
  @container (min-width: 448px) {
    --position-container: ${({position}) => valueAt(position, 'xs')};
  }
  @container (min-width: 512px) {
    --position-container: ${({position}) => valueAt(position, 'sm')};
  }
  @container (min-width: 576px) {
    --position-container: ${({position}) => valueAt(position, 'md')};
  }
  @container (min-width: 640px) {
    --position-container: ${({position}) => valueAt(position, 'lg')};
  }
  @container (min-width: 768px) {
    --position-container: ${({position}) => valueAt(position, 'xl')};
  }
  @container (min-width: 896px) {
    --position-container: ${({position}) => valueAt(position, '2xl')};
  }
  @container (min-width: 1024px) {
    --position-container: ${({position}) => valueAt(position, '3xl')};
  }
  @container (min-width: 1152px) {
    --position-container: ${({position}) => valueAt(position, '4xl')};
  }
  @container (min-width: 1280px) {
    --position-container: ${({position}) => valueAt(position, '5xl')};
  }
  @media (min-width: 0px) {
    --position-screen: ${({position}) => valueAt(position, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --position-screen: ${({position}) => valueAt(position, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --position-screen: ${({position}) => valueAt(position, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --position-screen: ${({position}) => valueAt(position, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --position-screen: ${({position}) => valueAt(position, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --position-screen: ${({position}) => valueAt(position, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --position-screen: ${({position}) => valueAt(position, 'screen:2xl')};
  }
`;

const insetStyles = css<ContainerLayoutProps>`
  inset: ${({inset}) => asPlain(inset)};
`;

const responsiveInsetStyles = css<ContainerLayoutProps>`
  --inset-container: initial;
  --inset-screen: initial;
  inset: var(
    --inset-screen,
    var(--inset-container, ${({inset}) => valueAt(inset, 'zero')})
  );
  @container (min-width: 320px) {
    --inset-container: ${({inset}) => valueAt(inset, '3xs')};
  }
  @container (min-width: 384px) {
    --inset-container: ${({inset}) => valueAt(inset, '2xs')};
  }
  @container (min-width: 448px) {
    --inset-container: ${({inset}) => valueAt(inset, 'xs')};
  }
  @container (min-width: 512px) {
    --inset-container: ${({inset}) => valueAt(inset, 'sm')};
  }
  @container (min-width: 576px) {
    --inset-container: ${({inset}) => valueAt(inset, 'md')};
  }
  @container (min-width: 640px) {
    --inset-container: ${({inset}) => valueAt(inset, 'lg')};
  }
  @container (min-width: 768px) {
    --inset-container: ${({inset}) => valueAt(inset, 'xl')};
  }
  @container (min-width: 896px) {
    --inset-container: ${({inset}) => valueAt(inset, '2xl')};
  }
  @container (min-width: 1024px) {
    --inset-container: ${({inset}) => valueAt(inset, '3xl')};
  }
  @container (min-width: 1152px) {
    --inset-container: ${({inset}) => valueAt(inset, '4xl')};
  }
  @container (min-width: 1280px) {
    --inset-container: ${({inset}) => valueAt(inset, '5xl')};
  }
  @media (min-width: 0px) {
    --inset-screen: ${({inset}) => valueAt(inset, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --inset-screen: ${({inset}) => valueAt(inset, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --inset-screen: ${({inset}) => valueAt(inset, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --inset-screen: ${({inset}) => valueAt(inset, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --inset-screen: ${({inset}) => valueAt(inset, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --inset-screen: ${({inset}) => valueAt(inset, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --inset-screen: ${({inset}) => valueAt(inset, 'screen:2xl')};
  }
`;

const topStyles = css<ContainerLayoutProps>`
  top: ${({top}) => asPlain(top)};
`;

const responsiveTopStyles = css<ContainerLayoutProps>`
  --top-container: initial;
  --top-screen: initial;
  top: var(--top-screen, var(--top-container, ${({top}) => valueAt(top, 'zero')}));
  @container (min-width: 320px) {
    --top-container: ${({top}) => valueAt(top, '3xs')};
  }
  @container (min-width: 384px) {
    --top-container: ${({top}) => valueAt(top, '2xs')};
  }
  @container (min-width: 448px) {
    --top-container: ${({top}) => valueAt(top, 'xs')};
  }
  @container (min-width: 512px) {
    --top-container: ${({top}) => valueAt(top, 'sm')};
  }
  @container (min-width: 576px) {
    --top-container: ${({top}) => valueAt(top, 'md')};
  }
  @container (min-width: 640px) {
    --top-container: ${({top}) => valueAt(top, 'lg')};
  }
  @container (min-width: 768px) {
    --top-container: ${({top}) => valueAt(top, 'xl')};
  }
  @container (min-width: 896px) {
    --top-container: ${({top}) => valueAt(top, '2xl')};
  }
  @container (min-width: 1024px) {
    --top-container: ${({top}) => valueAt(top, '3xl')};
  }
  @container (min-width: 1152px) {
    --top-container: ${({top}) => valueAt(top, '4xl')};
  }
  @container (min-width: 1280px) {
    --top-container: ${({top}) => valueAt(top, '5xl')};
  }
  @media (min-width: 0px) {
    --top-screen: ${({top}) => valueAt(top, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --top-screen: ${({top}) => valueAt(top, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --top-screen: ${({top}) => valueAt(top, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --top-screen: ${({top}) => valueAt(top, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --top-screen: ${({top}) => valueAt(top, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --top-screen: ${({top}) => valueAt(top, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --top-screen: ${({top}) => valueAt(top, 'screen:2xl')};
  }
`;

const bottomStyles = css<ContainerLayoutProps>`
  bottom: ${({bottom}) => asPlain(bottom)};
`;

const responsiveBottomStyles = css<ContainerLayoutProps>`
  --bottom-container: initial;
  --bottom-screen: initial;
  bottom: var(
    --bottom-screen,
    var(--bottom-container, ${({bottom}) => valueAt(bottom, 'zero')})
  );
  @container (min-width: 320px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, '3xs')};
  }
  @container (min-width: 384px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, '2xs')};
  }
  @container (min-width: 448px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, 'xs')};
  }
  @container (min-width: 512px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, 'sm')};
  }
  @container (min-width: 576px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, 'md')};
  }
  @container (min-width: 640px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, 'lg')};
  }
  @container (min-width: 768px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, 'xl')};
  }
  @container (min-width: 896px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, '2xl')};
  }
  @container (min-width: 1024px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, '3xl')};
  }
  @container (min-width: 1152px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, '4xl')};
  }
  @container (min-width: 1280px) {
    --bottom-container: ${({bottom}) => valueAt(bottom, '5xl')};
  }
  @media (min-width: 0px) {
    --bottom-screen: ${({bottom}) => valueAt(bottom, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --bottom-screen: ${({bottom}) => valueAt(bottom, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --bottom-screen: ${({bottom}) => valueAt(bottom, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --bottom-screen: ${({bottom}) => valueAt(bottom, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --bottom-screen: ${({bottom}) => valueAt(bottom, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --bottom-screen: ${({bottom}) => valueAt(bottom, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --bottom-screen: ${({bottom}) => valueAt(bottom, 'screen:2xl')};
  }
`;

const leftStyles = css<ContainerLayoutProps>`
  left: ${({left}) => asPlain(left)};
`;

const responsiveLeftStyles = css<ContainerLayoutProps>`
  --left-container: initial;
  --left-screen: initial;
  left: var(--left-screen, var(--left-container, ${({left}) => valueAt(left, 'zero')}));
  @container (min-width: 320px) {
    --left-container: ${({left}) => valueAt(left, '3xs')};
  }
  @container (min-width: 384px) {
    --left-container: ${({left}) => valueAt(left, '2xs')};
  }
  @container (min-width: 448px) {
    --left-container: ${({left}) => valueAt(left, 'xs')};
  }
  @container (min-width: 512px) {
    --left-container: ${({left}) => valueAt(left, 'sm')};
  }
  @container (min-width: 576px) {
    --left-container: ${({left}) => valueAt(left, 'md')};
  }
  @container (min-width: 640px) {
    --left-container: ${({left}) => valueAt(left, 'lg')};
  }
  @container (min-width: 768px) {
    --left-container: ${({left}) => valueAt(left, 'xl')};
  }
  @container (min-width: 896px) {
    --left-container: ${({left}) => valueAt(left, '2xl')};
  }
  @container (min-width: 1024px) {
    --left-container: ${({left}) => valueAt(left, '3xl')};
  }
  @container (min-width: 1152px) {
    --left-container: ${({left}) => valueAt(left, '4xl')};
  }
  @container (min-width: 1280px) {
    --left-container: ${({left}) => valueAt(left, '5xl')};
  }
  @media (min-width: 0px) {
    --left-screen: ${({left}) => valueAt(left, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --left-screen: ${({left}) => valueAt(left, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --left-screen: ${({left}) => valueAt(left, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --left-screen: ${({left}) => valueAt(left, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --left-screen: ${({left}) => valueAt(left, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --left-screen: ${({left}) => valueAt(left, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --left-screen: ${({left}) => valueAt(left, 'screen:2xl')};
  }
`;

const rightStyles = css<ContainerLayoutProps>`
  right: ${({right}) => asPlain(right)};
`;

const responsiveRightStyles = css<ContainerLayoutProps>`
  --right-container: initial;
  --right-screen: initial;
  right: var(
    --right-screen,
    var(--right-container, ${({right}) => valueAt(right, 'zero')})
  );
  @container (min-width: 320px) {
    --right-container: ${({right}) => valueAt(right, '3xs')};
  }
  @container (min-width: 384px) {
    --right-container: ${({right}) => valueAt(right, '2xs')};
  }
  @container (min-width: 448px) {
    --right-container: ${({right}) => valueAt(right, 'xs')};
  }
  @container (min-width: 512px) {
    --right-container: ${({right}) => valueAt(right, 'sm')};
  }
  @container (min-width: 576px) {
    --right-container: ${({right}) => valueAt(right, 'md')};
  }
  @container (min-width: 640px) {
    --right-container: ${({right}) => valueAt(right, 'lg')};
  }
  @container (min-width: 768px) {
    --right-container: ${({right}) => valueAt(right, 'xl')};
  }
  @container (min-width: 896px) {
    --right-container: ${({right}) => valueAt(right, '2xl')};
  }
  @container (min-width: 1024px) {
    --right-container: ${({right}) => valueAt(right, '3xl')};
  }
  @container (min-width: 1152px) {
    --right-container: ${({right}) => valueAt(right, '4xl')};
  }
  @container (min-width: 1280px) {
    --right-container: ${({right}) => valueAt(right, '5xl')};
  }
  @media (min-width: 0px) {
    --right-screen: ${({right}) => valueAt(right, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --right-screen: ${({right}) => valueAt(right, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --right-screen: ${({right}) => valueAt(right, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --right-screen: ${({right}) => valueAt(right, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --right-screen: ${({right}) => valueAt(right, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --right-screen: ${({right}) => valueAt(right, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --right-screen: ${({right}) => valueAt(right, 'screen:2xl')};
  }
`;

const overflowStyles = css<ContainerLayoutProps>`
  overflow: ${({overflow}) => asPlain(overflow)};
`;

const responsiveOverflowStyles = css<ContainerLayoutProps>`
  --overflow-container: initial;
  --overflow-screen: initial;
  overflow: var(
    --overflow-screen,
    var(--overflow-container, ${({overflow}) => valueAt(overflow, 'zero')})
  );
  @container (min-width: 320px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, '3xs')};
  }
  @container (min-width: 384px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, '2xs')};
  }
  @container (min-width: 448px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, 'xs')};
  }
  @container (min-width: 512px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, 'sm')};
  }
  @container (min-width: 576px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, 'md')};
  }
  @container (min-width: 640px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, 'lg')};
  }
  @container (min-width: 768px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, 'xl')};
  }
  @container (min-width: 896px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, '2xl')};
  }
  @container (min-width: 1024px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, '3xl')};
  }
  @container (min-width: 1152px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, '4xl')};
  }
  @container (min-width: 1280px) {
    --overflow-container: ${({overflow}) => valueAt(overflow, '5xl')};
  }
  @media (min-width: 0px) {
    --overflow-screen: ${({overflow}) => valueAt(overflow, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --overflow-screen: ${({overflow}) => valueAt(overflow, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --overflow-screen: ${({overflow}) => valueAt(overflow, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --overflow-screen: ${({overflow}) => valueAt(overflow, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --overflow-screen: ${({overflow}) => valueAt(overflow, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --overflow-screen: ${({overflow}) => valueAt(overflow, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --overflow-screen: ${({overflow}) => valueAt(overflow, 'screen:2xl')};
  }
`;

const overflowXStyles = css<ContainerLayoutProps>`
  overflow-x: ${({overflowX}) => asPlain(overflowX)};
`;

const responsiveOverflowXStyles = css<ContainerLayoutProps>`
  --overflow-x-container: initial;
  --overflow-x-screen: initial;
  overflow-x: var(
    --overflow-x-screen,
    var(--overflow-x-container, ${({overflowX}) => valueAt(overflowX, 'zero')})
  );
  @container (min-width: 320px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, '3xs')};
  }
  @container (min-width: 384px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, '2xs')};
  }
  @container (min-width: 448px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, 'xs')};
  }
  @container (min-width: 512px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, 'sm')};
  }
  @container (min-width: 576px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, 'md')};
  }
  @container (min-width: 640px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, 'lg')};
  }
  @container (min-width: 768px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, 'xl')};
  }
  @container (min-width: 896px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, '2xl')};
  }
  @container (min-width: 1024px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, '3xl')};
  }
  @container (min-width: 1152px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, '4xl')};
  }
  @container (min-width: 1280px) {
    --overflow-x-container: ${({overflowX}) => valueAt(overflowX, '5xl')};
  }
  @media (min-width: 0px) {
    --overflow-x-screen: ${({overflowX}) => valueAt(overflowX, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --overflow-x-screen: ${({overflowX}) => valueAt(overflowX, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --overflow-x-screen: ${({overflowX}) => valueAt(overflowX, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --overflow-x-screen: ${({overflowX}) => valueAt(overflowX, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --overflow-x-screen: ${({overflowX}) => valueAt(overflowX, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --overflow-x-screen: ${({overflowX}) => valueAt(overflowX, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --overflow-x-screen: ${({overflowX}) => valueAt(overflowX, 'screen:2xl')};
  }
`;

const overflowYStyles = css<ContainerLayoutProps>`
  overflow-y: ${({overflowY}) => asPlain(overflowY)};
`;

const responsiveOverflowYStyles = css<ContainerLayoutProps>`
  --overflow-y-container: initial;
  --overflow-y-screen: initial;
  overflow-y: var(
    --overflow-y-screen,
    var(--overflow-y-container, ${({overflowY}) => valueAt(overflowY, 'zero')})
  );
  @container (min-width: 320px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, '3xs')};
  }
  @container (min-width: 384px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, '2xs')};
  }
  @container (min-width: 448px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, 'xs')};
  }
  @container (min-width: 512px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, 'sm')};
  }
  @container (min-width: 576px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, 'md')};
  }
  @container (min-width: 640px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, 'lg')};
  }
  @container (min-width: 768px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, 'xl')};
  }
  @container (min-width: 896px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, '2xl')};
  }
  @container (min-width: 1024px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, '3xl')};
  }
  @container (min-width: 1152px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, '4xl')};
  }
  @container (min-width: 1280px) {
    --overflow-y-container: ${({overflowY}) => valueAt(overflowY, '5xl')};
  }
  @media (min-width: 0px) {
    --overflow-y-screen: ${({overflowY}) => valueAt(overflowY, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --overflow-y-screen: ${({overflowY}) => valueAt(overflowY, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --overflow-y-screen: ${({overflowY}) => valueAt(overflowY, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --overflow-y-screen: ${({overflowY}) => valueAt(overflowY, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --overflow-y-screen: ${({overflowY}) => valueAt(overflowY, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --overflow-y-screen: ${({overflowY}) => valueAt(overflowY, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --overflow-y-screen: ${({overflowY}) => valueAt(overflowY, 'screen:2xl')};
  }
`;

const overscrollBehaviorStyles = css<ContainerLayoutProps>`
  overscroll-behavior: ${({overscrollBehavior}) => asPlain(overscrollBehavior)};
`;

const responsiveOverscrollBehaviorStyles = css<ContainerLayoutProps>`
  --overscroll-behavior-container: initial;
  --overscroll-behavior-screen: initial;
  overscroll-behavior: var(
    --overscroll-behavior-screen,
    var(
      --overscroll-behavior-container,
      ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'zero')}
    )
  );
  @container (min-width: 320px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, '3xs')};
  }
  @container (min-width: 384px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, '2xs')};
  }
  @container (min-width: 448px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'xs')};
  }
  @container (min-width: 512px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'sm')};
  }
  @container (min-width: 576px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'md')};
  }
  @container (min-width: 640px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'lg')};
  }
  @container (min-width: 768px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'xl')};
  }
  @container (min-width: 896px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, '2xl')};
  }
  @container (min-width: 1024px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, '3xl')};
  }
  @container (min-width: 1152px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, '4xl')};
  }
  @container (min-width: 1280px) {
    --overscroll-behavior-container: ${({overscrollBehavior}) => valueAt(overscrollBehavior, '5xl')};
  }
  @media (min-width: 0px) {
    --overscroll-behavior-screen: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --overscroll-behavior-screen: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --overscroll-behavior-screen: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --overscroll-behavior-screen: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --overscroll-behavior-screen: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --overscroll-behavior-screen: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --overscroll-behavior-screen: ${({overscrollBehavior}) => valueAt(overscrollBehavior, 'screen:2xl')};
  }
`;

const pointerEventsStyles = css<ContainerLayoutProps>`
  pointer-events: ${({pointerEvents}) => asPlain(pointerEvents)};
`;

const responsivePointerEventsStyles = css<ContainerLayoutProps>`
  --pointer-events-container: initial;
  --pointer-events-screen: initial;
  pointer-events: var(
    --pointer-events-screen,
    var(
      --pointer-events-container,
      ${({pointerEvents}) => valueAt(pointerEvents, 'zero')}
    )
  );
  @container (min-width: 320px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, '3xs')};
  }
  @container (min-width: 384px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, '2xs')};
  }
  @container (min-width: 448px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, 'xs')};
  }
  @container (min-width: 512px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, 'sm')};
  }
  @container (min-width: 576px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, 'md')};
  }
  @container (min-width: 640px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, 'lg')};
  }
  @container (min-width: 768px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, 'xl')};
  }
  @container (min-width: 896px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, '2xl')};
  }
  @container (min-width: 1024px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, '3xl')};
  }
  @container (min-width: 1152px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, '4xl')};
  }
  @container (min-width: 1280px) {
    --pointer-events-container: ${({pointerEvents}) => valueAt(pointerEvents, '5xl')};
  }
  @media (min-width: 0px) {
    --pointer-events-screen: ${({pointerEvents}) => valueAt(pointerEvents, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --pointer-events-screen: ${({pointerEvents}) => valueAt(pointerEvents, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --pointer-events-screen: ${({pointerEvents}) => valueAt(pointerEvents, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --pointer-events-screen: ${({pointerEvents}) => valueAt(pointerEvents, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --pointer-events-screen: ${({pointerEvents}) => valueAt(pointerEvents, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --pointer-events-screen: ${({pointerEvents}) => valueAt(pointerEvents, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --pointer-events-screen: ${({pointerEvents}) => valueAt(pointerEvents, 'screen:2xl')};
  }
`;

const cursorStyles = css<ContainerLayoutProps>`
  cursor: ${({cursor}) => asPlain(cursor)};
`;

const responsiveCursorStyles = css<ContainerLayoutProps>`
  --cursor-container: initial;
  --cursor-screen: initial;
  cursor: var(
    --cursor-screen,
    var(--cursor-container, ${({cursor}) => valueAt(cursor, 'zero')})
  );
  @container (min-width: 320px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, '3xs')};
  }
  @container (min-width: 384px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, '2xs')};
  }
  @container (min-width: 448px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, 'xs')};
  }
  @container (min-width: 512px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, 'sm')};
  }
  @container (min-width: 576px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, 'md')};
  }
  @container (min-width: 640px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, 'lg')};
  }
  @container (min-width: 768px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, 'xl')};
  }
  @container (min-width: 896px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, '2xl')};
  }
  @container (min-width: 1024px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, '3xl')};
  }
  @container (min-width: 1152px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, '4xl')};
  }
  @container (min-width: 1280px) {
    --cursor-container: ${({cursor}) => valueAt(cursor, '5xl')};
  }
  @media (min-width: 0px) {
    --cursor-screen: ${({cursor}) => valueAt(cursor, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --cursor-screen: ${({cursor}) => valueAt(cursor, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --cursor-screen: ${({cursor}) => valueAt(cursor, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --cursor-screen: ${({cursor}) => valueAt(cursor, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --cursor-screen: ${({cursor}) => valueAt(cursor, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --cursor-screen: ${({cursor}) => valueAt(cursor, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --cursor-screen: ${({cursor}) => valueAt(cursor, 'screen:2xl')};
  }
`;

const containStyles = css<ContainerLayoutProps>`
  contain: ${({contain}) => asPlain(contain)};
`;

const responsiveContainStyles = css<ContainerLayoutProps>`
  --contain-container: initial;
  --contain-screen: initial;
  contain: var(
    --contain-screen,
    var(--contain-container, ${({contain}) => valueAt(contain, 'zero')})
  );
  @container (min-width: 320px) {
    --contain-container: ${({contain}) => valueAt(contain, '3xs')};
  }
  @container (min-width: 384px) {
    --contain-container: ${({contain}) => valueAt(contain, '2xs')};
  }
  @container (min-width: 448px) {
    --contain-container: ${({contain}) => valueAt(contain, 'xs')};
  }
  @container (min-width: 512px) {
    --contain-container: ${({contain}) => valueAt(contain, 'sm')};
  }
  @container (min-width: 576px) {
    --contain-container: ${({contain}) => valueAt(contain, 'md')};
  }
  @container (min-width: 640px) {
    --contain-container: ${({contain}) => valueAt(contain, 'lg')};
  }
  @container (min-width: 768px) {
    --contain-container: ${({contain}) => valueAt(contain, 'xl')};
  }
  @container (min-width: 896px) {
    --contain-container: ${({contain}) => valueAt(contain, '2xl')};
  }
  @container (min-width: 1024px) {
    --contain-container: ${({contain}) => valueAt(contain, '3xl')};
  }
  @container (min-width: 1152px) {
    --contain-container: ${({contain}) => valueAt(contain, '4xl')};
  }
  @container (min-width: 1280px) {
    --contain-container: ${({contain}) => valueAt(contain, '5xl')};
  }
  @media (min-width: 0px) {
    --contain-screen: ${({contain}) => valueAt(contain, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --contain-screen: ${({contain}) => valueAt(contain, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --contain-screen: ${({contain}) => valueAt(contain, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --contain-screen: ${({contain}) => valueAt(contain, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --contain-screen: ${({contain}) => valueAt(contain, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --contain-screen: ${({contain}) => valueAt(contain, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --contain-screen: ${({contain}) => valueAt(contain, 'screen:2xl')};
  }
`;

const paddingStyles = css<ContainerLayoutProps>`
  padding: ${({padding, theme}) => getSpacing(asPlain(padding), undefined, theme)};
`;

const responsivePaddingStyles = css<ContainerLayoutProps>`
  --padding-container: initial;
  --padding-screen: initial;
  padding: var(
    --padding-screen,
    var(--padding-container, ${({padding, theme}) => spacingAt(padding, 'zero', theme)})
  );
  @container (min-width: 320px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, 'md', theme)};
  }
  @container (min-width: 640px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --padding-container: ${({padding, theme}) => spacingAt(padding, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --padding-screen: ${({padding, theme}) => spacingAt(padding, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --padding-screen: ${({padding, theme}) => spacingAt(padding, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --padding-screen: ${({padding, theme}) => spacingAt(padding, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --padding-screen: ${({padding, theme}) => spacingAt(padding, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --padding-screen: ${({padding, theme}) => spacingAt(padding, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --padding-screen: ${({padding, theme}) => spacingAt(padding, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --padding-screen: ${({padding, theme}) => spacingAt(padding, 'screen:2xl', theme)};
  }
`;

const paddingTopStyles = css<ContainerLayoutProps>`
  padding-top: ${({paddingTop, theme}) => getSpacing(asPlain(paddingTop), undefined, theme)};
`;

const responsivePaddingTopStyles = css<ContainerLayoutProps>`
  --padding-top-container: initial;
  --padding-top-screen: initial;
  padding-top: var(
    --padding-top-screen,
    var(
      --padding-top-container,
      ${({paddingTop, theme}) => spacingAt(paddingTop, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, 'md', theme)};
  }
  @container (min-width: 640px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --padding-top-container: ${({paddingTop, theme}) => spacingAt(paddingTop, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --padding-top-screen: ${({paddingTop, theme}) => spacingAt(paddingTop, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --padding-top-screen: ${({paddingTop, theme}) => spacingAt(paddingTop, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --padding-top-screen: ${({paddingTop, theme}) => spacingAt(paddingTop, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --padding-top-screen: ${({paddingTop, theme}) => spacingAt(paddingTop, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --padding-top-screen: ${({paddingTop, theme}) => spacingAt(paddingTop, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --padding-top-screen: ${({paddingTop, theme}) => spacingAt(paddingTop, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --padding-top-screen: ${({paddingTop, theme}) => spacingAt(paddingTop, 'screen:2xl', theme)};
  }
`;

const paddingBottomStyles = css<ContainerLayoutProps>`
  padding-bottom: ${({paddingBottom, theme}) => getSpacing(asPlain(paddingBottom), undefined, theme)};
`;

const responsivePaddingBottomStyles = css<ContainerLayoutProps>`
  --padding-bottom-container: initial;
  --padding-bottom-screen: initial;
  padding-bottom: var(
    --padding-bottom-screen,
    var(
      --padding-bottom-container,
      ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'md', theme)};
  }
  @container (min-width: 640px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --padding-bottom-container: ${({paddingBottom, theme}) => spacingAt(paddingBottom, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --padding-bottom-screen: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --padding-bottom-screen: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --padding-bottom-screen: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --padding-bottom-screen: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --padding-bottom-screen: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --padding-bottom-screen: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --padding-bottom-screen: ${({paddingBottom, theme}) => spacingAt(paddingBottom, 'screen:2xl', theme)};
  }
`;

const paddingLeftStyles = css<ContainerLayoutProps>`
  padding-left: ${({paddingLeft, theme}) => getSpacing(asPlain(paddingLeft), undefined, theme)};
`;

const responsivePaddingLeftStyles = css<ContainerLayoutProps>`
  --padding-left-container: initial;
  --padding-left-screen: initial;
  padding-left: var(
    --padding-left-screen,
    var(
      --padding-left-container,
      ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'md', theme)};
  }
  @container (min-width: 640px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --padding-left-container: ${({paddingLeft, theme}) => spacingAt(paddingLeft, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --padding-left-screen: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --padding-left-screen: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --padding-left-screen: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --padding-left-screen: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --padding-left-screen: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --padding-left-screen: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --padding-left-screen: ${({paddingLeft, theme}) => spacingAt(paddingLeft, 'screen:2xl', theme)};
  }
`;

const paddingRightStyles = css<ContainerLayoutProps>`
  padding-right: ${({paddingRight, theme}) => getSpacing(asPlain(paddingRight), undefined, theme)};
`;

const responsivePaddingRightStyles = css<ContainerLayoutProps>`
  --padding-right-container: initial;
  --padding-right-screen: initial;
  padding-right: var(
    --padding-right-screen,
    var(
      --padding-right-container,
      ${({paddingRight, theme}) => spacingAt(paddingRight, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, 'md', theme)};
  }
  @container (min-width: 640px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --padding-right-container: ${({paddingRight, theme}) => spacingAt(paddingRight, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --padding-right-screen: ${({paddingRight, theme}) => spacingAt(paddingRight, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --padding-right-screen: ${({paddingRight, theme}) => spacingAt(paddingRight, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --padding-right-screen: ${({paddingRight, theme}) => spacingAt(paddingRight, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --padding-right-screen: ${({paddingRight, theme}) => spacingAt(paddingRight, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --padding-right-screen: ${({paddingRight, theme}) => spacingAt(paddingRight, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --padding-right-screen: ${({paddingRight, theme}) => spacingAt(paddingRight, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --padding-right-screen: ${({paddingRight, theme}) => spacingAt(paddingRight, 'screen:2xl', theme)};
  }
`;

const marginStyles = css<ContainerLayoutProps>`
  margin: ${({margin, theme}) => getMargin(asPlain(margin), undefined, theme)};
`;

const responsiveMarginStyles = css<ContainerLayoutProps>`
  --margin-container: initial;
  --margin-screen: initial;
  margin: var(
    --margin-screen,
    var(--margin-container, ${({margin, theme}) => marginAt(margin, 'zero', theme)})
  );
  @container (min-width: 320px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, 'md', theme)};
  }
  @container (min-width: 640px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --margin-container: ${({margin, theme}) => marginAt(margin, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --margin-screen: ${({margin, theme}) => marginAt(margin, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --margin-screen: ${({margin, theme}) => marginAt(margin, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --margin-screen: ${({margin, theme}) => marginAt(margin, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --margin-screen: ${({margin, theme}) => marginAt(margin, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --margin-screen: ${({margin, theme}) => marginAt(margin, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --margin-screen: ${({margin, theme}) => marginAt(margin, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --margin-screen: ${({margin, theme}) => marginAt(margin, 'screen:2xl', theme)};
  }
`;

const marginTopStyles = css<ContainerLayoutProps>`
  margin-top: ${({marginTop, theme}) => getMargin(asPlain(marginTop), undefined, theme)};
`;

const responsiveMarginTopStyles = css<ContainerLayoutProps>`
  --margin-top-container: initial;
  --margin-top-screen: initial;
  margin-top: var(
    --margin-top-screen,
    var(
      --margin-top-container,
      ${({marginTop, theme}) => marginAt(marginTop, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, 'md', theme)};
  }
  @container (min-width: 640px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --margin-top-container: ${({marginTop, theme}) => marginAt(marginTop, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --margin-top-screen: ${({marginTop, theme}) => marginAt(marginTop, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --margin-top-screen: ${({marginTop, theme}) => marginAt(marginTop, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --margin-top-screen: ${({marginTop, theme}) => marginAt(marginTop, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --margin-top-screen: ${({marginTop, theme}) => marginAt(marginTop, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --margin-top-screen: ${({marginTop, theme}) => marginAt(marginTop, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --margin-top-screen: ${({marginTop, theme}) => marginAt(marginTop, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --margin-top-screen: ${({marginTop, theme}) => marginAt(marginTop, 'screen:2xl', theme)};
  }
`;

const marginBottomStyles = css<ContainerLayoutProps>`
  margin-bottom: ${({marginBottom, theme}) => getMargin(asPlain(marginBottom), undefined, theme)};
`;

const responsiveMarginBottomStyles = css<ContainerLayoutProps>`
  --margin-bottom-container: initial;
  --margin-bottom-screen: initial;
  margin-bottom: var(
    --margin-bottom-screen,
    var(
      --margin-bottom-container,
      ${({marginBottom, theme}) => marginAt(marginBottom, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, 'md', theme)};
  }
  @container (min-width: 640px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --margin-bottom-container: ${({marginBottom, theme}) => marginAt(marginBottom, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --margin-bottom-screen: ${({marginBottom, theme}) => marginAt(marginBottom, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --margin-bottom-screen: ${({marginBottom, theme}) => marginAt(marginBottom, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --margin-bottom-screen: ${({marginBottom, theme}) => marginAt(marginBottom, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --margin-bottom-screen: ${({marginBottom, theme}) => marginAt(marginBottom, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --margin-bottom-screen: ${({marginBottom, theme}) => marginAt(marginBottom, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --margin-bottom-screen: ${({marginBottom, theme}) => marginAt(marginBottom, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --margin-bottom-screen: ${({marginBottom, theme}) => marginAt(marginBottom, 'screen:2xl', theme)};
  }
`;

const marginLeftStyles = css<ContainerLayoutProps>`
  margin-left: ${({marginLeft, theme}) => getMargin(asPlain(marginLeft), undefined, theme)};
`;

const responsiveMarginLeftStyles = css<ContainerLayoutProps>`
  --margin-left-container: initial;
  --margin-left-screen: initial;
  margin-left: var(
    --margin-left-screen,
    var(
      --margin-left-container,
      ${({marginLeft, theme}) => marginAt(marginLeft, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, 'md', theme)};
  }
  @container (min-width: 640px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --margin-left-container: ${({marginLeft, theme}) => marginAt(marginLeft, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --margin-left-screen: ${({marginLeft, theme}) => marginAt(marginLeft, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --margin-left-screen: ${({marginLeft, theme}) => marginAt(marginLeft, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --margin-left-screen: ${({marginLeft, theme}) => marginAt(marginLeft, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --margin-left-screen: ${({marginLeft, theme}) => marginAt(marginLeft, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --margin-left-screen: ${({marginLeft, theme}) => marginAt(marginLeft, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --margin-left-screen: ${({marginLeft, theme}) => marginAt(marginLeft, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --margin-left-screen: ${({marginLeft, theme}) => marginAt(marginLeft, 'screen:2xl', theme)};
  }
`;

const marginRightStyles = css<ContainerLayoutProps>`
  margin-right: ${({marginRight, theme}) => getMargin(asPlain(marginRight), undefined, theme)};
`;

const responsiveMarginRightStyles = css<ContainerLayoutProps>`
  --margin-right-container: initial;
  --margin-right-screen: initial;
  margin-right: var(
    --margin-right-screen,
    var(
      --margin-right-container,
      ${({marginRight, theme}) => marginAt(marginRight, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, 'md', theme)};
  }
  @container (min-width: 640px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --margin-right-container: ${({marginRight, theme}) => marginAt(marginRight, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --margin-right-screen: ${({marginRight, theme}) => marginAt(marginRight, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --margin-right-screen: ${({marginRight, theme}) => marginAt(marginRight, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --margin-right-screen: ${({marginRight, theme}) => marginAt(marginRight, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --margin-right-screen: ${({marginRight, theme}) => marginAt(marginRight, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --margin-right-screen: ${({marginRight, theme}) => marginAt(marginRight, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --margin-right-screen: ${({marginRight, theme}) => marginAt(marginRight, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --margin-right-screen: ${({marginRight, theme}) => marginAt(marginRight, 'screen:2xl', theme)};
  }
`;

const backgroundStyles = css<ContainerLayoutProps>`
  background: ${({background, theme}) => getBackground(asPlain(background), theme)};
`;

const responsiveBackgroundStyles = css<ContainerLayoutProps>`
  --background-container: initial;
  --background-screen: initial;
  background: var(
    --background-screen,
    var(
      --background-container,
      ${({background, theme}) => backgroundAt(background, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --background-container: ${({background, theme}) => backgroundAt(background, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --background-container: ${({background, theme}) => backgroundAt(background, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --background-container: ${({background, theme}) => backgroundAt(background, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --background-container: ${({background, theme}) => backgroundAt(background, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --background-container: ${({background, theme}) => backgroundAt(background, 'md', theme)};
  }
  @container (min-width: 640px) {
    --background-container: ${({background, theme}) => backgroundAt(background, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --background-container: ${({background, theme}) => backgroundAt(background, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --background-container: ${({background, theme}) => backgroundAt(background, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --background-container: ${({background, theme}) => backgroundAt(background, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --background-container: ${({background, theme}) => backgroundAt(background, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --background-container: ${({background, theme}) => backgroundAt(background, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --background-screen: ${({background, theme}) => backgroundAt(background, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --background-screen: ${({background, theme}) => backgroundAt(background, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --background-screen: ${({background, theme}) => backgroundAt(background, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --background-screen: ${({background, theme}) => backgroundAt(background, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --background-screen: ${({background, theme}) => backgroundAt(background, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --background-screen: ${({background, theme}) => backgroundAt(background, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --background-screen: ${({background, theme}) => backgroundAt(background, 'screen:2xl', theme)};
  }
`;

const radiusStyles = css<ContainerLayoutProps>`
  border-radius: ${({radius, theme}) => getRadius(asPlain(radius), undefined, theme)};
`;

const responsiveRadiusStyles = css<ContainerLayoutProps>`
  --radius-container: initial;
  --radius-screen: initial;
  border-radius: var(
    --radius-screen,
    var(--radius-container, ${({radius, theme}) => radiusAt(radius, 'zero', theme)})
  );
  @container (min-width: 320px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, 'md', theme)};
  }
  @container (min-width: 640px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --radius-container: ${({radius, theme}) => radiusAt(radius, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --radius-screen: ${({radius, theme}) => radiusAt(radius, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --radius-screen: ${({radius, theme}) => radiusAt(radius, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --radius-screen: ${({radius, theme}) => radiusAt(radius, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --radius-screen: ${({radius, theme}) => radiusAt(radius, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --radius-screen: ${({radius, theme}) => radiusAt(radius, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --radius-screen: ${({radius, theme}) => radiusAt(radius, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --radius-screen: ${({radius, theme}) => radiusAt(radius, 'screen:2xl', theme)};
  }
`;

const widthStyles = css<ContainerLayoutProps>`
  width: ${({width}) => asPlain(width)};
`;

const responsiveWidthStyles = css<ContainerLayoutProps>`
  --width-container: initial;
  --width-screen: initial;
  width: var(
    --width-screen,
    var(--width-container, ${({width}) => valueAt(width, 'zero')})
  );
  @container (min-width: 320px) {
    --width-container: ${({width}) => valueAt(width, '3xs')};
  }
  @container (min-width: 384px) {
    --width-container: ${({width}) => valueAt(width, '2xs')};
  }
  @container (min-width: 448px) {
    --width-container: ${({width}) => valueAt(width, 'xs')};
  }
  @container (min-width: 512px) {
    --width-container: ${({width}) => valueAt(width, 'sm')};
  }
  @container (min-width: 576px) {
    --width-container: ${({width}) => valueAt(width, 'md')};
  }
  @container (min-width: 640px) {
    --width-container: ${({width}) => valueAt(width, 'lg')};
  }
  @container (min-width: 768px) {
    --width-container: ${({width}) => valueAt(width, 'xl')};
  }
  @container (min-width: 896px) {
    --width-container: ${({width}) => valueAt(width, '2xl')};
  }
  @container (min-width: 1024px) {
    --width-container: ${({width}) => valueAt(width, '3xl')};
  }
  @container (min-width: 1152px) {
    --width-container: ${({width}) => valueAt(width, '4xl')};
  }
  @container (min-width: 1280px) {
    --width-container: ${({width}) => valueAt(width, '5xl')};
  }
  @media (min-width: 0px) {
    --width-screen: ${({width}) => valueAt(width, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --width-screen: ${({width}) => valueAt(width, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --width-screen: ${({width}) => valueAt(width, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --width-screen: ${({width}) => valueAt(width, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --width-screen: ${({width}) => valueAt(width, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --width-screen: ${({width}) => valueAt(width, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --width-screen: ${({width}) => valueAt(width, 'screen:2xl')};
  }
`;

const minWidthStyles = css<ContainerLayoutProps>`
  min-width: ${({minWidth}) => asPlain(minWidth)};
`;

const responsiveMinWidthStyles = css<ContainerLayoutProps>`
  --min-width-container: initial;
  --min-width-screen: initial;
  min-width: var(
    --min-width-screen,
    var(--min-width-container, ${({minWidth}) => valueAt(minWidth, 'zero')})
  );
  @container (min-width: 320px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, '3xs')};
  }
  @container (min-width: 384px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, '2xs')};
  }
  @container (min-width: 448px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, 'xs')};
  }
  @container (min-width: 512px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, 'sm')};
  }
  @container (min-width: 576px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, 'md')};
  }
  @container (min-width: 640px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, 'lg')};
  }
  @container (min-width: 768px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, 'xl')};
  }
  @container (min-width: 896px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, '2xl')};
  }
  @container (min-width: 1024px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, '3xl')};
  }
  @container (min-width: 1152px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, '4xl')};
  }
  @container (min-width: 1280px) {
    --min-width-container: ${({minWidth}) => valueAt(minWidth, '5xl')};
  }
  @media (min-width: 0px) {
    --min-width-screen: ${({minWidth}) => valueAt(minWidth, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --min-width-screen: ${({minWidth}) => valueAt(minWidth, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --min-width-screen: ${({minWidth}) => valueAt(minWidth, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --min-width-screen: ${({minWidth}) => valueAt(minWidth, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --min-width-screen: ${({minWidth}) => valueAt(minWidth, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --min-width-screen: ${({minWidth}) => valueAt(minWidth, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --min-width-screen: ${({minWidth}) => valueAt(minWidth, 'screen:2xl')};
  }
`;

const maxWidthStyles = css<ContainerLayoutProps>`
  max-width: ${({maxWidth}) => asPlain(maxWidth)};
`;

const responsiveMaxWidthStyles = css<ContainerLayoutProps>`
  --max-width-container: initial;
  --max-width-screen: initial;
  max-width: var(
    --max-width-screen,
    var(--max-width-container, ${({maxWidth}) => valueAt(maxWidth, 'zero')})
  );
  @container (min-width: 320px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, '3xs')};
  }
  @container (min-width: 384px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, '2xs')};
  }
  @container (min-width: 448px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, 'xs')};
  }
  @container (min-width: 512px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, 'sm')};
  }
  @container (min-width: 576px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, 'md')};
  }
  @container (min-width: 640px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, 'lg')};
  }
  @container (min-width: 768px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, 'xl')};
  }
  @container (min-width: 896px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, '2xl')};
  }
  @container (min-width: 1024px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, '3xl')};
  }
  @container (min-width: 1152px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, '4xl')};
  }
  @container (min-width: 1280px) {
    --max-width-container: ${({maxWidth}) => valueAt(maxWidth, '5xl')};
  }
  @media (min-width: 0px) {
    --max-width-screen: ${({maxWidth}) => valueAt(maxWidth, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --max-width-screen: ${({maxWidth}) => valueAt(maxWidth, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --max-width-screen: ${({maxWidth}) => valueAt(maxWidth, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --max-width-screen: ${({maxWidth}) => valueAt(maxWidth, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --max-width-screen: ${({maxWidth}) => valueAt(maxWidth, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --max-width-screen: ${({maxWidth}) => valueAt(maxWidth, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --max-width-screen: ${({maxWidth}) => valueAt(maxWidth, 'screen:2xl')};
  }
`;

const heightStyles = css<ContainerLayoutProps>`
  height: ${({height}) => asPlain(height)};
`;

const responsiveHeightStyles = css<ContainerLayoutProps>`
  --height-container: initial;
  --height-screen: initial;
  height: var(
    --height-screen,
    var(--height-container, ${({height}) => valueAt(height, 'zero')})
  );
  @container (min-width: 320px) {
    --height-container: ${({height}) => valueAt(height, '3xs')};
  }
  @container (min-width: 384px) {
    --height-container: ${({height}) => valueAt(height, '2xs')};
  }
  @container (min-width: 448px) {
    --height-container: ${({height}) => valueAt(height, 'xs')};
  }
  @container (min-width: 512px) {
    --height-container: ${({height}) => valueAt(height, 'sm')};
  }
  @container (min-width: 576px) {
    --height-container: ${({height}) => valueAt(height, 'md')};
  }
  @container (min-width: 640px) {
    --height-container: ${({height}) => valueAt(height, 'lg')};
  }
  @container (min-width: 768px) {
    --height-container: ${({height}) => valueAt(height, 'xl')};
  }
  @container (min-width: 896px) {
    --height-container: ${({height}) => valueAt(height, '2xl')};
  }
  @container (min-width: 1024px) {
    --height-container: ${({height}) => valueAt(height, '3xl')};
  }
  @container (min-width: 1152px) {
    --height-container: ${({height}) => valueAt(height, '4xl')};
  }
  @container (min-width: 1280px) {
    --height-container: ${({height}) => valueAt(height, '5xl')};
  }
  @media (min-width: 0px) {
    --height-screen: ${({height}) => valueAt(height, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --height-screen: ${({height}) => valueAt(height, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --height-screen: ${({height}) => valueAt(height, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --height-screen: ${({height}) => valueAt(height, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --height-screen: ${({height}) => valueAt(height, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --height-screen: ${({height}) => valueAt(height, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --height-screen: ${({height}) => valueAt(height, 'screen:2xl')};
  }
`;

const minHeightStyles = css<ContainerLayoutProps>`
  min-height: ${({minHeight}) => asPlain(minHeight)};
`;

const responsiveMinHeightStyles = css<ContainerLayoutProps>`
  --min-height-container: initial;
  --min-height-screen: initial;
  min-height: var(
    --min-height-screen,
    var(--min-height-container, ${({minHeight}) => valueAt(minHeight, 'zero')})
  );
  @container (min-width: 320px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, '3xs')};
  }
  @container (min-width: 384px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, '2xs')};
  }
  @container (min-width: 448px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, 'xs')};
  }
  @container (min-width: 512px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, 'sm')};
  }
  @container (min-width: 576px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, 'md')};
  }
  @container (min-width: 640px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, 'lg')};
  }
  @container (min-width: 768px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, 'xl')};
  }
  @container (min-width: 896px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, '2xl')};
  }
  @container (min-width: 1024px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, '3xl')};
  }
  @container (min-width: 1152px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, '4xl')};
  }
  @container (min-width: 1280px) {
    --min-height-container: ${({minHeight}) => valueAt(minHeight, '5xl')};
  }
  @media (min-width: 0px) {
    --min-height-screen: ${({minHeight}) => valueAt(minHeight, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --min-height-screen: ${({minHeight}) => valueAt(minHeight, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --min-height-screen: ${({minHeight}) => valueAt(minHeight, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --min-height-screen: ${({minHeight}) => valueAt(minHeight, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --min-height-screen: ${({minHeight}) => valueAt(minHeight, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --min-height-screen: ${({minHeight}) => valueAt(minHeight, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --min-height-screen: ${({minHeight}) => valueAt(minHeight, 'screen:2xl')};
  }
`;

const maxHeightStyles = css<ContainerLayoutProps>`
  max-height: ${({maxHeight}) => asPlain(maxHeight)};
`;

const responsiveMaxHeightStyles = css<ContainerLayoutProps>`
  --max-height-container: initial;
  --max-height-screen: initial;
  max-height: var(
    --max-height-screen,
    var(--max-height-container, ${({maxHeight}) => valueAt(maxHeight, 'zero')})
  );
  @container (min-width: 320px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, '3xs')};
  }
  @container (min-width: 384px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, '2xs')};
  }
  @container (min-width: 448px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, 'xs')};
  }
  @container (min-width: 512px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, 'sm')};
  }
  @container (min-width: 576px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, 'md')};
  }
  @container (min-width: 640px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, 'lg')};
  }
  @container (min-width: 768px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, 'xl')};
  }
  @container (min-width: 896px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, '2xl')};
  }
  @container (min-width: 1024px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, '3xl')};
  }
  @container (min-width: 1152px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, '4xl')};
  }
  @container (min-width: 1280px) {
    --max-height-container: ${({maxHeight}) => valueAt(maxHeight, '5xl')};
  }
  @media (min-width: 0px) {
    --max-height-screen: ${({maxHeight}) => valueAt(maxHeight, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --max-height-screen: ${({maxHeight}) => valueAt(maxHeight, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --max-height-screen: ${({maxHeight}) => valueAt(maxHeight, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --max-height-screen: ${({maxHeight}) => valueAt(maxHeight, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --max-height-screen: ${({maxHeight}) => valueAt(maxHeight, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --max-height-screen: ${({maxHeight}) => valueAt(maxHeight, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --max-height-screen: ${({maxHeight}) => valueAt(maxHeight, 'screen:2xl')};
  }
`;

const areaStyles = css<ContainerLayoutProps>`
  grid-area: ${({area}) => asPlain(area)};
`;

const responsiveAreaStyles = css<ContainerLayoutProps>`
  --area-container: initial;
  --area-screen: initial;
  grid-area: var(
    --area-screen,
    var(--area-container, ${({area}) => valueAt(area, 'zero')})
  );
  @container (min-width: 320px) {
    --area-container: ${({area}) => valueAt(area, '3xs')};
  }
  @container (min-width: 384px) {
    --area-container: ${({area}) => valueAt(area, '2xs')};
  }
  @container (min-width: 448px) {
    --area-container: ${({area}) => valueAt(area, 'xs')};
  }
  @container (min-width: 512px) {
    --area-container: ${({area}) => valueAt(area, 'sm')};
  }
  @container (min-width: 576px) {
    --area-container: ${({area}) => valueAt(area, 'md')};
  }
  @container (min-width: 640px) {
    --area-container: ${({area}) => valueAt(area, 'lg')};
  }
  @container (min-width: 768px) {
    --area-container: ${({area}) => valueAt(area, 'xl')};
  }
  @container (min-width: 896px) {
    --area-container: ${({area}) => valueAt(area, '2xl')};
  }
  @container (min-width: 1024px) {
    --area-container: ${({area}) => valueAt(area, '3xl')};
  }
  @container (min-width: 1152px) {
    --area-container: ${({area}) => valueAt(area, '4xl')};
  }
  @container (min-width: 1280px) {
    --area-container: ${({area}) => valueAt(area, '5xl')};
  }
  @media (min-width: 0px) {
    --area-screen: ${({area}) => valueAt(area, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --area-screen: ${({area}) => valueAt(area, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --area-screen: ${({area}) => valueAt(area, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --area-screen: ${({area}) => valueAt(area, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --area-screen: ${({area}) => valueAt(area, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --area-screen: ${({area}) => valueAt(area, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --area-screen: ${({area}) => valueAt(area, 'screen:2xl')};
  }
`;

const rowStyles = css<ContainerLayoutProps>`
  grid-row: ${({row}) => asPlain(row)};
`;

const responsiveRowStyles = css<ContainerLayoutProps>`
  --row-container: initial;
  --row-screen: initial;
  grid-row: var(--row-screen, var(--row-container, ${({row}) => valueAt(row, 'zero')}));
  @container (min-width: 320px) {
    --row-container: ${({row}) => valueAt(row, '3xs')};
  }
  @container (min-width: 384px) {
    --row-container: ${({row}) => valueAt(row, '2xs')};
  }
  @container (min-width: 448px) {
    --row-container: ${({row}) => valueAt(row, 'xs')};
  }
  @container (min-width: 512px) {
    --row-container: ${({row}) => valueAt(row, 'sm')};
  }
  @container (min-width: 576px) {
    --row-container: ${({row}) => valueAt(row, 'md')};
  }
  @container (min-width: 640px) {
    --row-container: ${({row}) => valueAt(row, 'lg')};
  }
  @container (min-width: 768px) {
    --row-container: ${({row}) => valueAt(row, 'xl')};
  }
  @container (min-width: 896px) {
    --row-container: ${({row}) => valueAt(row, '2xl')};
  }
  @container (min-width: 1024px) {
    --row-container: ${({row}) => valueAt(row, '3xl')};
  }
  @container (min-width: 1152px) {
    --row-container: ${({row}) => valueAt(row, '4xl')};
  }
  @container (min-width: 1280px) {
    --row-container: ${({row}) => valueAt(row, '5xl')};
  }
  @media (min-width: 0px) {
    --row-screen: ${({row}) => valueAt(row, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --row-screen: ${({row}) => valueAt(row, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --row-screen: ${({row}) => valueAt(row, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --row-screen: ${({row}) => valueAt(row, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --row-screen: ${({row}) => valueAt(row, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --row-screen: ${({row}) => valueAt(row, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --row-screen: ${({row}) => valueAt(row, 'screen:2xl')};
  }
`;

const columnStyles = css<ContainerLayoutProps>`
  grid-column: ${({column}) => asPlain(column)};
`;

const responsiveColumnStyles = css<ContainerLayoutProps>`
  --column-container: initial;
  --column-screen: initial;
  grid-column: var(
    --column-screen,
    var(--column-container, ${({column}) => valueAt(column, 'zero')})
  );
  @container (min-width: 320px) {
    --column-container: ${({column}) => valueAt(column, '3xs')};
  }
  @container (min-width: 384px) {
    --column-container: ${({column}) => valueAt(column, '2xs')};
  }
  @container (min-width: 448px) {
    --column-container: ${({column}) => valueAt(column, 'xs')};
  }
  @container (min-width: 512px) {
    --column-container: ${({column}) => valueAt(column, 'sm')};
  }
  @container (min-width: 576px) {
    --column-container: ${({column}) => valueAt(column, 'md')};
  }
  @container (min-width: 640px) {
    --column-container: ${({column}) => valueAt(column, 'lg')};
  }
  @container (min-width: 768px) {
    --column-container: ${({column}) => valueAt(column, 'xl')};
  }
  @container (min-width: 896px) {
    --column-container: ${({column}) => valueAt(column, '2xl')};
  }
  @container (min-width: 1024px) {
    --column-container: ${({column}) => valueAt(column, '3xl')};
  }
  @container (min-width: 1152px) {
    --column-container: ${({column}) => valueAt(column, '4xl')};
  }
  @container (min-width: 1280px) {
    --column-container: ${({column}) => valueAt(column, '5xl')};
  }
  @media (min-width: 0px) {
    --column-screen: ${({column}) => valueAt(column, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --column-screen: ${({column}) => valueAt(column, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --column-screen: ${({column}) => valueAt(column, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --column-screen: ${({column}) => valueAt(column, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --column-screen: ${({column}) => valueAt(column, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --column-screen: ${({column}) => valueAt(column, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --column-screen: ${({column}) => valueAt(column, 'screen:2xl')};
  }
`;

const orderStyles = css<ContainerLayoutProps>`
  order: ${({order}) => asPlain(order)};
`;

const responsiveOrderStyles = css<ContainerLayoutProps>`
  --order-container: initial;
  --order-screen: initial;
  order: var(
    --order-screen,
    var(--order-container, ${({order}) => valueAt(order, 'zero')})
  );
  @container (min-width: 320px) {
    --order-container: ${({order}) => valueAt(order, '3xs')};
  }
  @container (min-width: 384px) {
    --order-container: ${({order}) => valueAt(order, '2xs')};
  }
  @container (min-width: 448px) {
    --order-container: ${({order}) => valueAt(order, 'xs')};
  }
  @container (min-width: 512px) {
    --order-container: ${({order}) => valueAt(order, 'sm')};
  }
  @container (min-width: 576px) {
    --order-container: ${({order}) => valueAt(order, 'md')};
  }
  @container (min-width: 640px) {
    --order-container: ${({order}) => valueAt(order, 'lg')};
  }
  @container (min-width: 768px) {
    --order-container: ${({order}) => valueAt(order, 'xl')};
  }
  @container (min-width: 896px) {
    --order-container: ${({order}) => valueAt(order, '2xl')};
  }
  @container (min-width: 1024px) {
    --order-container: ${({order}) => valueAt(order, '3xl')};
  }
  @container (min-width: 1152px) {
    --order-container: ${({order}) => valueAt(order, '4xl')};
  }
  @container (min-width: 1280px) {
    --order-container: ${({order}) => valueAt(order, '5xl')};
  }
  @media (min-width: 0px) {
    --order-screen: ${({order}) => valueAt(order, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --order-screen: ${({order}) => valueAt(order, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --order-screen: ${({order}) => valueAt(order, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --order-screen: ${({order}) => valueAt(order, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --order-screen: ${({order}) => valueAt(order, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --order-screen: ${({order}) => valueAt(order, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --order-screen: ${({order}) => valueAt(order, 'screen:2xl')};
  }
`;

const flexStyles = css<ContainerLayoutProps>`
  flex: ${({flex}) => asPlain(flex)};
`;

const responsiveFlexStyles = css<ContainerLayoutProps>`
  --flex-container: initial;
  --flex-screen: initial;
  flex: var(--flex-screen, var(--flex-container, ${({flex}) => valueAt(flex, 'zero')}));
  @container (min-width: 320px) {
    --flex-container: ${({flex}) => valueAt(flex, '3xs')};
  }
  @container (min-width: 384px) {
    --flex-container: ${({flex}) => valueAt(flex, '2xs')};
  }
  @container (min-width: 448px) {
    --flex-container: ${({flex}) => valueAt(flex, 'xs')};
  }
  @container (min-width: 512px) {
    --flex-container: ${({flex}) => valueAt(flex, 'sm')};
  }
  @container (min-width: 576px) {
    --flex-container: ${({flex}) => valueAt(flex, 'md')};
  }
  @container (min-width: 640px) {
    --flex-container: ${({flex}) => valueAt(flex, 'lg')};
  }
  @container (min-width: 768px) {
    --flex-container: ${({flex}) => valueAt(flex, 'xl')};
  }
  @container (min-width: 896px) {
    --flex-container: ${({flex}) => valueAt(flex, '2xl')};
  }
  @container (min-width: 1024px) {
    --flex-container: ${({flex}) => valueAt(flex, '3xl')};
  }
  @container (min-width: 1152px) {
    --flex-container: ${({flex}) => valueAt(flex, '4xl')};
  }
  @container (min-width: 1280px) {
    --flex-container: ${({flex}) => valueAt(flex, '5xl')};
  }
  @media (min-width: 0px) {
    --flex-screen: ${({flex}) => valueAt(flex, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --flex-screen: ${({flex}) => valueAt(flex, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --flex-screen: ${({flex}) => valueAt(flex, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --flex-screen: ${({flex}) => valueAt(flex, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --flex-screen: ${({flex}) => valueAt(flex, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --flex-screen: ${({flex}) => valueAt(flex, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --flex-screen: ${({flex}) => valueAt(flex, 'screen:2xl')};
  }
`;

const flexGrowStyles = css<ContainerLayoutProps>`
  flex-grow: ${({flexGrow}) => asPlain(flexGrow)};
`;

const responsiveFlexGrowStyles = css<ContainerLayoutProps>`
  --flex-grow-container: initial;
  --flex-grow-screen: initial;
  flex-grow: var(
    --flex-grow-screen,
    var(--flex-grow-container, ${({flexGrow}) => valueAt(flexGrow, 'zero')})
  );
  @container (min-width: 320px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, '3xs')};
  }
  @container (min-width: 384px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, '2xs')};
  }
  @container (min-width: 448px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, 'xs')};
  }
  @container (min-width: 512px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, 'sm')};
  }
  @container (min-width: 576px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, 'md')};
  }
  @container (min-width: 640px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, 'lg')};
  }
  @container (min-width: 768px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, 'xl')};
  }
  @container (min-width: 896px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, '2xl')};
  }
  @container (min-width: 1024px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, '3xl')};
  }
  @container (min-width: 1152px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, '4xl')};
  }
  @container (min-width: 1280px) {
    --flex-grow-container: ${({flexGrow}) => valueAt(flexGrow, '5xl')};
  }
  @media (min-width: 0px) {
    --flex-grow-screen: ${({flexGrow}) => valueAt(flexGrow, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --flex-grow-screen: ${({flexGrow}) => valueAt(flexGrow, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --flex-grow-screen: ${({flexGrow}) => valueAt(flexGrow, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --flex-grow-screen: ${({flexGrow}) => valueAt(flexGrow, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --flex-grow-screen: ${({flexGrow}) => valueAt(flexGrow, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --flex-grow-screen: ${({flexGrow}) => valueAt(flexGrow, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --flex-grow-screen: ${({flexGrow}) => valueAt(flexGrow, 'screen:2xl')};
  }
`;

const flexShrinkStyles = css<ContainerLayoutProps>`
  flex-shrink: ${({flexShrink}) => asPlain(flexShrink)};
`;

const responsiveFlexShrinkStyles = css<ContainerLayoutProps>`
  --flex-shrink-container: initial;
  --flex-shrink-screen: initial;
  flex-shrink: var(
    --flex-shrink-screen,
    var(--flex-shrink-container, ${({flexShrink}) => valueAt(flexShrink, 'zero')})
  );
  @container (min-width: 320px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, '3xs')};
  }
  @container (min-width: 384px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, '2xs')};
  }
  @container (min-width: 448px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, 'xs')};
  }
  @container (min-width: 512px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, 'sm')};
  }
  @container (min-width: 576px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, 'md')};
  }
  @container (min-width: 640px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, 'lg')};
  }
  @container (min-width: 768px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, 'xl')};
  }
  @container (min-width: 896px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, '2xl')};
  }
  @container (min-width: 1024px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, '3xl')};
  }
  @container (min-width: 1152px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, '4xl')};
  }
  @container (min-width: 1280px) {
    --flex-shrink-container: ${({flexShrink}) => valueAt(flexShrink, '5xl')};
  }
  @media (min-width: 0px) {
    --flex-shrink-screen: ${({flexShrink}) => valueAt(flexShrink, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --flex-shrink-screen: ${({flexShrink}) => valueAt(flexShrink, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --flex-shrink-screen: ${({flexShrink}) => valueAt(flexShrink, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --flex-shrink-screen: ${({flexShrink}) => valueAt(flexShrink, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --flex-shrink-screen: ${({flexShrink}) => valueAt(flexShrink, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --flex-shrink-screen: ${({flexShrink}) => valueAt(flexShrink, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --flex-shrink-screen: ${({flexShrink}) => valueAt(flexShrink, 'screen:2xl')};
  }
`;

const flexBasisStyles = css<ContainerLayoutProps>`
  flex-basis: ${({flexBasis}) => asPlain(flexBasis)};
`;

const responsiveFlexBasisStyles = css<ContainerLayoutProps>`
  --flex-basis-container: initial;
  --flex-basis-screen: initial;
  flex-basis: var(
    --flex-basis-screen,
    var(--flex-basis-container, ${({flexBasis}) => valueAt(flexBasis, 'zero')})
  );
  @container (min-width: 320px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, '3xs')};
  }
  @container (min-width: 384px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, '2xs')};
  }
  @container (min-width: 448px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, 'xs')};
  }
  @container (min-width: 512px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, 'sm')};
  }
  @container (min-width: 576px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, 'md')};
  }
  @container (min-width: 640px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, 'lg')};
  }
  @container (min-width: 768px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, 'xl')};
  }
  @container (min-width: 896px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, '2xl')};
  }
  @container (min-width: 1024px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, '3xl')};
  }
  @container (min-width: 1152px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, '4xl')};
  }
  @container (min-width: 1280px) {
    --flex-basis-container: ${({flexBasis}) => valueAt(flexBasis, '5xl')};
  }
  @media (min-width: 0px) {
    --flex-basis-screen: ${({flexBasis}) => valueAt(flexBasis, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --flex-basis-screen: ${({flexBasis}) => valueAt(flexBasis, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --flex-basis-screen: ${({flexBasis}) => valueAt(flexBasis, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --flex-basis-screen: ${({flexBasis}) => valueAt(flexBasis, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --flex-basis-screen: ${({flexBasis}) => valueAt(flexBasis, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --flex-basis-screen: ${({flexBasis}) => valueAt(flexBasis, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --flex-basis-screen: ${({flexBasis}) => valueAt(flexBasis, 'screen:2xl')};
  }
`;

const alignSelfStyles = css<ContainerLayoutProps>`
  align-self: ${({alignSelf}) => asPlain(alignSelf)};
`;

const responsiveAlignSelfStyles = css<ContainerLayoutProps>`
  --align-self-container: initial;
  --align-self-screen: initial;
  align-self: var(
    --align-self-screen,
    var(--align-self-container, ${({alignSelf}) => valueAt(alignSelf, 'zero')})
  );
  @container (min-width: 320px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, '3xs')};
  }
  @container (min-width: 384px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, '2xs')};
  }
  @container (min-width: 448px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, 'xs')};
  }
  @container (min-width: 512px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, 'sm')};
  }
  @container (min-width: 576px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, 'md')};
  }
  @container (min-width: 640px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, 'lg')};
  }
  @container (min-width: 768px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, 'xl')};
  }
  @container (min-width: 896px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, '2xl')};
  }
  @container (min-width: 1024px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, '3xl')};
  }
  @container (min-width: 1152px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, '4xl')};
  }
  @container (min-width: 1280px) {
    --align-self-container: ${({alignSelf}) => valueAt(alignSelf, '5xl')};
  }
  @media (min-width: 0px) {
    --align-self-screen: ${({alignSelf}) => valueAt(alignSelf, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --align-self-screen: ${({alignSelf}) => valueAt(alignSelf, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --align-self-screen: ${({alignSelf}) => valueAt(alignSelf, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --align-self-screen: ${({alignSelf}) => valueAt(alignSelf, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --align-self-screen: ${({alignSelf}) => valueAt(alignSelf, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --align-self-screen: ${({alignSelf}) => valueAt(alignSelf, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --align-self-screen: ${({alignSelf}) => valueAt(alignSelf, 'screen:2xl')};
  }
`;

const justifySelfStyles = css<ContainerLayoutProps>`
  justify-self: ${({justifySelf}) => asPlain(justifySelf)};
`;

const responsiveJustifySelfStyles = css<ContainerLayoutProps>`
  --justify-self-container: initial;
  --justify-self-screen: initial;
  justify-self: var(
    --justify-self-screen,
    var(--justify-self-container, ${({justifySelf}) => valueAt(justifySelf, 'zero')})
  );
  @container (min-width: 320px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, '3xs')};
  }
  @container (min-width: 384px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, '2xs')};
  }
  @container (min-width: 448px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, 'xs')};
  }
  @container (min-width: 512px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, 'sm')};
  }
  @container (min-width: 576px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, 'md')};
  }
  @container (min-width: 640px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, 'lg')};
  }
  @container (min-width: 768px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, 'xl')};
  }
  @container (min-width: 896px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, '2xl')};
  }
  @container (min-width: 1024px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, '3xl')};
  }
  @container (min-width: 1152px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, '4xl')};
  }
  @container (min-width: 1280px) {
    --justify-self-container: ${({justifySelf}) => valueAt(justifySelf, '5xl')};
  }
  @media (min-width: 0px) {
    --justify-self-screen: ${({justifySelf}) => valueAt(justifySelf, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --justify-self-screen: ${({justifySelf}) => valueAt(justifySelf, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --justify-self-screen: ${({justifySelf}) => valueAt(justifySelf, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --justify-self-screen: ${({justifySelf}) => valueAt(justifySelf, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --justify-self-screen: ${({justifySelf}) => valueAt(justifySelf, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --justify-self-screen: ${({justifySelf}) => valueAt(justifySelf, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --justify-self-screen: ${({justifySelf}) => valueAt(justifySelf, 'screen:2xl')};
  }
`;

const borderStyles = css<ContainerLayoutProps>`
  border: ${({border, theme}) => getBorder(asPlain(border), undefined, theme)};
`;

const responsiveBorderStyles = css<ContainerLayoutProps>`
  --border-container: initial;
  --border-screen: initial;
  border: var(
    --border-screen,
    var(--border-container, ${({border, theme}) => borderAt(border, 'zero', theme)})
  );
  @container (min-width: 320px) {
    --border-container: ${({border, theme}) => borderAt(border, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --border-container: ${({border, theme}) => borderAt(border, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --border-container: ${({border, theme}) => borderAt(border, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --border-container: ${({border, theme}) => borderAt(border, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --border-container: ${({border, theme}) => borderAt(border, 'md', theme)};
  }
  @container (min-width: 640px) {
    --border-container: ${({border, theme}) => borderAt(border, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --border-container: ${({border, theme}) => borderAt(border, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --border-container: ${({border, theme}) => borderAt(border, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --border-container: ${({border, theme}) => borderAt(border, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --border-container: ${({border, theme}) => borderAt(border, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --border-container: ${({border, theme}) => borderAt(border, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --border-screen: ${({border, theme}) => borderAt(border, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --border-screen: ${({border, theme}) => borderAt(border, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --border-screen: ${({border, theme}) => borderAt(border, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --border-screen: ${({border, theme}) => borderAt(border, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --border-screen: ${({border, theme}) => borderAt(border, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --border-screen: ${({border, theme}) => borderAt(border, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --border-screen: ${({border, theme}) => borderAt(border, 'screen:2xl', theme)};
  }
`;

const borderTopStyles = css<ContainerLayoutProps>`
  border-top: ${({borderTop, theme}) => getBorder(asPlain(borderTop), undefined, theme)};
`;

const responsiveBorderTopStyles = css<ContainerLayoutProps>`
  --border-top-container: initial;
  --border-top-screen: initial;
  border-top: var(
    --border-top-screen,
    var(
      --border-top-container,
      ${({borderTop, theme}) => borderAt(borderTop, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, 'md', theme)};
  }
  @container (min-width: 640px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --border-top-container: ${({borderTop, theme}) => borderAt(borderTop, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --border-top-screen: ${({borderTop, theme}) => borderAt(borderTop, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --border-top-screen: ${({borderTop, theme}) => borderAt(borderTop, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --border-top-screen: ${({borderTop, theme}) => borderAt(borderTop, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --border-top-screen: ${({borderTop, theme}) => borderAt(borderTop, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --border-top-screen: ${({borderTop, theme}) => borderAt(borderTop, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --border-top-screen: ${({borderTop, theme}) => borderAt(borderTop, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --border-top-screen: ${({borderTop, theme}) => borderAt(borderTop, 'screen:2xl', theme)};
  }
`;

const borderBottomStyles = css<ContainerLayoutProps>`
  border-bottom: ${({borderBottom, theme}) => getBorder(asPlain(borderBottom), undefined, theme)};
`;

const responsiveBorderBottomStyles = css<ContainerLayoutProps>`
  --border-bottom-container: initial;
  --border-bottom-screen: initial;
  border-bottom: var(
    --border-bottom-screen,
    var(
      --border-bottom-container,
      ${({borderBottom, theme}) => borderAt(borderBottom, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, 'md', theme)};
  }
  @container (min-width: 640px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --border-bottom-container: ${({borderBottom, theme}) => borderAt(borderBottom, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --border-bottom-screen: ${({borderBottom, theme}) => borderAt(borderBottom, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --border-bottom-screen: ${({borderBottom, theme}) => borderAt(borderBottom, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --border-bottom-screen: ${({borderBottom, theme}) => borderAt(borderBottom, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --border-bottom-screen: ${({borderBottom, theme}) => borderAt(borderBottom, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --border-bottom-screen: ${({borderBottom, theme}) => borderAt(borderBottom, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --border-bottom-screen: ${({borderBottom, theme}) => borderAt(borderBottom, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --border-bottom-screen: ${({borderBottom, theme}) => borderAt(borderBottom, 'screen:2xl', theme)};
  }
`;

const borderLeftStyles = css<ContainerLayoutProps>`
  border-left: ${({borderLeft, theme}) => getBorder(asPlain(borderLeft), undefined, theme)};
`;

const responsiveBorderLeftStyles = css<ContainerLayoutProps>`
  --border-left-container: initial;
  --border-left-screen: initial;
  border-left: var(
    --border-left-screen,
    var(
      --border-left-container,
      ${({borderLeft, theme}) => borderAt(borderLeft, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, 'md', theme)};
  }
  @container (min-width: 640px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --border-left-container: ${({borderLeft, theme}) => borderAt(borderLeft, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --border-left-screen: ${({borderLeft, theme}) => borderAt(borderLeft, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --border-left-screen: ${({borderLeft, theme}) => borderAt(borderLeft, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --border-left-screen: ${({borderLeft, theme}) => borderAt(borderLeft, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --border-left-screen: ${({borderLeft, theme}) => borderAt(borderLeft, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --border-left-screen: ${({borderLeft, theme}) => borderAt(borderLeft, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --border-left-screen: ${({borderLeft, theme}) => borderAt(borderLeft, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --border-left-screen: ${({borderLeft, theme}) => borderAt(borderLeft, 'screen:2xl', theme)};
  }
`;

const borderRightStyles = css<ContainerLayoutProps>`
  border-right: ${({borderRight, theme}) => getBorder(asPlain(borderRight), undefined, theme)};
`;

const responsiveBorderRightStyles = css<ContainerLayoutProps>`
  --border-right-container: initial;
  --border-right-screen: initial;
  border-right: var(
    --border-right-screen,
    var(
      --border-right-container,
      ${({borderRight, theme}) => borderAt(borderRight, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, 'md', theme)};
  }
  @container (min-width: 640px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --border-right-container: ${({borderRight, theme}) => borderAt(borderRight, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --border-right-screen: ${({borderRight, theme}) => borderAt(borderRight, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --border-right-screen: ${({borderRight, theme}) => borderAt(borderRight, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --border-right-screen: ${({borderRight, theme}) => borderAt(borderRight, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --border-right-screen: ${({borderRight, theme}) => borderAt(borderRight, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --border-right-screen: ${({borderRight, theme}) => borderAt(borderRight, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --border-right-screen: ${({borderRight, theme}) => borderAt(borderRight, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --border-right-screen: ${({borderRight, theme}) => borderAt(borderRight, 'screen:2xl', theme)};
  }
`;

const visibilityStyles = css<ContainerLayoutProps>`
  visibility: ${({visibility}) => asPlain(visibility)};
`;

const responsiveVisibilityStyles = css<ContainerLayoutProps>`
  --visibility-container: initial;
  --visibility-screen: initial;
  visibility: var(
    --visibility-screen,
    var(--visibility-container, ${({visibility}) => valueAt(visibility, 'zero')})
  );
  @container (min-width: 320px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, '3xs')};
  }
  @container (min-width: 384px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, '2xs')};
  }
  @container (min-width: 448px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, 'xs')};
  }
  @container (min-width: 512px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, 'sm')};
  }
  @container (min-width: 576px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, 'md')};
  }
  @container (min-width: 640px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, 'lg')};
  }
  @container (min-width: 768px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, 'xl')};
  }
  @container (min-width: 896px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, '2xl')};
  }
  @container (min-width: 1024px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, '3xl')};
  }
  @container (min-width: 1152px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, '4xl')};
  }
  @container (min-width: 1280px) {
    --visibility-container: ${({visibility}) => valueAt(visibility, '5xl')};
  }
  @media (min-width: 0px) {
    --visibility-screen: ${({visibility}) => valueAt(visibility, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --visibility-screen: ${({visibility}) => valueAt(visibility, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --visibility-screen: ${({visibility}) => valueAt(visibility, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --visibility-screen: ${({visibility}) => valueAt(visibility, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --visibility-screen: ${({visibility}) => valueAt(visibility, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --visibility-screen: ${({visibility}) => valueAt(visibility, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --visibility-screen: ${({visibility}) => valueAt(visibility, 'screen:2xl')};
  }
`;

const whiteSpaceStyles = css<ContainerLayoutProps>`
  white-space: ${({whiteSpace}) => asPlain(whiteSpace)};
`;

const responsiveWhiteSpaceStyles = css<ContainerLayoutProps>`
  --white-space-container: initial;
  --white-space-screen: initial;
  white-space: var(
    --white-space-screen,
    var(--white-space-container, ${({whiteSpace}) => valueAt(whiteSpace, 'zero')})
  );
  @container (min-width: 320px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, '3xs')};
  }
  @container (min-width: 384px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, '2xs')};
  }
  @container (min-width: 448px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, 'xs')};
  }
  @container (min-width: 512px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, 'sm')};
  }
  @container (min-width: 576px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, 'md')};
  }
  @container (min-width: 640px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, 'lg')};
  }
  @container (min-width: 768px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, 'xl')};
  }
  @container (min-width: 896px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, '2xl')};
  }
  @container (min-width: 1024px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, '3xl')};
  }
  @container (min-width: 1152px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, '4xl')};
  }
  @container (min-width: 1280px) {
    --white-space-container: ${({whiteSpace}) => valueAt(whiteSpace, '5xl')};
  }
  @media (min-width: 0px) {
    --white-space-screen: ${({whiteSpace}) => valueAt(whiteSpace, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --white-space-screen: ${({whiteSpace}) => valueAt(whiteSpace, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --white-space-screen: ${({whiteSpace}) => valueAt(whiteSpace, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --white-space-screen: ${({whiteSpace}) => valueAt(whiteSpace, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --white-space-screen: ${({whiteSpace}) => valueAt(whiteSpace, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --white-space-screen: ${({whiteSpace}) => valueAt(whiteSpace, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --white-space-screen: ${({whiteSpace}) => valueAt(whiteSpace, 'screen:2xl')};
  }
`;

export const Container = styled(ContainerBase)`
  /* Each prop adds its mixin only when it is set. */
  ${p =>
    atoms(
      p.containerType !== undefined && containerTypeStyles,
      p.display !== undefined &&
        (isResponsive(p.display) ? responsiveDisplayStyles : displayStyles),
      p.position !== undefined &&
        (isResponsive(p.position) ? responsivePositionStyles : positionStyles),
      p.inset !== undefined &&
        (isResponsive(p.inset) ? responsiveInsetStyles : insetStyles),
      p.top !== undefined && (isResponsive(p.top) ? responsiveTopStyles : topStyles),
      p.bottom !== undefined &&
        (isResponsive(p.bottom) ? responsiveBottomStyles : bottomStyles),
      p.left !== undefined && (isResponsive(p.left) ? responsiveLeftStyles : leftStyles),
      p.right !== undefined &&
        (isResponsive(p.right) ? responsiveRightStyles : rightStyles),
      p.overflow !== undefined &&
        (isResponsive(p.overflow) ? responsiveOverflowStyles : overflowStyles),
      p.overflowX !== undefined &&
        (isResponsive(p.overflowX) ? responsiveOverflowXStyles : overflowXStyles),
      p.overflowY !== undefined &&
        (isResponsive(p.overflowY) ? responsiveOverflowYStyles : overflowYStyles),
      p.overscrollBehavior !== undefined &&
        (isResponsive(p.overscrollBehavior)
          ? responsiveOverscrollBehaviorStyles
          : overscrollBehaviorStyles),
      p.pointerEvents !== undefined &&
        (isResponsive(p.pointerEvents)
          ? responsivePointerEventsStyles
          : pointerEventsStyles),
      p.cursor !== undefined &&
        (isResponsive(p.cursor) ? responsiveCursorStyles : cursorStyles),
      p.contain !== undefined &&
        (isResponsive(p.contain) ? responsiveContainStyles : containStyles),
      p.padding !== undefined &&
        (isResponsive(p.padding) ? responsivePaddingStyles : paddingStyles),
      p.paddingTop !== undefined &&
        (isResponsive(p.paddingTop) ? responsivePaddingTopStyles : paddingTopStyles),
      p.paddingBottom !== undefined &&
        (isResponsive(p.paddingBottom)
          ? responsivePaddingBottomStyles
          : paddingBottomStyles),
      p.paddingLeft !== undefined &&
        (isResponsive(p.paddingLeft) ? responsivePaddingLeftStyles : paddingLeftStyles),
      p.paddingRight !== undefined &&
        (isResponsive(p.paddingRight)
          ? responsivePaddingRightStyles
          : paddingRightStyles),
      p.margin !== undefined &&
        (isResponsive(p.margin) ? responsiveMarginStyles : marginStyles),
      p.marginTop !== undefined &&
        (isResponsive(p.marginTop) ? responsiveMarginTopStyles : marginTopStyles),
      p.marginBottom !== undefined &&
        (isResponsive(p.marginBottom)
          ? responsiveMarginBottomStyles
          : marginBottomStyles),
      p.marginLeft !== undefined &&
        (isResponsive(p.marginLeft) ? responsiveMarginLeftStyles : marginLeftStyles),
      p.marginRight !== undefined &&
        (isResponsive(p.marginRight) ? responsiveMarginRightStyles : marginRightStyles),
      p.background !== undefined &&
        (isResponsive(p.background) ? responsiveBackgroundStyles : backgroundStyles),
      p.radius !== undefined &&
        (isResponsive(p.radius) ? responsiveRadiusStyles : radiusStyles),
      p.width !== undefined &&
        (isResponsive(p.width) ? responsiveWidthStyles : widthStyles),
      p.minWidth !== undefined &&
        (isResponsive(p.minWidth) ? responsiveMinWidthStyles : minWidthStyles),
      p.maxWidth !== undefined &&
        (isResponsive(p.maxWidth) ? responsiveMaxWidthStyles : maxWidthStyles),
      p.height !== undefined &&
        (isResponsive(p.height) ? responsiveHeightStyles : heightStyles),
      p.minHeight !== undefined &&
        (isResponsive(p.minHeight) ? responsiveMinHeightStyles : minHeightStyles),
      p.maxHeight !== undefined &&
        (isResponsive(p.maxHeight) ? responsiveMaxHeightStyles : maxHeightStyles),
      p.area !== undefined && (isResponsive(p.area) ? responsiveAreaStyles : areaStyles),
      p.row !== undefined && (isResponsive(p.row) ? responsiveRowStyles : rowStyles),
      p.column !== undefined &&
        (isResponsive(p.column) ? responsiveColumnStyles : columnStyles),
      p.order !== undefined &&
        (isResponsive(p.order) ? responsiveOrderStyles : orderStyles),
      p.flex !== undefined && (isResponsive(p.flex) ? responsiveFlexStyles : flexStyles),
      p.flexGrow !== undefined &&
        (isResponsive(p.flexGrow) ? responsiveFlexGrowStyles : flexGrowStyles),
      p.flexShrink !== undefined &&
        (isResponsive(p.flexShrink) ? responsiveFlexShrinkStyles : flexShrinkStyles),
      p.flexBasis !== undefined &&
        (isResponsive(p.flexBasis) ? responsiveFlexBasisStyles : flexBasisStyles),
      p.alignSelf !== undefined &&
        (isResponsive(p.alignSelf) ? responsiveAlignSelfStyles : alignSelfStyles),
      p.justifySelf !== undefined &&
        (isResponsive(p.justifySelf) ? responsiveJustifySelfStyles : justifySelfStyles),
      p.border !== undefined &&
        (isResponsive(p.border) ? responsiveBorderStyles : borderStyles),
      p.borderTop !== undefined &&
        (isResponsive(p.borderTop) ? responsiveBorderTopStyles : borderTopStyles),
      p.borderBottom !== undefined &&
        (isResponsive(p.borderBottom)
          ? responsiveBorderBottomStyles
          : borderBottomStyles),
      p.borderLeft !== undefined &&
        (isResponsive(p.borderLeft) ? responsiveBorderLeftStyles : borderLeftStyles),
      p.borderRight !== undefined &&
        (isResponsive(p.borderRight) ? responsiveBorderRightStyles : borderRightStyles),
      p.visibility !== undefined &&
        (isResponsive(p.visibility) ? responsiveVisibilityStyles : visibilityStyles),
      p.whiteSpace !== undefined &&
        (isResponsive(p.whiteSpace) ? responsiveWhiteSpaceStyles : whiteSpaceStyles)
    )}
` as unknown as <T extends ContainerElement = 'div'>(
  props: ContainerProps<T> | ContainerPropsWithRenderFunction<T>
) => React.ReactElement;
