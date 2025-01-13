/* eslint-disable import/no-anonymous-default-export */
/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '~([a-zA-Z0-9]+)/(.*)$',
    '',
    '^~/utils/(.*)$',
    '^~/components/(.*)$',
    '^~/(.*)$',
    '^src/(.*)$',
    '^[./]',
  ],
  importOrderParserPlugins: [
    'typescript',
    'jsx',
    'decorators-legacy',
    'explicitResourceManagement',
  ],
  importOrderTypeScriptVersion: '5.2.2',
  singleQuote: true,
  semi: false,
}
