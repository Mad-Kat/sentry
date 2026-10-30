import type * as React from 'react';

import type {CSS} from '@sentry/scraps/cssTypes';
import type {SpaceSize} from '@sentry/scraps/theme';

import type {
  ContainerElement,
  ContainerProps,
  ContainerPropsWithRenderFunction,
} from './container';
import {StyledGrid} from './generatedStyles';
import type {Responsive} from './styles';

export interface GridLayoutProps {
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

export const Grid = StyledGrid as unknown as <T extends ContainerElement = 'div'>(
  props: GridProps<T> | GridPropsWithRenderFunction<T>
) => React.ReactElement;
