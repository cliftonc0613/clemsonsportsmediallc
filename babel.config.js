/**
 * Babel Configuration
 *
 * Forces classic JSX transform for compatibility with WordPress
 * that doesn't provide the automatic react-jsx-runtime.
 */

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        '@wordpress/babel-preset-default',
        {
          // Use classic runtime (React.createElement) instead of automatic (jsx-runtime)
          // This ensures compatibility with all WordPress versions
        },
      ],
    ],
    plugins: [
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'classic',
          pragma: 'wp.element.createElement',
          pragmaFrag: 'wp.element.Fragment',
        },
      ],
    ],
  };
};
