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
import Loading from '../../components/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
    navigation:NavigationProp<any>;
    route:RouteProp<any, any>;
}

const {width} = Dimensions.get('window');
const height = (5/8)*width;

const AppStack_Candidate_Panel: React.FC<Props> = ({ navigation, route }) => {

    const {candidate} = route.params;
    const experienceArray = Object.entries(candidate.experience);  
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const go_profile = () =>{
        navigation.navigate('profile', {candidate});
    }
        
    return(
        <View  style={tw`flex-1 justify-center bg-black`}>
            <ScrollView>
                <View style={styles.header_image}>
                        <TouchableOpacity
                            style={[styles.backButton, isActive && styles.activeButton]} // Apply active style when pressed
                            onPress={() => navigation.goBack()}
                            onPressIn={() => setIsActive(true)} // Set active state to true on press in
                            onPressOut={() => setIsActive(false)} // Reset active state on press out
                        >
                            <Icon name="chevron-left" size={20} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.profile_text}>
                            Profile Name
                        </Text>
                        <View style={styles.container}>
                            <TouchableOpacity style={{width:'100%',height:'100%'}} onPress={()=>go_profile()}>
                                <Image 
                                    source={require('../../../assets/images/sea.jpg')} 
                                    style={styles.image} 
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{width:width*0.22, padding:5, backgroundColor:'#101214', borderRadius:10, justifyContent:'center', alignItems:'center', marginBottom:10}}>
                            <Text style={{color:'white', fontSize:10}}>Unverified</Text>
                        </TouchableOpacity>
                        <Text style={{color:'white', fontSize:10}}>
                            Hi My Name is {candidate.Name}
                        </Text>
                </View>
                <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'#060606', width:'84%', margin:'auto', borderRadius:10}}>
                    {experienceArray.map(([key, value]) => (
                        <View style={styles.project_detail} key={key}>
                            <View style={{ flex: 6,  justifyContent: 'center', alignItems: 'center',borderRadius:10,overflow:'hidden' }}>
                                <Text style={styles.cadidate_info_text}>
                                    {key}
                                </Text>
                            </View>
                            <View style={{ flex: 4, padding: 5, justifyContent: 'center',  }}>
                                <TouchableOpacity style={styles.button} disabled>
                                    <Text style={styles.buttonText}>
                                        {key === 'commitment_rating' ? `${value}%` : 
                                        key === 'biggest_invest' ? `$${value}` : 
                                        key === 'biggest_project' ? `$${value}`:
                                        value}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>  
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
        
        header_image: {
            alignItems: 'center',
            justifyContent: 'center',
            // flexDirection: 'row',
            overflow:'hidden',
            width:'100%',
            height:height 
        },
        container: {
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width:width*0.25,
            height:width*0.25,
            borderRadius:10,
            overflow:'hidden',
            marginBottom:8
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius:15
        },
        backButton: {
            position: 'absolute',
            top: 10, // Adjust as needed
            left: 20, // Adjust as needed
            padding: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            borderRadius: 5,
        },
        buttonText: {
            color: 'white',
            fontSize: 20,
            fontWeight:'bold'
        },
        profile_text:{
            color:'white',
            fontWeight:'bold',
            fontSize:18,
            marginBottom:10
        },
        project_detail:{
            flexDirection:'row',
            // width:Dimensions.get('window').width*0.98,
            width:'94%',
            height:65,
            backgroundColor:'#101214',
            borderRadius:14,
            marginTop:10,
            margin:'auto',
            overflow:'hidden'
        },
        button:{
            width:110,
            height:53,
            backgroundColor:'#2E3771',
            borderRadius:15,
            justifyContent:'center',
            alignItems:'center',
            
        },
        cadidate_info_text:{
            color:'white',
            fontSize:15,
            fontWeight:'bold'
        },
        activeButton: {
            // borderWidth: 2,
            // borderColor: 'grey', // Color of the square outline
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: add a slight background color
        },

});

export default AppStack_Candidate_Panel;