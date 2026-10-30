import type * as React from 'react';
import isPropValid from '@emotion/is-prop-valid';
import {atoms, css, styled} from '@yak/react';

import {asPlain, isResponsive, valueAt} from '@sentry/scraps/layout/styles';

import {
  fontSizeAt,
  getFontSize,
  getLineHeight,
  lineHeightAt,
  type TextLayoutProps,
} from './styles';

type TextElementProps = TextLayoutProps & {
  as?: React.ElementType;
  children?:
    | React.ReactNode
    | ((props: {
        className: string;
        style: React.CSSProperties | undefined;
      }) => React.ReactNode | undefined);
  className?: string;
  style?: React.CSSProperties;
} & Record<string, unknown>;

/**
 * Renders the element of Text and Heading. yak forwards all props to it, and it
 * passes only valid DOM props to the element.
 */
function TextElementBase({
  as: Component = 'span',
  children,
  // The responsive props only style the element.
  align: _align,
  density: _density,
  display: _display,
  size: _size,
  ...props
}: TextElementProps) {
  if (typeof children === 'function') {
    // The render prop receives the class names and the CSS variables of the
    // styles. The caller puts both on its element.
    return children({className: props.className ?? '', style: props.style});
  }

  const domProps: Record<string, unknown> = {};
  for (const key in props) {
    if (isPropValid(key)) {
      domProps[key] = props[key];
    }
  }

  return <Component {...domProps}>{children}</Component>;
}

// One mixin for each prop. A responsive value uses the responsive mixin: it sets
// one variable per breakpoint, and each breakpoint carries the value of the
// smaller ones.
const sizeStyles = css<TextLayoutProps>`
  font-size: ${({size, theme}) => getFontSize(asPlain(size), theme)};
`;

const responsiveSizeStyles = css<TextLayoutProps>`
  --size-container: initial;
  --size-screen: initial;
  font-size: var(
    --size-screen,
    var(--size-container, ${({size, theme}) => fontSizeAt(size, 'zero', theme)})
  );
  @container (min-width: 320px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, 'md', theme)};
  }
  @container (min-width: 640px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --size-container: ${({size, theme}) => fontSizeAt(size, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --size-screen: ${({size, theme}) => fontSizeAt(size, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --size-screen: ${({size, theme}) => fontSizeAt(size, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --size-screen: ${({size, theme}) => fontSizeAt(size, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --size-screen: ${({size, theme}) => fontSizeAt(size, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --size-screen: ${({size, theme}) => fontSizeAt(size, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --size-screen: ${({size, theme}) => fontSizeAt(size, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --size-screen: ${({size, theme}) => fontSizeAt(size, 'screen:2xl', theme)};
  }
`;

const densityStyles = css<TextLayoutProps>`
  line-height: ${({density, theme}) => getLineHeight(asPlain(density), theme)};
`;

const responsiveDensityStyles = css<TextLayoutProps>`
  --density-container: initial;
  --density-screen: initial;
  line-height: var(
    --density-screen,
    var(
      --density-container,
      ${({density, theme}) => lineHeightAt(density, 'zero', theme)}
    )
  );
  @container (min-width: 320px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, '3xs', theme)};
  }
  @container (min-width: 384px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, '2xs', theme)};
  }
  @container (min-width: 448px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, 'xs', theme)};
  }
  @container (min-width: 512px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, 'sm', theme)};
  }
  @container (min-width: 576px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, 'md', theme)};
  }
  @container (min-width: 640px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, 'lg', theme)};
  }
  @container (min-width: 768px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, 'xl', theme)};
  }
  @container (min-width: 896px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, '2xl', theme)};
  }
  @container (min-width: 1024px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, '3xl', theme)};
  }
  @container (min-width: 1152px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, '4xl', theme)};
  }
  @container (min-width: 1280px) {
    --density-container: ${({density, theme}) => lineHeightAt(density, '5xl', theme)};
  }
  @media (min-width: 0px) {
    --density-screen: ${({density, theme}) => lineHeightAt(density, 'screen:2xs', theme)};
  }
  @media (min-width: 500px) {
    --density-screen: ${({density, theme}) => lineHeightAt(density, 'screen:xs', theme)};
  }
  @media (min-width: 800px) {
    --density-screen: ${({density, theme}) => lineHeightAt(density, 'screen:sm', theme)};
  }
  @media (min-width: 992px) {
    --density-screen: ${({density, theme}) => lineHeightAt(density, 'screen:md', theme)};
  }
  @media (min-width: 1200px) {
    --density-screen: ${({density, theme}) => lineHeightAt(density, 'screen:lg', theme)};
  }
  @media (min-width: 1440px) {
    --density-screen: ${({density, theme}) => lineHeightAt(density, 'screen:xl', theme)};
  }
  @media (min-width: 2560px) {
    --density-screen: ${({density, theme}) => lineHeightAt(density, 'screen:2xl', theme)};
  }
`;

const displayStyles = css<TextLayoutProps>`
  display: ${({display}) => asPlain(display)};
`;

const responsiveDisplayStyles = css<TextLayoutProps>`
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

const alignStyles = css<TextLayoutProps>`
  text-align: ${({align}) => asPlain(align)};
`;

const responsiveAlignStyles = css<TextLayoutProps>`
  --align-container: initial;
  --align-screen: initial;
  text-align: var(
    --align-screen,
    var(--align-container, ${({align}) => valueAt(align, 'zero')})
  );
  @container (min-width: 320px) {
    --align-container: ${({align}) => valueAt(align, '3xs')};
  }
  @container (min-width: 384px) {
    --align-container: ${({align}) => valueAt(align, '2xs')};
  }
  @container (min-width: 448px) {
    --align-container: ${({align}) => valueAt(align, 'xs')};
  }
  @container (min-width: 512px) {
    --align-container: ${({align}) => valueAt(align, 'sm')};
  }
  @container (min-width: 576px) {
    --align-container: ${({align}) => valueAt(align, 'md')};
  }
  @container (min-width: 640px) {
    --align-container: ${({align}) => valueAt(align, 'lg')};
  }
  @container (min-width: 768px) {
    --align-container: ${({align}) => valueAt(align, 'xl')};
  }
  @container (min-width: 896px) {
    --align-container: ${({align}) => valueAt(align, '2xl')};
  }
  @container (min-width: 1024px) {
    --align-container: ${({align}) => valueAt(align, '3xl')};
  }
  @container (min-width: 1152px) {
    --align-container: ${({align}) => valueAt(align, '4xl')};
  }
  @container (min-width: 1280px) {
    --align-container: ${({align}) => valueAt(align, '5xl')};
  }
  @media (min-width: 0px) {
    --align-screen: ${({align}) => valueAt(align, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --align-screen: ${({align}) => valueAt(align, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --align-screen: ${({align}) => valueAt(align, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --align-screen: ${({align}) => valueAt(align, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --align-screen: ${({align}) => valueAt(align, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --align-screen: ${({align}) => valueAt(align, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --align-screen: ${({align}) => valueAt(align, 'screen:2xl')};
  }
`;

/**
 * The responsive props of Text and Heading.
 */
export const TextElement = styled(TextElementBase)`
  /* Each prop adds its mixin only when it is set. */
  ${p =>
    atoms(
      p.size !== undefined && (isResponsive(p.size) ? responsiveSizeStyles : sizeStyles),
      p.density !== undefined &&
        (isResponsive(p.density) ? responsiveDensityStyles : densityStyles),
      p.display !== undefined &&
        (isResponsive(p.display) ? responsiveDisplayStyles : displayStyles),
      p.align !== undefined &&
        (isResponsive(p.align) ? responsiveAlignStyles : alignStyles)
    )}
`;
