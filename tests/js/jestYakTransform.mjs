// @ts-nocheck
/* eslint-disable import/no-nodejs-modules */
import {Buffer} from 'node:buffer';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

import {createTransformer} from '@swc/jest';

// A change to this file changes the cache key, so Jest does not reuse old output.
const VERSION = createHash('sha1')
  .update(readFileSync(new URL(import.meta.url)))
  .digest('hex')
  .slice(0, 8);

// yak adds the CSS of each module as an `import "data:text/css;base64,…"`.
// Jest cannot load these imports, so this transformer removes them and adds the
// CSS to the test document, the same way the bundler adds it to the page.
const DATA_CSS = /require\("data:text\/css;base64,([A-Za-z0-9+/=]*)"\);?/g;

/** Splits a style sheet into its top-level rules. */
function splitRules(css) {
  const rules = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') {
      depth++;
    } else if (css[i] === '}' && --depth === 0) {
      rules.push(css.slice(start, i + 1).trim());
      start = i + 1;
    }
  }
  return rules.filter(Boolean);
}

const yakTransformer = {
  createTransformer(options) {
    const transformer = createTransformer(options);
    return {
      ...transformer,
      getCacheKey(source, filename, config) {
        return `yak-css-${VERSION}-${transformer.getCacheKey(source, filename, config)}`;
      },
      process(source, filename, config) {
        const result = transformer.process(source, filename, config);
        const styles = [];
        const code = result.code.replace(DATA_CSS, (_match, base64) => {
          styles.push(Buffer.from(base64, 'base64').toString());
          return 'void 0;';
        });
        if (styles.length === 0) {
          return result;
        }
        return {
          ...result,
          code: `${code}
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  document.head.appendChild(style);
  // Insert rule by rule, like Emotion, so one value that jsdom cannot parse
  // does not stop the others.
  for (const rule of ${JSON.stringify(splitRules(styles.join('\n')))}) {
    try {
      style.sheet.insertRule(rule, style.sheet.cssRules.length);
    } catch {}
  }
}`,
        };
      },
    };
  },
};

// Jest loads transformer modules through their default export.
// eslint-disable-next-line @sentry/no-default-exports
export default yakTransformer;
