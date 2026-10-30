import type * as React from 'react';
import isPropValid from '@emotion/is-prop-valid';

import type {TextLayoutProps} from './styles';

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
export function TextElementBase({
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
