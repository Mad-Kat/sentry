import type * as React from 'react';
import {css, styled} from '@yak/react';

import {
  Container,
  type ContainerElement,
  type ContainerProps,
} from '@sentry/scraps/layout/container';
import type {SurfaceVariant} from '@sentry/scraps/theme';

interface FlatSurfaceProps<T extends ContainerElement = 'div'> extends Omit<
  ContainerProps<T>,
  'background' | 'border'
> {
  elevation?: never;
  variant?: SurfaceVariant;
}

interface OverlaySurfaceProps<T extends ContainerElement = 'div'> extends Omit<
  ContainerProps<T>,
  'background' | 'border'
> {
  variant: 'overlay';
  elevation?: 'low' | 'medium' | 'high';
}

interface RenderProps {
  className: string;
  style: React.CSSProperties | undefined;
}

interface FlatSurfacePropsWithRenderFunction {
  children: (props: RenderProps) => React.ReactNode;
  elevation?: never;
  variant?: SurfaceVariant;
}

interface OverlaySurfacePropsWithRenderFunction {
  children: (props: RenderProps) => React.ReactNode;
  variant: 'overlay';
  elevation?: 'low' | 'medium' | 'high';
}

interface SurfaceStyleProps {
  elevation?: OverlaySurfaceProps['elevation'];
  variant?: SurfaceVariant | 'overlay';
}

type SurfaceProps<T extends ContainerElement = 'div'> =
  | FlatSurfaceProps<T>
  | OverlaySurfaceProps<T>;

/**
 * Surface is a layout primitive that provides background colors and optional elevation
 * shadows for layered UI elements. It extends Container with variant-specific styling.
 *
 * @param variant - Surface background variant:
 *   - `primary` | `secondary` | `tertiary`: Flat surfaces with no elevation
 *   - `overlay`: Elevated surface with shadow (e.g., modals, popovers, dropdowns)
 *
 * @param elevation - Shadow depth for overlay variant only. Defaults to `low` for overlays.
 *   - `low`: Subtle shadow for slightly elevated content (default)
 *   - `medium`: Raised shadow for interactive overlays
 *   - `high`: Prominent shadow for modals and dialogs
 *
 * @param radius - Border radius size. Defaults to `md` for overlay variant, no default for others.
 *
 * @example
 * // Flat surface
 * <Surface variant="primary">Content</Surface>
 *
 * // Elevated overlay with low elevation (default)
 * <Surface variant="overlay" elevation="low">Tooltip content</Surface>
 *
 * // Elevated overlay with medium elevation
 * <Surface variant="overlay" elevation="low">Tooltip content</Surface>
 *
 * // Elevated overlay with high elevation
 * <Surface variant="overlay" elevation="high">Modal content</Surface>
 *
 */

function isRenderFunction(
  props:
    | SurfaceProps<any>
    | FlatSurfacePropsWithRenderFunction
    | OverlaySurfacePropsWithRenderFunction
): props is FlatSurfacePropsWithRenderFunction | OverlaySurfacePropsWithRenderFunction {
  return typeof props.children === 'function';
}

export const Surface = styled(
  <T extends ContainerElement = 'div'>(
    props: (
      | SurfaceProps<T>
      | FlatSurfacePropsWithRenderFunction
      | OverlaySurfacePropsWithRenderFunction
    ) & {className?: string; style?: React.CSSProperties}
  ) => {
    if (isRenderFunction(props)) {
      // The render prop receives the class names and the CSS variables of the
      // styles. The caller puts both on its element.
      return props.children({className: props.className ?? '', style: props.style});
    }

    const {variant, elevation: _, ...rest} = props;
    if (variant === 'overlay') {
      return <Container border="primary" radius={rest.radius ?? 'md'} {...rest} />;
    }
    return <Container radius={rest.radius} {...rest} />;
  }
)<SurfaceStyleProps>`
  ${({variant}) => {
    switch (variant) {
      case 'primary':
        return css`
          background: var(--tokens-background-primary);
        `;
      case 'secondary':
        return css`
          background: var(--tokens-background-secondary);
        `;
      case 'tertiary':
        return css`
          background: var(--tokens-background-tertiary);
        `;
      case 'overlay':
        return css`
          background: var(--tokens-background-overlay);
        `;
      default:
        return false;
    }
  }}
  ${({elevation = 'low', variant}) => {
    if (variant !== 'overlay') {
      return false;
    }
    switch (elevation) {
      case 'high':
        return css`
          box-shadow: var(--shadow-high);
        `;
      case 'medium':
        return css`
          box-shadow: var(--shadow-medium);
        `;
      default:
        return css`
          box-shadow: var(--shadow-low);
        `;
    }
  }}
` as unknown as <T extends ContainerElement = 'div'>(
  props:
    | SurfaceProps<T>
    | FlatSurfacePropsWithRenderFunction
    | OverlaySurfacePropsWithRenderFunction
) => React.ReactElement;
