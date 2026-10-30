// yak reads this file at build time, so the static classes of the layout and
// text components can use token values. yak cannot read the `.tsx` token
// files, so this file repeats their values. tokens.spec.ts checks that they match the theme.

export const space = {
  '0': '0px',
  '2xs': '2px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
};

export const radius = {
  '0': '0px',
  '2xs': '3px',
  xs: '4px',
  sm: '5px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '999px',
};

export const fontSize = {
  xs: '11px',
  sm: '12px',
  md: '14px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
};

export const lineHeight = {
  compressed: 1,
  default: 1.2,
  comfortable: 1.4,
  fixed: '1rem',
};
