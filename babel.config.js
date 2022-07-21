module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          browsers: ['>0.25%', 'not dead', 'not ie 11', 'not op_mini all'],
        },
      },
    ],
  ],
  env: {
    production: {
      ignore: ['**/*.test.*', '**/__test__', '**/__mocks__'],
    },
  },
  plugins: [
    ['@babel/plugin-syntax-dynamic-import'],
    ['@babel/transform-runtime'],
  ],
};
