/**
 * Generates the yak styles of the layout and text components:
 * static/packages/scraps/src/layout/generatedStyles.tsx and
 * static/packages/scraps/src/text/generatedStyles.tsx.
 *
 * Run: pnpm gen:yak-layout
 *
 * Each prop gets static classes for its token and keyword values, and one
 * variable for any other value. A responsive value applies its first key at
 * every size and adds one rule for each later breakpoint key, as `rc()` does.
 * So a responsive value sets one variable only for each key that it uses.
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

// Must match theme.container and theme.breakpoints.
const CONTAINER_BREAKPOINTS = [
  ['3xs', 320],
  ['2xs', 384],
  ['xs', 448],
  ['sm', 512],
  ['md', 576],
  ['lg', 640],
  ['xl', 768],
  ['2xl', 896],
  ['3xl', 1024],
  ['4xl', 1152],
  ['5xl', 1280],
] as const;
const SCREEN_BREAKPOINTS = [
  ['2xs', 0],
  ['xs', 500],
  ['sm', 800],
  ['md', 992],
  ['lg', 1200],
  ['xl', 1440],
  ['2xl', 2560],
] as const;
const BREAKPOINT_RULES: Array<[key: string, query: string]> = [
  ...CONTAINER_BREAKPOINTS.map(([key, width]): [string, string] => [
    key,
    `@container (min-width: ${width}px)`,
  ]),
  ...SCREEN_BREAKPOINTS.map(([key, width]): [string, string] => [
    `screen:${key}`,
    `@media (min-width: ${width}px)`,
  ]),
];

type Values = Record<string, string>;

const same = (...values: string[]): Values =>
  Object.fromEntries(values.map(value => [value, value]));
const isIdentifier = (key: string) => /^[A-Za-z_]\w*$/.test(key);
// A token reference from tokens.yak.ts, e.g. `${space.md}` or `${space['2xs']}`.
const tokens = (group: string, keys: string[]): Values =>
  Object.fromEntries(
    keys.map(key => [
      key,
      '${' + (isIdentifier(key) ? `${group}.${key}` : `${group}['${key}']`) + '}',
    ])
  );

const SPACE = tokens('space', ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']);
const MARGIN = {...SPACE, auto: 'auto'};
const RADIUS = tokens('radius', [
  '0',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'full',
]);
const FONT_SIZE = tokens('fontSize', ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']);
const LINE_HEIGHT = tokens('lineHeight', [
  'compressed',
  'default',
  'comfortable',
  'fixed',
]);
const OVERFLOW = same('visible', 'hidden', 'scroll', 'auto');
const BORDER_COLORS: Values = {
  primary: 'var(--tokens-border-primary)',
  secondary: 'var(--tokens-border-secondary)',
  muted: 'var(--tokens-border-secondary)',
  accent: 'var(--tokens-border-accent-vibrant)',
  danger: 'var(--tokens-border-danger-vibrant)',
  promotion: 'var(--tokens-border-promotion-vibrant)',
  success: 'var(--tokens-border-success-vibrant)',
  warning: 'var(--tokens-border-warning-vibrant)',
};
const BORDER = same('none', ...Object.keys(BORDER_COLORS));
const CONTENT = {
  start: 'start',
  end: 'end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  stretch: 'stretch',
};

interface Prop {
  /** The CSS property. */
  css: string;
  name: string;
  /** The value of a prop value `v` that has no static class. */
  value: (v: string) => string;
  /** The prop takes no responsive value. */
  plainOnly?: boolean;
  /** Static classes: prop value -> CSS value. */
  values?: Values;
}

const raw = (v: string) => v;
const spacing = (v: string) => `getSpacing(${v}, undefined, theme)`;
const margin = (v: string) => `getMargin(${v}, undefined, theme)`;
const border = (v: string) => `getBorderVariable(${v})`;
const prop = (name: string, css: string, value = raw, values?: Values): Prop => ({
  name,
  css,
  value,
  values,
});

const CONTAINER: Prop[] = [
  {
    ...prop(
      'containerType',
      'container-type',
      raw,
      same('inline-size', 'size', 'normal')
    ),
    plainOnly: true,
  },
  prop(
    'display',
    'display',
    raw,
    same(
      'flex',
      'inline-flex',
      'none',
      'block',
      'inline-block',
      'inline',
      'grid',
      'inline-grid',
      'contents'
    )
  ),
  prop(
    'position',
    'position',
    raw,
    same('static', 'relative', 'absolute', 'fixed', 'sticky')
  ),
  prop('inset', 'inset', raw, same('0')),
  prop('top', 'top', raw, same('0')),
  prop('bottom', 'bottom', raw, same('0')),
  prop('left', 'left', raw, same('0')),
  prop('right', 'right', raw, same('0')),
  prop('overflow', 'overflow', raw, OVERFLOW),
  prop('overflowX', 'overflow-x', raw, OVERFLOW),
  prop('overflowY', 'overflow-y', raw, OVERFLOW),
  prop('overscrollBehavior', 'overscroll-behavior'),
  prop('pointerEvents', 'pointer-events', raw, same('none', 'auto')),
  prop(
    'cursor',
    'cursor',
    raw,
    same('pointer', 'default', 'not-allowed', 'text', 'move', 'help', 'grab')
  ),
  prop('contain', 'contain'),
  prop('padding', 'padding', spacing, SPACE),
  prop('paddingTop', 'padding-top', spacing, SPACE),
  prop('paddingBottom', 'padding-bottom', spacing, SPACE),
  prop('paddingLeft', 'padding-left', spacing, SPACE),
  prop('paddingRight', 'padding-right', spacing, SPACE),
  prop('margin', 'margin', margin, MARGIN),
  prop('marginTop', 'margin-top', margin, MARGIN),
  prop('marginBottom', 'margin-bottom', margin, MARGIN),
  prop('marginLeft', 'margin-left', margin, MARGIN),
  prop('marginRight', 'margin-right', margin, MARGIN),
  prop(
    'background',
    'background',
    v => `getBackground(${v})`,
    Object.fromEntries(
      ['primary', 'secondary', 'tertiary'].map(k => [k, `var(--tokens-background-${k})`])
    )
  ),
  prop('radius', 'border-radius', v => `getRadius(${v}, undefined, theme)`, RADIUS),
  prop('width', 'width', raw, same('100%', 'auto', 'max-content', 'fit-content')),
  prop('minWidth', 'min-width', raw, same('0', '100%')),
  prop('maxWidth', 'max-width', raw, same('100%', 'none')),
  prop('height', 'height', raw, same('100%', 'auto')),
  prop('minHeight', 'min-height', raw, same('0', '100%')),
  prop('maxHeight', 'max-height', raw, same('100%', 'none')),
  prop('area', 'grid-area'),
  prop('row', 'grid-row'),
  prop('column', 'grid-column'),
  prop('order', 'order'),
  prop('flex', 'flex', raw, same('1', 'none', 'auto', '1 1 0', '1 1 auto', '0 0 auto')),
  prop('flexGrow', 'flex-grow', raw, same('0', '1')),
  prop('flexShrink', 'flex-shrink', raw, same('0', '1')),
  prop('flexBasis', 'flex-basis'),
  prop(
    'alignSelf',
    'align-self',
    raw,
    same(
      'auto',
      'start',
      'end',
      'center',
      'stretch',
      'baseline',
      'flex-start',
      'flex-end'
    )
  ),
  prop(
    'justifySelf',
    'justify-self',
    raw,
    same('auto', 'start', 'end', 'center', 'stretch', 'flex-start', 'flex-end')
  ),
  prop('border', 'border', border, BORDER),
  prop('borderTop', 'border-top', border, BORDER),
  prop('borderBottom', 'border-bottom', border, BORDER),
  prop('borderLeft', 'border-left', border, BORDER),
  prop('borderRight', 'border-right', border, BORDER),
  prop('visibility', 'visibility', raw, same('visible', 'hidden', 'collapse')),
  prop(
    'whiteSpace',
    'white-space',
    raw,
    same('nowrap', 'normal', 'pre', 'pre-line', 'pre-wrap', 'break-spaces')
  ),
];

const FLEX: Prop[] = [
  prop('gap', 'gap', spacing, SPACE),
  prop(
    'direction',
    'flex-direction',
    raw,
    same('row', 'row-reverse', 'column', 'column-reverse')
  ),
  prop('wrap', 'flex-wrap', raw, same('nowrap', 'wrap', 'wrap-reverse')),
  prop('justify', 'justify-content', v => `flexJustify(${v})`, {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
    left: 'left',
    right: 'right',
  }),
  prop('align', 'align-items', v => `flexAlign(${v})`, {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    baseline: 'baseline',
    stretch: 'stretch',
  }),
];

const GRID: Prop[] = [
  prop('gap', 'gap', spacing, SPACE),
  prop('columns', 'grid-template-columns'),
  prop('rows', 'grid-template-rows'),
  prop('areas', 'grid-template-areas'),
  prop('autoColumns', 'grid-auto-columns'),
  prop('autoRows', 'grid-auto-rows'),
  prop('flow', 'grid-auto-flow'),
  prop('justify', 'justify-content', v => `gridContent(${v})`, CONTENT),
  prop('alignContent', 'align-content', v => `gridContent(${v})`, CONTENT),
  prop(
    'align',
    'align-items',
    raw,
    same('start', 'end', 'center', 'baseline', 'stretch')
  ),
  prop('justifyItems', 'justify-items', raw, same('start', 'end', 'center', 'stretch')),
];

const TEXT: Prop[] = [
  prop('size', 'font-size', v => `getFontSize(${v}, theme)`, FONT_SIZE),
  prop('density', 'line-height', v => `getLineHeight(${v}, theme)`, LINE_HEIGHT),
  prop('display', 'display', raw, same('inline', 'block', 'inline-block', 'none')),
  prop('align', 'text-align', raw, same('left', 'center', 'right', 'justify')),
];

const capitalize = (text: string) => text.slice(0, 1).toUpperCase() + text.slice(1);
const mixinName = (name: string, key: string) =>
  name +
  'At' +
  (key.startsWith('screen:')
    ? 'Screen' + key.slice(7, 8).toUpperCase() + key.slice(8)
    : key.slice(0, 1).toUpperCase() + key.slice(1));

/** The body of a static class. A border token sets width, style and color. */
function staticBody(p: Prop, key: string, value: string): string {
  if (p.value === border) {
    return key === 'none'
      ? `${p.css}-width: 0;\n${p.css}-style: none;`
      : `${p.css}-width: 1px;\n${p.css}-style: solid;\n${p.css}-color: ${BORDER_COLORS[key]};`;
  }
  return `${p.css}: ${value};`;
}

/** The mixins and the atoms() arguments of one component. */
function generate(prefix: string, type: string, props: Prop[]) {
  const mixins: string[] = [];
  const atoms: string[] = [];
  for (const p of props) {
    const usesTheme = p.value('v').includes('theme');
    const args = usesTheme ? `{${p.name}, theme}` : `{${p.name}}`;
    const plainName = `${prefix}${capitalize(p.name)}Styles`;
    const base = p.plainOnly ? p.name : `baseValue(${p.name})`;
    mixins.push(
      `const ${plainName} = css<${type}>\`\n  ${p.css}: \${(${args}) => ${p.value(base)}};\n\`;`
    );

    // The plain value, or the first key of a responsive value.
    const test = p.plainOnly ? `p.${p.name}` : `baseValue(p.${p.name})`;
    let choice = plainName;
    for (const [key, value] of Object.entries(p.values ?? {}).reverse()) {
      choice = `${test} === '${key}' ? css<${type}>\`${staticBody(p, key, value)}\` : ${choice}`;
    }
    atoms.push(`p.${p.name} !== undefined && (${choice})`);
    if (p.plainOnly) {
      continue;
    }

    // One rule for each breakpoint key after the first.
    const keys: string[] = [];
    for (const [key, query] of BREAKPOINT_RULES) {
      const name = mixinName(prefix + capitalize(p.name), key);
      mixins.push(
        `const ${name} = css<${type}>\`\n  ${query} {\n    ${p.css}: \${(${args}) => ${p.value(`responsiveAt(${p.name}, '${key}')`)}};\n  }\n\`;`
      );
      keys.push(`laterKey(p.${p.name}, '${key}') && ${name}`);
    }
    atoms.push(`isResponsive(p.${p.name}) && atoms(${keys.join(', ')})`);
  }
  return {
    mixins: mixins.join('\n\n'),
    template: `  \${p => atoms(${atoms.join(',\n')})}`,
  };
}

const HEADER = `// AUTOGENERATED BY scripts/genYakLayoutStyles.ts (pnpm gen:yak-layout)
// DO NOT EDIT THIS FILE MANUALLY
`;

function component(name: string, styled: string, type: string, props: Prop[]) {
  const {mixins, template} = generate(
    name.slice(0, 1).toLowerCase() + name.slice(1),
    type,
    props
  );
  return `// ${name}\n\n${mixins}\n\nexport const Styled${name} = ${styled}\`\n${template}\n\`;`;
}

function layoutFile() {
  return `${HEADER}
import {atoms, css, styled} from '@yak/react';

import type {ContainerLayoutProps} from './container';
import {ContainerBase} from './containerBase';
import type {FlexLayoutProps, FlexProps} from './flex';
import type {GridLayoutProps, GridProps} from './grid';
import {
  baseValue,
  flexAlign,
  flexJustify,
  getBackground,
  getBorderVariable,
  getMargin,
  getRadius,
  getSpacing,
  gridContent,
  isResponsive,
  laterKey,
  responsiveAt,
} from './styles';
import {radius, space} from './tokens.yak';

${component('Container', 'styled(ContainerBase)', 'ContainerLayoutProps', CONTAINER)}

${component(
  'Flex',
  `styled(StyledContainer).attrs<FlexProps<any>>(({display}) => ({display: display ?? 'flex'}))`,
  'FlexLayoutProps',
  FLEX
)}

${component(
  'Grid',
  `styled(StyledContainer).attrs<GridProps<any>>(({display}) => ({display: display ?? 'grid'}))`,
  'GridLayoutProps',
  GRID
)}
`;
}

function textFile() {
  return `${HEADER}
import {atoms, css, styled} from '@yak/react';

import {
  baseValue,
  isResponsive,
  laterKey,
  responsiveAt,
} from '@sentry/scraps/layout/styles';
import {fontSize, lineHeight} from '@sentry/scraps/layout/tokens.yak';

import {getFontSize, getLineHeight, type TextLayoutProps} from './styles';
import {TextElementBase} from './textElementBase';

${component('TextElement', 'styled(TextElementBase)', 'TextLayoutProps', TEXT)}
`;
}

const files = {
  'static/packages/scraps/src/layout/generatedStyles.tsx': layoutFile(),
  'static/packages/scraps/src/text/generatedStyles.tsx': textFile(),
};
for (const [file, source] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, file), source);
}
execFileSync('pnpm', ['exec', 'oxfmt', ...Object.keys(files)], {
  cwd: root,
  stdio: 'inherit',
});
console.log(`Wrote ${Object.keys(files).join(', ')}`);
