import type * as React from 'react';
import {css, styled} from '@yak/react';

import {Container, type ContainerProps} from '@sentry/scraps/layout/container';

export type SeparatorProps = Pick<ContainerProps, 'border' | 'margin' | 'padding'> & {
  orientation: 'horizontal' | 'vertical';
  children?: never;
} & Omit<React.HTMLAttributes<HTMLHRElement>, 'aria-orientation'>;

/**
 * Container writes the responsive padding, margin and border. The separator
 * draws its line with one border side.
 */
function SeparatorBase({
  orientation,
  border = 'primary',
  margin = '0',
  ...props
}: SeparatorProps & {className?: string; style?: React.CSSProperties}) {
  return (
    <Container
      as="hr"
      aria-orientation={orientation}
      margin={margin}
      {...(orientation === 'horizontal' ? {borderBottom: border} : {borderLeft: border})}
      {...props}
    />
  );
}

/**
 * We require a wrapper if we want to use the orientation context,
 * otherwise the styling won't work as override needs to come from the parent.
 */
export const Separator = styled(SeparatorBase)`
  flex-shrink: 0;
  align-self: stretch;

  ${({orientation}) =>
    orientation === 'horizontal'
      ? css`
          width: auto;
          height: 1px;
          border-top: none;
          border-left: none;
          border-right: none;
        `
      : css`
          width: 1px;
          height: auto;
          border-top: none;
          border-bottom: none;
          border-right: none;
        `}
`;
