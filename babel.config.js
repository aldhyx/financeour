module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      ['inline-import', { extensions: ['.sql'] }],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@assets': './assets',
            '@env': './src/lib/env.js',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],
    ],
  };
};
