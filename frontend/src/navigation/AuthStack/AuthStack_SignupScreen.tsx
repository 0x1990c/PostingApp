import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import tw from '../../../tailwindcss';
import auth, {FirebaseAuthTypes, firebase} from '@react-native-firebase/auth';
import countries from '../../lib/countryCode';
import {AuthStackParamList} from '.';
import {http} from '../../helpers/http';
import { useAuth } from '../AuthContext';
import { NativeModules } from 'react-native';
import Aes from 'react-native-aes-crypto';


// import admin from 'firebase-admin'; // Use ES6 import syntax for consistency
// import serviceAccount from './serviceAccountKey.json'; //  Ensurethe path is correct

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'AuthStack_SignupScreen'
>;
const flag = require('../../../assets/images/countries/mexico.png');
const regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
const initialCode = 'MY';
const AuthStack_SignupScreen: React.FC<Props> = ({navigation, route}) => {
  
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(initialCode);
  const countryNumber = countries.find(
    country => country.code === countryCode,
  ).dial_code;
  const {setPhoneNumber} = useAuth();
  const {setCountryPhonecode} = useAuth();
  
  const sendOTP = (phoneNumber: string) => {
      auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => {
          
          navigation.navigate('AuthStack_OTPScreen', {
          // confirmResult: {} as FirebaseAuthTypes.ConfirmationResult,
          confirmResult:confirmResult, 
          phoneNumber,
          countryCode,
          from: 'sign_up',

        });
        
      })
      .catch(error => {
        alert("here");
        console.log(error.message);
        alert(error.message);
      });
  };
  const onPressSignUp = () => {
    const phoneNumber = `${countryNumber}${phone}`;
    setPhoneNumber(phoneNumber);
    setCountryPhonecode(countryCode);
    if (!regexp.test(phoneNumber)) {
      alert('Please Enter Phone Number');
      return;
    }
    // sendOTP(phoneNumber);


    http.post('/user/check_user', {phoneNumber}).then(res => {
        
        if (res.data.message === 'User already exists') {
          const res_data =JSON.parse(JSON.stringify(res.data.data));
          navigation.navigate('AppStack');
          // if (res.data.data.password) {
              
          //     navigation.navigate('AuthStack_SigninScreen', {
          //       countryCode,
          //       passwordRequired: Boolean(res.data.data.password),
          //       phoneNumber,
          //     });

          // } else {
              
          //     sendOTP(phoneNumber);

          // }
        } else {
          
          sendOTP(phoneNumber);
          
        }
    });
  };
  useEffect(() => {
    if (route.params?.countryCode) {
      setCountryCode(route.params.countryCode);
    }
  }, [route.params?.countryCode]);
  const onPressCountry = () => {
    navigation.navigate('AuthStack_CountryScreen', {
      from: 'sign_up',
    });
  };
  return (
    <View  style={tw`flex-1 justify-center items-center bg-black`}>
      <View style={tw`flex-1 justify-center items-center bg-black mb-20`}>
        <Text
          style={tw`mb-10 self-stretch text-center text-[32px] font-normal text-white font-medium font-abril`}>
          Welcome
        </Text>
        
        <View
          style={tw`flex-row justify-center items-center bg-[#101214] rounded-lg`}>
          <TouchableOpacity onPress={onPressCountry} activeOpacity={0.5}>
            <Image
              width={60}
              height={30}
              source={{
                uri: `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`,
              }}
              style={tw`mx-2.5`}
            />
          </TouchableOpacity>
          <Text style={tw`text-white text-[18px] font-dm font-bold`}>
            {countryNumber}
          </Text>
          <TextInput
            style={tw`text-white rounded-lg flex-1 font-dm font-bold text-[15px]`}
            value={phone}
            placeholder="Phone Number"
            placeholderTextColor="white"
            onChangeText={setPhone}
          />
        </View>
      </View>

      <View style={tw`absolute bottom-0 w-full`}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={onPressSignUp}
          style={tw`h-20 shrink-0 rounded-t-5 bg-white flex-row justify-end items-center`}>
          <View style={tw`py-2.5 px-8 rounded-[25px] bg-[#01AE52] mr-5`}>
            <Text style={tw`text-white text-[18px] font-dm font-bold`}>
              Next
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    
  );
};

export default AuthStack_SignupScreen;
