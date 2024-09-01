import React,{useState} from 'react';
import {
    Modal,
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
    
} from 'react-native';
import tw from '../../../tailwindcss';
import { useAuth } from '../AuthContext';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { http } from '../../helpers/http';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
    navigation:NavigationProp<any>;
    route:RouteProp<any, any>;
}
const {width} = Dimensions.get('window');
const height = (4/7)*width;

const AppStack_Detail_Project: React.FC<Props> = ({navigation, route}) => {

    const {phoneNumber} = useAuth();
    const {countryPhoneCode} = useAuth();
    
    const {item, from} = route.params;
    const navigations = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [applybutton, setApplyButton] = useState(false);
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    useFocusEffect(
        React.useCallback(()=>{
            if(item.project_candidates.includes(phoneNumber)){
                setApplyButton(true);
            }
        },[navigations])
    );

    const applyProject = () =>{
        const project = item._id;
        if(item.phoneNumber == phoneNumber){
            alert('this is your project');
            return;
        }
        http.post('/task/apply_project',{phoneNumber, project}).then(res=>{
            
            if(res.data.message == "no candidate"){
                setModalVisible(true);
            }else{
                setApplyButton(true);
            }
        });
    };

    const register_profile = () =>{
        const data = {
            phone: phoneNumber,
            country: countryPhoneCode,
            item:item
        };
        navigation.navigate('profile',{data});
        setModalVisible(false);
    }
        
    //-----------------------------------------
    const buttons = Array.from({ length: item.available }, (_, i) => `seat ${i + 1}`);
    const [isActive, setIsActive] = useState(false); 
    return(
        <View style={tw`flex-1 justify-center bg-black`}>
            
            <ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>after registering your profile, apply again please!</Text>
                        <View style={{flexDirection:'row'}}>
                            <Button title="Register" onPress={register_profile}/>
                            <View style={styles.buttonSpacing} />  
                            <Button title="Close" onPress={handleCloseModal} />  
                        </View>
                        
                    </View>
                </Modal>
                <View style={styles.header_image}>
                    <View style={styles.container}>
                        <Image 
                            source={require('../../../assets/images/sea.jpg')} 
                            style={styles.image} 
                        />
                        <TouchableOpacity
                            style={[styles.backButton, isActive && styles.activeButton]} // Apply active style when pressed
                            onPress={() => navigation.goBack()}
                            onPressIn={() => setIsActive(true)} // Set active state to true on press in
                            onPressOut={() => setIsActive(false)} // Reset active state on press out
                        >
                            <Icon name="chevron-left" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection:'row', backgroundColor:'#101214', width:'100%', height:86}}>
                    <View style={{width:'64%', justifyContent:'center', marginLeft:'6%'}}>
                        <Text style={{color:'white'}}>{item.budget}$</Text>
                        <Text style={{color:'white', fontSize:12}}>I am capable of investing this amount</Text>
                    </View>
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        {applybutton?(
                            <TouchableOpacity style={{backgroundColor:'#323B74',width:'80%',height:45, borderRadius:13, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>Applied</Text>
                            </TouchableOpacity>
                        ):(
                            <TouchableOpacity style={{backgroundColor:'#00B254',width:'80%',height:45, borderRadius:13, justifyContent:'center', alignItems:'center'}} onPress={()=>applyProject()}>
                                <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>Apply</Text>
                            </TouchableOpacity>
                        )}
                        
                    </View>
                </View>
                <Text style={{textAlign:'center' ,color:'white',fontSize:20, fontWeight:'bold', marginTop:9 }}>{item.projectName}</Text>
                {/* //------placing seat buttons here------------------------------------ */}
                <View style={styles.available_button_container}>
                    {buttons.map((buttonTitle, index) => (
                        <TouchableOpacity key={index} style={[styles.button, index < item.project_candidates.length ? styles.greenButton : styles.greyButton]}>
                            <Text style={styles.available_button_text}>{buttonTitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* //------placing seat buttons here------------------------------------ */}
                <View style={{backgroundColor:'#101214',height:54, justifyContent:'center', margin:'auto',width:'93%', borderRadius:10, marginTop:8}}>
                    <TouchableOpacity style={styles.audio_play_button}>
                        <View style={styles.audio_play_triangle} />
                    </TouchableOpacity>   
                </View>
                <View style={[styles.description_container,{marginTop:30}]}>
                    <Text style={styles.description_title}>About The {item.projectName}</Text>
                    <Text style={[styles.description_content,{marginTop:20}]}>{item.description}</Text>
                </View>
                <View style={[styles.description_container,{marginTop:20}]}>
                    <Text style={styles.description_title}>Location</Text>
                    <Text style={[styles.description_content,{marginTop:5}]}>{item.location}</Text>
                </View>
                <View style={[styles.description_container,{marginTop:5}]}>
                    <Text style={styles.description_title}>Information</Text>
                    <Text style={[styles.description_content,{marginTop:5}]}>Total Budget of The Project:${item.budget}</Text>
                    <Text style={styles.description_content}>Seat Available:{item.available}</Text>
                    <Text style={styles.description_content}>Investment For Every Seat:${item.budget/item.available}</Text>
                </View>
                <View style={[styles.description_container,{marginTop:5}]}>
                    <Text style={styles.description_title}>Project Type</Text>
                    <Text style={[styles.description_content,{marginTop:5}]}>{item.projectType}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
        header_image: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            overflow:'hidden' 
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            
            overflow:'hidden'
        },
        image: {
            width: '100%',
            height:300,
            resizeMode: 'cover',
        },
        backButton: {
            position: 'absolute',
            top: 20, // Adjust as needed
            left: 20, // Adjust as needed
            padding: 10,
            // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            borderRadius: 5,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight:'bold'
        },
        row: {
            justifyContent: 'space-between', // Space between buttons in a row
        },
        button: {
            width: '18%', // Adjust width to fit 5 buttons in a row
            marginBottom: 10, // Space between rows
            backgroundColor: '#00BE5A', // Button color
            padding: 8,
            borderRadius: 11,
            alignItems: 'center',
            justifyContent:'center',
            height:60,
            marginHorizontal:3
        },
        greenButton: {
            backgroundColor: '#00BE5A', // Blue color for the first three buttons
        },
        greyButton: {
            backgroundColor: '#101214', // Grey color for the rest of the buttons
        },
        available_button_container: {
            flexDirection: 'row',
            flexWrap: 'wrap', // Allows buttons to wrap to the next line
            justifyContent: 'space-between', // Space between buttons
            // padding: 10,
            marginTop:15,
            width:'93%',
            margin:'auto'
        },
        available_button_text:{
            color: 'white',
            fontSize: 12,
            fontWeight:'bold'
        },
        audio_play_button:{
            width: 35,
            height: 35,
            borderRadius: 25, // Makes the button circular
            backgroundColor: '#00BE5A', // Button color
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft:'3%'
        },
        audio_play_triangle: {
            width: 0,
            height: 0,
            borderLeftWidth: 8,
            borderRightWidth: 8,
            borderBottomWidth: 16,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'white', 
            transform: [{ rotate: '90deg' }]
        },
        description_container:{
            flex:1,
            justifyContent: 'center', // Center vertically
            alignItems: 'center', // Center horizontally
            
        },
        description_content:{
            width:'85%',
            fontSize:9,
            color:'white',
            lineHeight:13
        },
        description_title:{
            width:'93%',
            color:'white', 
            fontWeight:'bold',
            fontSize:16,
            margin:'auto'
        },
        activeButton: {
            // borderWidth: 2,
            // borderColor: 'grey', // Color of the square outline
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: add a slight background color
        },
        buttonSpacing: {
            width: 10,
             // Adjust this value for more or less space
        },
});

export default AppStack_Detail_Project;