export default ({ config }) => ({
  ...config,
  version: "1.0.0",  
  runtimeVersion: "2.0.0",  
  plugins: [
    ...(config.plugins || []),
    ['react-native-google-mobile-ads', { androidAppId: process.env.EXPO_PUBLIC_APP_ID }],
  ],
});
