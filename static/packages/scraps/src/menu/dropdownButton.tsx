import type * as React from 'react';
import {IconChevron} from '@sentry/icons/chevron';
import {css, styled} from '@yak/react';
import type {DistributedOmit} from 'type-fest';

import type {ButtonProps} from '@sentry/scraps/button';
import {Button} from '@sentry/scraps/button';
import {useResponsivePropValue} from '@sentry/scraps/layout';
import {useSizeContext} from '@sentry/scraps/sizeContext';
// yak inlines static tokens into the CSS at build time. A theme token becomes a CSS variable.
// oxlint-disable-next-line @sentry/scraps/no-token-import
import {size as sizeTokens} from '@sentry/scraps/tokens/size';
// oxlint-disable-next-line @sentry/scraps/no-token-import
import {typography} from '@sentry/scraps/tokens/typography';

export type DropdownButtonProps = DistributedOmit<ButtonProps, 'type' | 'prefix'> & {
  /**
   * Whether or not the button should render as open
   */
  isOpen?: boolean;
  /**
   * The fixed prefix text to show in the button eg: 'Sort By'
   */
  prefix?: React.ReactNode;
  /**
   * Should a chevron icon be shown?
   */
  showChevron?: boolean;
};

export function DropdownButton({
  children,
  prefix,
  size: explicitSize,
  isOpen = false,
  showChevron = true,
  disabled = false,
  ref,
  onClick,
  ...props
}: DropdownButtonProps) {
  const contextSize = useSizeContext();
  const size = useResponsivePropValue(explicitSize ?? contextSize ?? 'md');

  return (
    <StyledButton
      aria-haspopup="true"
      aria-expanded={isOpen}
      $hasPrefix={!!prefix}
      $flat={isOpen || disabled}
      disabled={disabled}
      size={size}
      ref={ref}
      {...props}
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.(event);
      }}
    >
      {prefix && <LabelText>{prefix}</LabelText>}
      {children}
      {showChevron && (
        <ChevronWrap>
          <IconChevron
            variant={(props.variant ?? 'secondary') === 'secondary' ? 'muted' : undefined}
            direction={isOpen ? 'up' : 'down'}
            size={size === 'zero' || size === 'xs' ? 'xs' : 'sm'}
          />
        </ChevronWrap>
      )}
    </StyledButton>
  );
}

const ChevronWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: ${sizeTokens.space.xs};
  flex-shrink: 0;
`;

const StyledButton = styled(Button)<{$flat: boolean; $hasPrefix: boolean}>`
  position: relative;
  max-width: 100%;

  ${({$flat}) =>
    $flat &&
    css`
      box-shadow: none;
    `}
  ${({$hasPrefix}) =>
    $hasPrefix &&
    css`
      font-weight: ${typography.font.weight.sans.regular};
    `}
`;

const LabelText = styled.span`
  &:after {
    content: ':';
  }

  font-weight: ${typography.font.weight.sans.medium};
  padding-right: ${sizeTokens.space.sm};
`;
