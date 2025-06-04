// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // Dotenv support for secure env variables
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      safe: false,
      allowUndefined: true,
    }],
    
    // Reanimated for gesture & animation support (required for react-native-reanimated)
    'react-native-reanimated/plugin',

    // Optional: Enable styled-components better debugging (if used)
    // 'babel-plugin-styled-components',

    // Optional: Support for absolute paths like @components, @utils, etc.
    // ['module-resolver', {
    //   root: ['./'],
    //   alias: {
    //     '@components': './components',
    //     '@screens': './screens',
    //     '@utils': './utils',
    //     '@assets': './assets',
    //   },
    // }],
  ]
};