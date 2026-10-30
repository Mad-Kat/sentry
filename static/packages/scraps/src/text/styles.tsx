import {valueAt, type Responsive, type ResponsiveKey} from '@sentry/scraps/layout/styles';
import type {HeadingSize, TextSize, Theme} from '@sentry/scraps/theme';

import type {BaseTextProps} from './text';

/**
 * The responsive props of Text and Heading.
 */
export interface TextLayoutProps {
  align?: Responsive<'left' | 'center' | 'right' | 'justify'>;
  density?: Responsive<keyof Theme['font']['lineHeight']>;
  display?: Responsive<'inline' | 'block' | 'inline-block' | 'none'>;
  size?: Responsive<TextSize | HeadingSize>;
}

export function getTextDecoration(p: Pick<BaseTextProps, 'strikethrough' | 'underline'>) {
  const decorations: string[] = [];
  if (p.strikethrough) {
    decorations.push('line-through');
  }
  if (p.underline) {
    decorations.push('underline');

    if (p.underline === 'dotted') {
      decorations.push('dotted');
    }
  }
  return decorations.join(' ');
}

export function getLineHeight(
  density: keyof Theme['font']['lineHeight'] | undefined,
  theme: Theme
): string | undefined {
  if (density === undefined) {
    return undefined;
  }

  return theme.font.lineHeight[density].toString();
}

export function getFontSize(
  size: TextSize | HeadingSize | undefined,
  theme: Theme
): string | undefined {
  if (size === undefined) {
    return undefined;
  }

  return theme.font.size[size];
}

export function getTextColor(
  variant: BaseTextProps['variant'],
  theme: Theme
): string | undefined {
  if (variant === 'inherit') {
    return undefined;
  }
  return theme.tokens.content[variant === 'muted' ? 'secondary' : (variant ?? 'primary')];
}

export function getFontVariantNumeric(p: Pick<BaseTextProps, 'fraction' | 'tabular'>) {
  return [
    p.tabular ? 'tabular-nums' : undefined,
    p.fraction ? 'diagonal-fractions' : undefined,
  ]
    .filter(Boolean)
    .join(' ');
}

export function fontSizeAt(
  size: Responsive<TextSize | HeadingSize> | undefined,
  key: ResponsiveKey,
  theme: Theme
): string {
  const value = valueAt(size, key);
  return value === 'initial' ? value : (getFontSize(value, theme) ?? 'initial');
}

export function lineHeightAt(
  density: Responsive<keyof Theme['font']['lineHeight']> | undefined,
  key: ResponsiveKey,
  theme: Theme
): string {
  const value = valueAt(density, key);
  return value === 'initial' ? value : (getLineHeight(value, theme) ?? 'initial');
}
