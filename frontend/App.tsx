import React from 'react';
import AppNavigator from './src/AppNavigator';
import {StripeProvider} from '@stripe/stripe-react-native';
import CurrentLocationProvider from './src/components/CurrentLocationProvider';
import {registerTranslation, en} from 'react-native-paper-dates';

// import { initializeApp } from '@react-native-firebase/app';
// import {getInstallations} from 'firebase/installations';

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const installations = getInstallations(app);

const App = () => {


  registerTranslation('en', en);
  return (
    <StripeProvider publishableKey="pk_test_51LjXTGDUAnVtYaoEreu5zq1DQ2LC8mSqawQnoBZS9u3xPhF0wBOTJgYqIpSemjzMFWJrtcgSr4G89q9rnqM72Ina00xlYfUt2q">
      <CurrentLocationProvider>
        <AppNavigator />
      </CurrentLocationProvider>
    </StripeProvider>
  );
};
export default App;
