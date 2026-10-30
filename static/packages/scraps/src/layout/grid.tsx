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
  getSpacing,
  gridContent,
  gridContentAt,
  asPlain,
  isResponsive,
  spacingAt,
  valueAt,
  type Responsive,
} from './styles';

interface GridLayoutProps {
  /**
   * Aligns grid items along the column axis within their grid cells.
   * Uses CSS align-items property.
   */
  align?: Responsive<'start' | 'end' | 'center' | 'baseline' | 'stretch'>;
  /**
   * Aligns grid items along the column axis within their grid cells.
   * Uses CSS align-content property.
   */
  alignContent?: Responsive<
    'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch'
  >;
  /**
   * Defines named grid areas for child components to reference.
   * Uses CSS grid-template-areas property.
   */
  areas?: Responsive<CSS['gridTemplateAreas']>;
  /**
   * Specifies the size of auto-generated column tracks.
   * Uses CSS grid-auto-columns property.
   */
  autoColumns?: Responsive<CSS['gridAutoColumns']>;
  /**
   * Specifies the size of auto-generated row tracks.
   * Uses CSS grid-auto-rows property.
   */
  autoRows?: Responsive<CSS['gridAutoRows']>;
  /**
   * Defines the column tracks of the grid.
   * Uses CSS grid-template-columns property.
   */
  columns?: Responsive<CSS['gridTemplateColumns']>;
  /**
   * Determines the grid display type.
   */
  display?: Responsive<'grid' | 'inline-grid' | 'none'>;
  /**
   * Controls the auto-placement algorithm for grid items.
   * Uses CSS grid-auto-flow property.
   */
  flow?: Responsive<'row' | 'column' | 'row dense' | 'column dense'>;
  gap?: Responsive<SpaceSize | `${SpaceSize} ${SpaceSize}`>;
  /**
   * Aligns the grid container's content along the row axis when the grid is smaller than its container.
   * Uses CSS justify-content property.
   */
  justify?: Responsive<
    'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch'
  >;
  /**
   * Aligns grid items along the row axis within their grid cells.
   * Uses CSS justify-items property.
   */
  justifyItems?: Responsive<'start' | 'end' | 'center' | 'stretch'>;
  /**
   * Defines the row tracks of the grid.
   * Uses CSS grid-template-rows property.
   */
  rows?: Responsive<CSS['gridTemplateRows']>;
}

export type GridProps<T extends ContainerElement = 'div'> = ContainerProps<T> &
  GridLayoutProps;

export type GridPropsWithRenderFunction<T extends ContainerElement = 'div'> =
  ContainerPropsWithRenderFunction<T> & GridLayoutProps;

// One mixin for each prop. A responsive value uses the responsive mixin: it sets
// one variable per breakpoint, and each breakpoint carries the value of the
// smaller ones.
const gapStyles = css<GridLayoutProps>`
  gap: ${({gap, theme}) => getSpacing(asPlain(gap), undefined, theme)};
`;

const responsiveGapStyles = css<GridLayoutProps>`
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

const columnsStyles = css<GridLayoutProps>`
  grid-template-columns: ${({columns}) => asPlain(columns)};
`;

const responsiveColumnsStyles = css<GridLayoutProps>`
  --columns-container: initial;
  --columns-screen: initial;
  grid-template-columns: var(
    --columns-screen,
    var(--columns-container, ${({columns}) => valueAt(columns, 'zero')})
  );
  @container (min-width: 320px) {
    --columns-container: ${({columns}) => valueAt(columns, '3xs')};
  }
  @container (min-width: 384px) {
    --columns-container: ${({columns}) => valueAt(columns, '2xs')};
  }
  @container (min-width: 448px) {
    --columns-container: ${({columns}) => valueAt(columns, 'xs')};
  }
  @container (min-width: 512px) {
    --columns-container: ${({columns}) => valueAt(columns, 'sm')};
  }
  @container (min-width: 576px) {
    --columns-container: ${({columns}) => valueAt(columns, 'md')};
  }
  @container (min-width: 640px) {
    --columns-container: ${({columns}) => valueAt(columns, 'lg')};
  }
  @container (min-width: 768px) {
    --columns-container: ${({columns}) => valueAt(columns, 'xl')};
  }
  @container (min-width: 896px) {
    --columns-container: ${({columns}) => valueAt(columns, '2xl')};
  }
  @container (min-width: 1024px) {
    --columns-container: ${({columns}) => valueAt(columns, '3xl')};
  }
  @container (min-width: 1152px) {
    --columns-container: ${({columns}) => valueAt(columns, '4xl')};
  }
  @container (min-width: 1280px) {
    --columns-container: ${({columns}) => valueAt(columns, '5xl')};
  }
  @media (min-width: 0px) {
    --columns-screen: ${({columns}) => valueAt(columns, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --columns-screen: ${({columns}) => valueAt(columns, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --columns-screen: ${({columns}) => valueAt(columns, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --columns-screen: ${({columns}) => valueAt(columns, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --columns-screen: ${({columns}) => valueAt(columns, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --columns-screen: ${({columns}) => valueAt(columns, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --columns-screen: ${({columns}) => valueAt(columns, 'screen:2xl')};
  }
`;

const rowsStyles = css<GridLayoutProps>`
  grid-template-rows: ${({rows}) => asPlain(rows)};
`;

const responsiveRowsStyles = css<GridLayoutProps>`
  --rows-container: initial;
  --rows-screen: initial;
  grid-template-rows: var(
    --rows-screen,
    var(--rows-container, ${({rows}) => valueAt(rows, 'zero')})
  );
  @container (min-width: 320px) {
    --rows-container: ${({rows}) => valueAt(rows, '3xs')};
  }
  @container (min-width: 384px) {
    --rows-container: ${({rows}) => valueAt(rows, '2xs')};
  }
  @container (min-width: 448px) {
    --rows-container: ${({rows}) => valueAt(rows, 'xs')};
  }
  @container (min-width: 512px) {
    --rows-container: ${({rows}) => valueAt(rows, 'sm')};
  }
  @container (min-width: 576px) {
    --rows-container: ${({rows}) => valueAt(rows, 'md')};
  }
  @container (min-width: 640px) {
    --rows-container: ${({rows}) => valueAt(rows, 'lg')};
  }
  @container (min-width: 768px) {
    --rows-container: ${({rows}) => valueAt(rows, 'xl')};
  }
  @container (min-width: 896px) {
    --rows-container: ${({rows}) => valueAt(rows, '2xl')};
  }
  @container (min-width: 1024px) {
    --rows-container: ${({rows}) => valueAt(rows, '3xl')};
  }
  @container (min-width: 1152px) {
    --rows-container: ${({rows}) => valueAt(rows, '4xl')};
  }
  @container (min-width: 1280px) {
    --rows-container: ${({rows}) => valueAt(rows, '5xl')};
  }
  @media (min-width: 0px) {
    --rows-screen: ${({rows}) => valueAt(rows, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --rows-screen: ${({rows}) => valueAt(rows, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --rows-screen: ${({rows}) => valueAt(rows, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --rows-screen: ${({rows}) => valueAt(rows, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --rows-screen: ${({rows}) => valueAt(rows, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --rows-screen: ${({rows}) => valueAt(rows, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --rows-screen: ${({rows}) => valueAt(rows, 'screen:2xl')};
  }
`;

const areasStyles = css<GridLayoutProps>`
  grid-template-areas: ${({areas}) => asPlain(areas)};
`;

const responsiveAreasStyles = css<GridLayoutProps>`
  --areas-container: initial;
  --areas-screen: initial;
  grid-template-areas: var(
    --areas-screen,
    var(--areas-container, ${({areas}) => valueAt(areas, 'zero')})
  );
  @container (min-width: 320px) {
    --areas-container: ${({areas}) => valueAt(areas, '3xs')};
  }
  @container (min-width: 384px) {
    --areas-container: ${({areas}) => valueAt(areas, '2xs')};
  }
  @container (min-width: 448px) {
    --areas-container: ${({areas}) => valueAt(areas, 'xs')};
  }
  @container (min-width: 512px) {
    --areas-container: ${({areas}) => valueAt(areas, 'sm')};
  }
  @container (min-width: 576px) {
    --areas-container: ${({areas}) => valueAt(areas, 'md')};
  }
  @container (min-width: 640px) {
    --areas-container: ${({areas}) => valueAt(areas, 'lg')};
  }
  @container (min-width: 768px) {
    --areas-container: ${({areas}) => valueAt(areas, 'xl')};
  }
  @container (min-width: 896px) {
    --areas-container: ${({areas}) => valueAt(areas, '2xl')};
  }
  @container (min-width: 1024px) {
    --areas-container: ${({areas}) => valueAt(areas, '3xl')};
  }
  @container (min-width: 1152px) {
    --areas-container: ${({areas}) => valueAt(areas, '4xl')};
  }
  @container (min-width: 1280px) {
    --areas-container: ${({areas}) => valueAt(areas, '5xl')};
  }
  @media (min-width: 0px) {
    --areas-screen: ${({areas}) => valueAt(areas, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --areas-screen: ${({areas}) => valueAt(areas, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --areas-screen: ${({areas}) => valueAt(areas, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --areas-screen: ${({areas}) => valueAt(areas, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --areas-screen: ${({areas}) => valueAt(areas, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --areas-screen: ${({areas}) => valueAt(areas, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --areas-screen: ${({areas}) => valueAt(areas, 'screen:2xl')};
  }
`;

const autoColumnsStyles = css<GridLayoutProps>`
  grid-auto-columns: ${({autoColumns}) => asPlain(autoColumns)};
`;

const responsiveAutoColumnsStyles = css<GridLayoutProps>`
  --auto-columns-container: initial;
  --auto-columns-screen: initial;
  grid-auto-columns: var(
    --auto-columns-screen,
    var(--auto-columns-container, ${({autoColumns}) => valueAt(autoColumns, 'zero')})
  );
  @container (min-width: 320px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, '3xs')};
  }
  @container (min-width: 384px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, '2xs')};
  }
  @container (min-width: 448px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, 'xs')};
  }
  @container (min-width: 512px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, 'sm')};
  }
  @container (min-width: 576px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, 'md')};
  }
  @container (min-width: 640px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, 'lg')};
  }
  @container (min-width: 768px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, 'xl')};
  }
  @container (min-width: 896px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, '2xl')};
  }
  @container (min-width: 1024px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, '3xl')};
  }
  @container (min-width: 1152px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, '4xl')};
  }
  @container (min-width: 1280px) {
    --auto-columns-container: ${({autoColumns}) => valueAt(autoColumns, '5xl')};
  }
  @media (min-width: 0px) {
    --auto-columns-screen: ${({autoColumns}) => valueAt(autoColumns, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --auto-columns-screen: ${({autoColumns}) => valueAt(autoColumns, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --auto-columns-screen: ${({autoColumns}) => valueAt(autoColumns, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --auto-columns-screen: ${({autoColumns}) => valueAt(autoColumns, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --auto-columns-screen: ${({autoColumns}) => valueAt(autoColumns, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --auto-columns-screen: ${({autoColumns}) => valueAt(autoColumns, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --auto-columns-screen: ${({autoColumns}) => valueAt(autoColumns, 'screen:2xl')};
  }
`;

const autoRowsStyles = css<GridLayoutProps>`
  grid-auto-rows: ${({autoRows}) => asPlain(autoRows)};
`;

const responsiveAutoRowsStyles = css<GridLayoutProps>`
  --auto-rows-container: initial;
  --auto-rows-screen: initial;
  grid-auto-rows: var(
    --auto-rows-screen,
    var(--auto-rows-container, ${({autoRows}) => valueAt(autoRows, 'zero')})
  );
  @container (min-width: 320px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, '3xs')};
  }
  @container (min-width: 384px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, '2xs')};
  }
  @container (min-width: 448px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, 'xs')};
  }
  @container (min-width: 512px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, 'sm')};
  }
  @container (min-width: 576px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, 'md')};
  }
  @container (min-width: 640px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, 'lg')};
  }
  @container (min-width: 768px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, 'xl')};
  }
  @container (min-width: 896px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, '2xl')};
  }
  @container (min-width: 1024px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, '3xl')};
  }
  @container (min-width: 1152px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, '4xl')};
  }
  @container (min-width: 1280px) {
    --auto-rows-container: ${({autoRows}) => valueAt(autoRows, '5xl')};
  }
  @media (min-width: 0px) {
    --auto-rows-screen: ${({autoRows}) => valueAt(autoRows, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --auto-rows-screen: ${({autoRows}) => valueAt(autoRows, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --auto-rows-screen: ${({autoRows}) => valueAt(autoRows, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --auto-rows-screen: ${({autoRows}) => valueAt(autoRows, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --auto-rows-screen: ${({autoRows}) => valueAt(autoRows, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --auto-rows-screen: ${({autoRows}) => valueAt(autoRows, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --auto-rows-screen: ${({autoRows}) => valueAt(autoRows, 'screen:2xl')};
  }
`;

const flowStyles = css<GridLayoutProps>`
  grid-auto-flow: ${({flow}) => asPlain(flow)};
`;

const responsiveFlowStyles = css<GridLayoutProps>`
  --flow-container: initial;
  --flow-screen: initial;
  grid-auto-flow: var(
    --flow-screen,
    var(--flow-container, ${({flow}) => valueAt(flow, 'zero')})
  );
  @container (min-width: 320px) {
    --flow-container: ${({flow}) => valueAt(flow, '3xs')};
  }
  @container (min-width: 384px) {
    --flow-container: ${({flow}) => valueAt(flow, '2xs')};
  }
  @container (min-width: 448px) {
    --flow-container: ${({flow}) => valueAt(flow, 'xs')};
  }
  @container (min-width: 512px) {
    --flow-container: ${({flow}) => valueAt(flow, 'sm')};
  }
  @container (min-width: 576px) {
    --flow-container: ${({flow}) => valueAt(flow, 'md')};
  }
  @container (min-width: 640px) {
    --flow-container: ${({flow}) => valueAt(flow, 'lg')};
  }
  @container (min-width: 768px) {
    --flow-container: ${({flow}) => valueAt(flow, 'xl')};
  }
  @container (min-width: 896px) {
    --flow-container: ${({flow}) => valueAt(flow, '2xl')};
  }
  @container (min-width: 1024px) {
    --flow-container: ${({flow}) => valueAt(flow, '3xl')};
  }
  @container (min-width: 1152px) {
    --flow-container: ${({flow}) => valueAt(flow, '4xl')};
  }
  @container (min-width: 1280px) {
    --flow-container: ${({flow}) => valueAt(flow, '5xl')};
  }
  @media (min-width: 0px) {
    --flow-screen: ${({flow}) => valueAt(flow, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --flow-screen: ${({flow}) => valueAt(flow, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --flow-screen: ${({flow}) => valueAt(flow, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --flow-screen: ${({flow}) => valueAt(flow, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --flow-screen: ${({flow}) => valueAt(flow, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --flow-screen: ${({flow}) => valueAt(flow, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --flow-screen: ${({flow}) => valueAt(flow, 'screen:2xl')};
  }
`;

const justifyStyles = css<GridLayoutProps>`
  justify-content: ${({justify}) => gridContent(asPlain(justify))};
`;

const responsiveJustifyStyles = css<GridLayoutProps>`
  --justify-container: initial;
  --justify-screen: initial;
  justify-content: var(
    --justify-screen,
    var(--justify-container, ${({justify}) => gridContentAt(justify, 'zero')})
  );
  @container (min-width: 320px) {
    --justify-container: ${({justify}) => gridContentAt(justify, '3xs')};
  }
  @container (min-width: 384px) {
    --justify-container: ${({justify}) => gridContentAt(justify, '2xs')};
  }
  @container (min-width: 448px) {
    --justify-container: ${({justify}) => gridContentAt(justify, 'xs')};
  }
  @container (min-width: 512px) {
    --justify-container: ${({justify}) => gridContentAt(justify, 'sm')};
  }
  @container (min-width: 576px) {
    --justify-container: ${({justify}) => gridContentAt(justify, 'md')};
  }
  @container (min-width: 640px) {
    --justify-container: ${({justify}) => gridContentAt(justify, 'lg')};
  }
  @container (min-width: 768px) {
    --justify-container: ${({justify}) => gridContentAt(justify, 'xl')};
  }
  @container (min-width: 896px) {
    --justify-container: ${({justify}) => gridContentAt(justify, '2xl')};
  }
  @container (min-width: 1024px) {
    --justify-container: ${({justify}) => gridContentAt(justify, '3xl')};
  }
  @container (min-width: 1152px) {
    --justify-container: ${({justify}) => gridContentAt(justify, '4xl')};
  }
  @container (min-width: 1280px) {
    --justify-container: ${({justify}) => gridContentAt(justify, '5xl')};
  }
  @media (min-width: 0px) {
    --justify-screen: ${({justify}) => gridContentAt(justify, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --justify-screen: ${({justify}) => gridContentAt(justify, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --justify-screen: ${({justify}) => gridContentAt(justify, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --justify-screen: ${({justify}) => gridContentAt(justify, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --justify-screen: ${({justify}) => gridContentAt(justify, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --justify-screen: ${({justify}) => gridContentAt(justify, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --justify-screen: ${({justify}) => gridContentAt(justify, 'screen:2xl')};
  }
`;

const alignContentStyles = css<GridLayoutProps>`
  align-content: ${({alignContent}) => gridContent(asPlain(alignContent))};
`;

const responsiveAlignContentStyles = css<GridLayoutProps>`
  --align-content-container: initial;
  --align-content-screen: initial;
  align-content: var(
    --align-content-screen,
    var(
      --align-content-container,
      ${({alignContent}) => gridContentAt(alignContent, 'zero')}
    )
  );
  @container (min-width: 320px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, '3xs')};
  }
  @container (min-width: 384px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, '2xs')};
  }
  @container (min-width: 448px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, 'xs')};
  }
  @container (min-width: 512px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, 'sm')};
  }
  @container (min-width: 576px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, 'md')};
  }
  @container (min-width: 640px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, 'lg')};
  }
  @container (min-width: 768px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, 'xl')};
  }
  @container (min-width: 896px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, '2xl')};
  }
  @container (min-width: 1024px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, '3xl')};
  }
  @container (min-width: 1152px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, '4xl')};
  }
  @container (min-width: 1280px) {
    --align-content-container: ${({alignContent}) => gridContentAt(alignContent, '5xl')};
  }
  @media (min-width: 0px) {
    --align-content-screen: ${({alignContent}) => gridContentAt(alignContent, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --align-content-screen: ${({alignContent}) => gridContentAt(alignContent, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --align-content-screen: ${({alignContent}) => gridContentAt(alignContent, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --align-content-screen: ${({alignContent}) => gridContentAt(alignContent, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --align-content-screen: ${({alignContent}) => gridContentAt(alignContent, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --align-content-screen: ${({alignContent}) => gridContentAt(alignContent, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --align-content-screen: ${({alignContent}) => gridContentAt(alignContent, 'screen:2xl')};
  }
`;

const alignStyles = css<GridLayoutProps>`
  align-items: ${({align}) => asPlain(align)};
`;

const responsiveAlignStyles = css<GridLayoutProps>`
  --align-container: initial;
  --align-screen: initial;
  align-items: var(
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

const justifyItemsStyles = css<GridLayoutProps>`
  justify-items: ${({justifyItems}) => asPlain(justifyItems)};
`;

const responsiveJustifyItemsStyles = css<GridLayoutProps>`
  --justify-items-container: initial;
  --justify-items-screen: initial;
  justify-items: var(
    --justify-items-screen,
    var(--justify-items-container, ${({justifyItems}) => valueAt(justifyItems, 'zero')})
  );
  @container (min-width: 320px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, '3xs')};
  }
  @container (min-width: 384px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, '2xs')};
  }
  @container (min-width: 448px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, 'xs')};
  }
  @container (min-width: 512px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, 'sm')};
  }
  @container (min-width: 576px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, 'md')};
  }
  @container (min-width: 640px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, 'lg')};
  }
  @container (min-width: 768px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, 'xl')};
  }
  @container (min-width: 896px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, '2xl')};
  }
  @container (min-width: 1024px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, '3xl')};
  }
  @container (min-width: 1152px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, '4xl')};
  }
  @container (min-width: 1280px) {
    --justify-items-container: ${({justifyItems}) => valueAt(justifyItems, '5xl')};
  }
  @media (min-width: 0px) {
    --justify-items-screen: ${({justifyItems}) => valueAt(justifyItems, 'screen:2xs')};
  }
  @media (min-width: 500px) {
    --justify-items-screen: ${({justifyItems}) => valueAt(justifyItems, 'screen:xs')};
  }
  @media (min-width: 800px) {
    --justify-items-screen: ${({justifyItems}) => valueAt(justifyItems, 'screen:sm')};
  }
  @media (min-width: 992px) {
    --justify-items-screen: ${({justifyItems}) => valueAt(justifyItems, 'screen:md')};
  }
  @media (min-width: 1200px) {
    --justify-items-screen: ${({justifyItems}) => valueAt(justifyItems, 'screen:lg')};
  }
  @media (min-width: 1440px) {
    --justify-items-screen: ${({justifyItems}) => valueAt(justifyItems, 'screen:xl')};
  }
  @media (min-width: 2560px) {
    --justify-items-screen: ${({justifyItems}) => valueAt(justifyItems, 'screen:2xl')};
  }
`;

// Container writes the display rule. Grid sets its default.
export const Grid = styled(Container).attrs<GridProps<any>>(({display}) => ({
  display: display ?? 'grid',
}))`
  /* Each prop adds its mixin only when it is set. */
  ${p =>
    atoms(
      p.gap !== undefined && (isResponsive(p.gap) ? responsiveGapStyles : gapStyles),
      p.columns !== undefined &&
        (isResponsive(p.columns) ? responsiveColumnsStyles : columnsStyles),
      p.rows !== undefined && (isResponsive(p.rows) ? responsiveRowsStyles : rowsStyles),
      p.areas !== undefined &&
        (isResponsive(p.areas) ? responsiveAreasStyles : areasStyles),
      p.autoColumns !== undefined &&
        (isResponsive(p.autoColumns) ? responsiveAutoColumnsStyles : autoColumnsStyles),
      p.autoRows !== undefined &&
        (isResponsive(p.autoRows) ? responsiveAutoRowsStyles : autoRowsStyles),
      p.flow !== undefined && (isResponsive(p.flow) ? responsiveFlowStyles : flowStyles),
      p.justify !== undefined &&
        (isResponsive(p.justify) ? responsiveJustifyStyles : justifyStyles),
      p.alignContent !== undefined &&
        (isResponsive(p.alignContent)
          ? responsiveAlignContentStyles
          : alignContentStyles),
      p.align !== undefined &&
        (isResponsive(p.align) ? responsiveAlignStyles : alignStyles),
      p.justifyItems !== undefined &&
        (isResponsive(p.justifyItems) ? responsiveJustifyItemsStyles : justifyItemsStyles)
    )}
` as unknown as <T extends ContainerElement = 'div'>(
  props: GridProps<T> | GridPropsWithRenderFunction<T>
) => React.ReactElement;
