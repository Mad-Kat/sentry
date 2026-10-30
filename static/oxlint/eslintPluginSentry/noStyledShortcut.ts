import {defineRule} from '@oxlint/plugins';

export const noStyledShortcut = defineRule({
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Disallow styled-components shorthand (e.g. styled.div) — use styled('div') instead",
    },
    fixable: 'code',
    schema: [],
    messages: {
      noShorthand:
        'Do not use the shorthand/member expression style of styled. Use the function call syntax instead: styled({{element}}).',
    },
  },
  create(context) {
    // yak compiles styled.div at build time and types it by element.
    let isYakStyled = false;

    return {
      ImportDeclaration(node) {
        if (
          node.source.value === '@yak/react' &&
          node.specifiers.some(
            specifier =>
              specifier.type === 'ImportSpecifier' && specifier.local.name === 'styled'
          )
        ) {
          isYakStyled = true;
        }
      },
      TaggedTemplateExpression(node) {
        const {tag} = node;
        if (
          isYakStyled ||
          tag.type !== 'MemberExpression' ||
          tag.object.type !== 'Identifier' ||
          tag.object.name !== 'styled' ||
          tag.property.type !== 'Identifier'
        ) {
          return;
        }

        const element = tag.property.name;

        context.report({
          node,
          messageId: 'noShorthand',
          data: {element},
          fix(fixer) {
            return fixer.replaceText(tag, `styled('${element}')`);
          },
        });
      },
    };
  },
});
