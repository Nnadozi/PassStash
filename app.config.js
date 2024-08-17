export default ({ config }) => {
  return {
    ...config,
    plugins: [
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: process.env.EXPO_PUBLIC_APP_ID, 
        },
      ],
    ],
  };
};
