import React,{useState,useEffect} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Pressable,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Button,
    Dimensions,
    Modal
} from 'react-native';
import tw from '../../../tailwindcss';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface Props {
    navigation:NavigationProp<any>;
    route:RouteProp<any, any>;
}

const AppStack_Candidate_Panel: React.FC<Props> = ({ navigation, route }) => {
    return(
        <View  style={tw`flex-1 justify-center bg-black`}>

        </View>
    );
};
export default AppStack_Candidate_Panel;