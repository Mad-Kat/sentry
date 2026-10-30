import type * as React from 'react';
import {atoms, css, styled} from '@yak/react';

import type {CSS} from '@sentry/scraps/cssTypes';
import type {SpaceSize} from '@sentry/scraps/theme';

import {
  Container,
  type ContainerElement,
  type ContainerProps,
  type ContainerPropsWithRenderFunction,
} from './container';
import {
  flexAlign,
  flexAlignAt,
  flexJustify,
  flexJustifyAt,
  getSpacing,
  asPlain,
  isResponsive,
  spacingAt,
  valueAt,
  type FlexJustify,
  type Responsive,
} from './styles';

export interface FlexLayoutProps {
  /**
   * Aligns flex items along the cross axis of the current line of flex items.
   * Uses CSS align-items property.
   */
  align?: Responsive<'start' | 'end' | 'center' | 'baseline' | 'stretch'>;
  /**
   * Specifies the direction of the flex items.
   */
  direction?: Responsive<'row' | 'row-reverse' | 'column' | 'column-reverse'>;
  /**
   * Specifies the display type of the flex container.
   */
  display?: Responsive<'flex' | 'inline-flex' | 'none'>;
  /**
   * Shorthand for the flex property.
   */
  flex?: Responsive<CSS['flex']>;
  /**
   * Specifies the spacing between flex items.
   */
  gap?: Responsive<SpaceSize | `${SpaceSize} ${SpaceSize}`>;
  /**
   * Aligns flex items along the block axis of the current line of flex items.
   * Uses CSS justify-content property.
   */
  justify?: Responsive<FlexJustify>;
  /**
   * Specifies the wrapping behavior of the flex items.
   */
  wrap?: Responsive<'nowrap' | 'wrap' | 'wrap-reverse'>;
}

export interface FlexProps<T extends ContainerElement = 'div'>
  extends Omit<ContainerProps<T>, 'display'>, FlexLayoutProps {}
export interface FlexPropsWithRenderFunction<T extends ContainerElement = 'div'>
  extends Omit<ContainerPropsWithRenderFunction<T>, 'display'>, FlexLayoutProps {}

// One mixin for each prop. A responsive value uses the responsive mixin: it sets
// one variable per breakpoint, and each breakpoint carries the value of the
// smaller ones.
const gapStyles = css<FlexLayoutProps>`
  gap: ${({gap, theme}) => getSpacing(asPlain(gap), undefined, theme)};
`;

const responsiveGapStyles = css<FlexLayoutProps>`
  --gap-container: initial;
  --gap-screen: initial;
  gap: var(
    --gap-screen,
    var(--gap-container, ${({gap, theme}) => spacingAt(gap, 'zero', theme)})
  );
  @container (min-width: 320px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, 'md', theme)};
  }
  @container (min-width: 640px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --gap-container: ${({gap, theme}) => spacingAt(gap, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --gap-screen: ${({gap, theme}) => spacingAt(gap, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --gap-screen: ${({gap, theme}) => spacingAt(gap, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --gap-screen: ${({gap, theme}) => spacingAt(gap, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --gap-screen: ${({gap, theme}) => spacingAt(gap, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --gap-screen: ${({gap, theme}) => spacingAt(gap, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --gap-screen: ${({gap, theme}) => spacingAt(gap, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --gap-screen: ${({gap, theme}) => spacingAt(gap, 'screen:2xl', theme)};
  }
`;

const directionStyles = css<FlexLayoutProps>`
  flex-direction: ${({direction}) => asPlain(direction)};
`;

const responsiveDirectionStyles = css<FlexLayoutProps>`
  --direction-container: initial;
  --direction-screen: initial;
  flex-direction: var(
    --direction-screen,
    var(--direction-container, ${({direction}) => valueAt(direction, 'zero')})
  );
  @container (min-width: 320px) {
    --direction-container: ${({direction}) => valueAt(direction, '3xs')};
  }
  @container (min-width: 384px) {
    --direction-container: ${({direction}) => valueAt(direction, '2xs')};
  }
  @container (min-width: 448px) {
    --direction-container: ${({direction}) => valueAt(direction, 'xs')};
  }
  @container (min-width: 512px) {
    --direction-container: ${({direction}) => valueAt(direction, 'sm')};
  }
  @container (min-width: 576px) {
    --direction-container: ${({direction}) => valueAt(direction, 'md')};
  }
  @container (min-width: 640px) {
    --direction-container: ${({direction}) => valueAt(direction, 'lg')};
  }
  @container (min-width: 768px) {
    --direction-container: ${({direction}) => valueAt(direction, 'xl')};
  }
  @container (min-width: 896px) {
    --direction-container: ${({direction}) => valueAt(direction, '2xl')};
  }
  @container (min-width: 1024px) {
    --direction-container: ${({direction}) => valueAt(direction, '3xl')};
  }
  @container (min-width: 1152px) {
    --direction-container: ${({direction}) => valueAt(direction, '4xl')};
  }
  @container (min-width: 1280px) {
    --direction-container: ${({direction}) => valueAt(direction, '5xl')};
  }
  @media (min-width: 0px) {
    --direction-screen: ${({direction}) => valueAt(direction, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --direction-screen: ${({direction}) => valueAt(direction, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --direction-screen: ${({direction}) => valueAt(direction, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --direction-screen: ${({direction}) => valueAt(direction, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --direction-screen: ${({direction}) => valueAt(direction, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --direction-screen: ${({direction}) => valueAt(direction, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --direction-screen: ${({direction}) => valueAt(direction, 'screen:2xl')};
  }
`;

const wrapStyles = css<FlexLayoutProps>`
  flex-wrap: ${({wrap}) => asPlain(wrap)};
`;

const responsiveWrapStyles = css<FlexLayoutProps>`
  --wrap-container: initial;
  --wrap-screen: initial;
  flex-wrap: var(
    --wrap-screen,
    var(--wrap-container, ${({wrap}) => valueAt(wrap, 'zero')})
  );
  @container (min-width: 320px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, '3xs')};
  }
  @container (min-width: 384px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, '2xs')};
  }
  @container (min-width: 448px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, 'xs')};
  }
  @container (min-width: 512px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, 'sm')};
  }
  @container (min-width: 576px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, 'md')};
  }
  @container (min-width: 640px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, 'lg')};
  }
  @container (min-width: 768px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, 'xl')};
  }
  @container (min-width: 896px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, '2xl')};
  }
  @container (min-width: 1024px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, '3xl')};
  }
  @container (min-width: 1152px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, '4xl')};
  }
  @container (min-width: 1280px) {
    --wrap-container: ${({wrap}) => valueAt(wrap, '5xl')};
  }
  @media (min-width: 0px) {
    --wrap-screen: ${({wrap}) => valueAt(wrap, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --wrap-screen: ${({wrap}) => valueAt(wrap, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --wrap-screen: ${({wrap}) => valueAt(wrap, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --wrap-screen: ${({wrap}) => valueAt(wrap, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --wrap-screen: ${({wrap}) => valueAt(wrap, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --wrap-screen: ${({wrap}) => valueAt(wrap, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --wrap-screen: ${({wrap}) => valueAt(wrap, 'screen:2xl')};
  }
`;

const justifyStyles = css<FlexLayoutProps>`
  justify-content: ${({justify}) => flexJustify(asPlain(justify))};
`;

const responsiveJustifyStyles = css<FlexLayoutProps>`
  --justify-container: initial;
  --justify-screen: initial;
  justify-content: var(
    --justify-screen,
    var(--justify-container, ${({justify}) => flexJustifyAt(justify, 'zero')})
  );
  @container (min-width: 320px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, '3xs')};
  }
  @container (min-width: 384px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, '2xs')};
  }
  @container (min-width: 448px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, 'xs')};
  }
  @container (min-width: 512px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, 'sm')};
  }
  @container (min-width: 576px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, 'md')};
  }
  @container (min-width: 640px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, 'lg')};
  }
  @container (min-width: 768px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, 'xl')};
  }
  @container (min-width: 896px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, '2xl')};
  }
  @container (min-width: 1024px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, '3xl')};
  }
  @container (min-width: 1152px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, '4xl')};
  }
  @container (min-width: 1280px) {
    --justify-container: ${({justify}) => flexJustifyAt(justify, '5xl')};
  }
  @media (min-width: 0px) {
    --justify-screen: ${({justify}) => flexJustifyAt(justify, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --justify-screen: ${({justify}) => flexJustifyAt(justify, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --justify-screen: ${({justify}) => flexJustifyAt(justify, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --justify-screen: ${({justify}) => flexJustifyAt(justify, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --justify-screen: ${({justify}) => flexJustifyAt(justify, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --justify-screen: ${({justify}) => flexJustifyAt(justify, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --justify-screen: ${({justify}) => flexJustifyAt(justify, 'screen:2xl')};
  }
`;

const alignStyles = css<FlexLayoutProps>`
  align-items: ${({align}) => flexAlign(asPlain(align))};
`;

const responsiveAlignStyles = css<FlexLayoutProps>`
  --align-container: initial;
  --align-screen: initial;
  align-items: var(
    --align-screen,
    var(--align-container, ${({align}) => flexAlignAt(align, 'zero')})
  );
  @container (min-width: 320px) {
    --align-container: ${({align}) => flexAlignAt(align, '3xs')};
  }
  @container (min-width: 384px) {
    --align-container: ${({align}) => flexAlignAt(align, '2xs')};
  }
  @container (min-width: 448px) {
    --align-container: ${({align}) => flexAlignAt(align, 'xs')};
  }
  @container (min-width: 512px) {
    --align-container: ${({align}) => flexAlignAt(align, 'sm')};
  }
  @container (min-width: 576px) {
    --align-container: ${({align}) => flexAlignAt(align, 'md')};
  }
  @container (min-width: 640px) {
    --align-container: ${({align}) => flexAlignAt(align, 'lg')};
  }
  @container (min-width: 768px) {
    --align-container: ${({align}) => flexAlignAt(align, 'xl')};
  }
  @container (min-width: 896px) {
    --align-container: ${({align}) => flexAlignAt(align, '2xl')};
  }
  @container (min-width: 1024px) {
    --align-container: ${({align}) => flexAlignAt(align, '3xl')};
  }
  @container (min-width: 1152px) {
    --align-container: ${({align}) => flexAlignAt(align, '4xl')};
  }
  @container (min-width: 1280px) {
    --align-container: ${({align}) => flexAlignAt(align, '5xl')};
  }
  @media (min-width: 0px) {
    --align-screen: ${({align}) => flexAlignAt(align, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --align-screen: ${({align}) => flexAlignAt(align, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --align-screen: ${({align}) => flexAlignAt(align, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --align-screen: ${({align}) => flexAlignAt(align, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --align-screen: ${({align}) => flexAlignAt(align, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --align-screen: ${({align}) => flexAlignAt(align, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --align-screen: ${({align}) => flexAlignAt(align, 'screen:2xl')};
  }
`;

// Container writes the display rule. Flex sets its default.
export const Flex = styled(Container).attrs<FlexProps<any>>(({display}) => ({
  display: display ?? 'flex',
}))`
  /* Each prop adds its mixin only when it is set. */
  ${p =>
    atoms(
      p.gap !== undefined && (isResponsive(p.gap) ? responsiveGapStyles : gapStyles),
      p.direction !== undefined &&
        (isResponsive(p.direction) ? responsiveDirectionStyles : directionStyles),
      p.wrap !== undefined && (isResponsive(p.wrap) ? responsiveWrapStyles : wrapStyles),
      p.justify !== undefined &&
        (isResponsive(p.justify) ? responsiveJustifyStyles : justifyStyles),
      p.align !== undefined &&
        (isResponsive(p.align) ? responsiveAlignStyles : alignStyles)
    )}
` as unknown as <T extends ContainerElement = 'div'>(
  props: FlexProps<T> | FlexPropsWithRenderFunction<T>
) => React.ReactElement;
