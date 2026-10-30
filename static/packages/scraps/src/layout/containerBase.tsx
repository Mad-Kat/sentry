import type * as React from 'react';
import {useMemo, useRef} from 'react';
import isPropValid from '@emotion/is-prop-valid';
import {mergeRefs} from '@react-aria/utils';

import type {
  ContainerElement,
  ContainerProps,
  ContainerPropsWithRenderFunction,
} from './container';
import {ContainerQueryProvider} from './styles';

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

export function ContainerBase<T extends ContainerElement = 'div'>(
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
