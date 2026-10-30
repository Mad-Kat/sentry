import type {LocationDescriptor} from 'history';
import type {DistributedOmit} from 'type-fest';

import {Flex, useResponsivePropValue} from '@sentry/scraps/layout';
import {useSizeContext} from '@sentry/scraps/sizeContext';
import {Tooltip} from '@sentry/scraps/tooltip';

import {IconDefaultsProvider} from 'sentry/icons/useIconDefaults';

import {ButtonElement, LinkButtonTag} from './buttonElement';
import {DO_NOT_USE_BUTTON_ICON_SIZES as BUTTON_ICON_SIZES} from './styles';
import type {ButtonSize, DO_NOT_USE_LinkButtonProps as LinkButtonProps} from './types';
import {useButtonFunctionality} from './useButtonFunctionality';

export type {LinkButtonProps};

export type ResolvedLinkButtonProps = DistributedOmit<LinkButtonProps, 'size'> & {
  size: ButtonSize;
};

export function LinkButton({
  disabled,
  tooltipProps,
  size: explicitSize,
  ...props
}: LinkButtonProps) {
  const contextSize = useSizeContext();
  const size = useResponsivePropValue(explicitSize ?? contextSize ?? 'md');
  const {hasChildren, accessibleLabel} = useButtonFunctionality({
    ...props,
    disabled,
  });

  return (
    <Tooltip
      skipWrapper
      {...tooltipProps}
      title={tooltipProps?.title}
      disabled={!tooltipProps?.title}
    >
      <ButtonElement
        component={LinkButtonTag}
        aria-label={accessibleLabel}
        aria-disabled={disabled}
        disabled={disabled}
        $size={size}
        {...props}
        shapeVariant={hasChildren ? 'rectangular' : 'square'}
        href={disabled ? undefined : 'href' in props ? props.href : undefined}
        to={
          disabled
            ? // Disabled links are just text - this should have never been supported in the first place.
              // We cast it to the correct value to avoid a rightfully raised type error.
              (undefined as unknown as LocationDescriptor)
            : 'to' in props
              ? props.to
              : // Disabled links are just text - this should have never been supported in the first place.
                // We cast it to the correct value to avoid a rightfully raised type error.
                (undefined as unknown as LocationDescriptor)
        }
      >
        <Flex
          as="span"
          align="center"
          justify="center"
          minWidth="0"
          height="100%"
          whiteSpace="nowrap"
        >
          {props.icon && (
            <Flex
              as="span"
              align="center"
              flexShrink={0}
              marginRight={
                hasChildren ? (size === 'xs' || size === 'zero' ? 'sm' : 'md') : undefined
              }
            >
              <IconDefaultsProvider size={BUTTON_ICON_SIZES[size]}>
                {props.icon}
              </IconDefaultsProvider>
            </Flex>
          )}
          {props.children}
        </Flex>
      </ButtonElement>
    </Tooltip>
  );
}
