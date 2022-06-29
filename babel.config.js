/* this is babel.config.js instead of .babelrc
 * this will provide global settings for a monorepo
 * this means any sub repos (i.e. the Nexus) will use this config
 * see https://babeljs.io/docs/en/config-files#monorepos
*/

module.exports = {
  "presets": [
    '@babel/preset-react',
    "@babel/preset-env",
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-private-methods",
    "@babel/plugin-proposal-private-property-in-object",
    [ "module-resolver", { "root": ["./src"] } ]
  ]
}
