import type * as React from 'react';

import type {CSS} from '@sentry/scraps/cssTypes';
import type {SpaceSize} from '@sentry/scraps/theme';

import type {
  ContainerElement,
  ContainerProps,
  ContainerPropsWithRenderFunction,
} from './container';
import {StyledFlex} from './generatedStyles';
import type {FlexJustify, Responsive} from './styles';

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

export const Flex = StyledFlex as unknown as <T extends ContainerElement = 'div'>(
  props: FlexProps<T> | FlexPropsWithRenderFunction<T>
) => React.ReactElement;
