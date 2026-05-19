module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@app': './src/app',
          '@assets': './src/assets',
          '@atomic': './src/atomic',
          '@atomic-samples': './src/atomic-samples',
        },
      },
    ],
  ],
};
