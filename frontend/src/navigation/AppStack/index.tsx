import React from 'react';
import AppStack_Post_Project from './AppStack_Post_Project';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {RootStackParamList} from 'RootNavigator';
import AuthStack from '../../navigation/AuthStack';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import AuthStack_OTPScreen from '../AuthStack/AuthStack_OTPScreen';
import AppStack_Project_List from './AppStack_Project_List';
import AppStack_Detail_Project from './AppStack_Detail_Project';
import AppStack_Candidate_Panel from './AppStack_Candidate_Panel';
import AppStack_Candidates_In_Project from './AppStack_Candidates_In_Project';
import AppStack_Candidate_Detail from './AppStack_Candidate_Detail';
import AppStack_Profile from './AppStack_Profile';
import AppStack_ProfileScreen from './AppStack_ProfileScreen';




export type AppStackParamList = {
  AppStack_HomePageScreen?: {
    searchResult: {
      latitude: number;
      longitude: number;
      formatted_address: string;
      icon: string;
    };
  };
  AppStack_HotelDetailScreen: {
    item: any;
  };
  AppStack_SpotDetailScreen: {
    item: any;
  };
  AppStack_HotelSearch: undefined;
  AppStack_LocationSearch: undefined;
  AppStack_PriceFilterScreen: undefined;
  AppStack_ProfileScreen: {
    countryCode: string;
  };
  AuthStack_OTPScreen: {
    confirmResult: FirebaseAuthTypes.ConfirmationResult;
    phoneNumber?: string;
    countryCode?: string;
    from?: string;
    type?: string;
    value?: string;
  };
  AuthStack_CountryScreen: {
    from: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'AppStack'>;
const Stack = createNativeStackNavigator<AppStackParamList>();
const AppStack: React.FC<Props> = ({navigation, route}) => {
  return (
    <Stack.Navigator initialRouteName="AppStack_Project_List">
            
      <Stack.Screen
        name="AppStack_Post_Project"
        component={AppStack_Post_Project}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppStack_Project_List"
        component={AppStack_Project_List}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppStack_Detail_Project"
        component={AppStack_Detail_Project}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="AppStack_Candidate_Panel"
        component={AppStack_Candidate_Panel}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="candidates_in_project"
        component={AppStack_Candidates_In_Project}
        options={{headerShown: false}}
      />      
      <Stack.Screen
        name="candidate_detail"
        component={AppStack_Candidate_Detail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="profile"
        component={AppStack_Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppStack_ProfileScreen"
        component={AppStack_ProfileScreen}
        options={{headerShown: false}}
      />  
       {/* <Stack.Screen
        name="AuthStack"
        component={AuthStack}
        options={{headerShown: false}}
      />        */}
    </Stack.Navigator>
  );
};

export default AppStack;
