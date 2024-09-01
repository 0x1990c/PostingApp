import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '.';
import {View, Text, Pressable, TextInput, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tw from '../../../tailwindcss';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {http} from '../../helpers/http';
import {useAtom} from 'jotai';
import {userAtom} from '../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../components/Loading';
import { NavigationProp, RouteProp } from '@react-navigation/native';



type Props = NativeStackScreenProps<AuthStackParamList, 'AuthStack_OTPScreen'>;

// interface Props {
//   navigation: OTPScreenNavigationProp;
//   route: OTPScreenRouteProp;
// }

const AuthStack_OTPScreen: React.FC<Props> = ({navigation, route}) => {
  
  const [user, setUser] = useAtom(userAtom);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmResult, setConfirmResult] =
    useState<FirebaseAuthTypes.ConfirmationResult>(null);

  useEffect(() => {
    if (route.params?.confirmResult) {
      setConfirmResult(route.params.confirmResult);
      console.log(confirmResult);
    }
  }, [route.params]);

  const onPressConfirmCode = () => {
    setLoading(true);
    
    confirmResult
      .confirm(code)
      .then(confirmResponse => {
        
        // const data = {
        //   phone:route.params.phoneNumber,
        //   country:route.params.countryCode
        // }
        // navigation.navigate('AppStack' );
        // http.post('/user/phoneNumberRegister', data)
        // .then(res=>{

        //     if(res.data.message=="User created successfully"){
        //         navigation.navigate('AppStack' );
        //     }else{
        //         return;
        //     }

        // }).catch(error => {

        //     setLoading(false);
        //     console.log({error});

        // });  


        if (route.params.from === 'sign_up') {
          
          const data = {
            phone: route.params.phoneNumber,
            country: route.params.countryCode,
          };
          navigation.navigate('AppStack_ProfileScreen',{ data });
          // http
          //   .post('/user/signup', data)
          //   .then(res => {
          //     if (res.data.message === 'User already exists') {
          //         navigation.navigate('AuthStack_SigninScreen', {
          //           countryCode: route.params.countryCode,
          //           passwordRequired: Boolean(res.data.data.password),
          //         });
          //     } else {
          //         navigation.navigate('AppStack', {
          //           screen: 'AppStack_ProfileScreen',
          //         });
          //       // navigation.navigate('AuthStack_SigninScreen');
          //     }
          //     // AsyncStorage.setItem('authStatus', JSON.stringify(res.data.data));
          //     // AsyncStorage.setItem('isLoggedIn', 'true');
          //     setUser(res.data.data);
          //     setLoading(false);
          //   })
          //   .catch(error => {
          //     setLoading(false);
          //     console.log({error});
          //   });
        } else if (route.params.from === 'profile') {
          alert('profile');
          const data = {
            type: route.params.type,
            value: route.params.value,
          };
          http
            .patch(`/user/update/${user._id}`, data)
            .then(response => {
              if (response.data.message === 'Phone number already exists') {
                alert('Phone number already exists');
              } else {
                if (response.data.data.password) {
                  AsyncStorage.setItem('passwordRequired', 'true');
                }
                setUser(response.data.data);
              }
              setLoading(false);
              navigation.goBack();
            })
            .catch(error => {
              setLoading(false);
              console.log({error});
            });
        }

        
      })
      .catch(error => {
        alert(error);
        setLoading(false);
        alert(error.message);
      });
  };
  if (loading) return <Loading />;
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Text
        style={tw`mb-10 self-stretch text-center text-[32px] font-normal text-white font-medium font-abril`}>
        Verification Code
      </Text>
      <View style={tw`flex-row w-full justify-center `}>
        <View
          style={tw`flex-row items-center h-15 w-3/4 bg-white rounded-lg mt-10`}>
          <TextInput
            style={tw`bg-white rounded-lg flex-1 font-dm font-bold text-[18px] text-center`}
            value={code}
            placeholder="Code"
            onChangeText={setCode}
          />
        </View>
      </View>
      <Text style={tw`text-center mt-3 text-white text-xs font-bold mb-20`}>
        Please enter your code here to sign in
      </Text>
      <View style={tw`absolute bottom-0 w-full`}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={onPressConfirmCode}
          style={tw`h-20 shrink-0 rounded-t-5 bg-white flex-row justify-end items-center`}>
          <View style={tw`py-2.5 px-8 rounded-[13px] bg-[#FF5C00] mr-5`}>
            <Text style={tw`text-white text-[18px] font-dm font-bold`}>
              sign in
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
      
  );
};

export default AuthStack_OTPScreen;
