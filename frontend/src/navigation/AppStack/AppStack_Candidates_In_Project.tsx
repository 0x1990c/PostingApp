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
import { LinearGradient } from 'react-native-linear-gradient';
import Loading from '../../components/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import {http} from '../../helpers/http';

interface Props {
    navigation:NavigationProp<any>;
    route:RouteProp<any, any>;
}

const {width} = Dimensions.get('window');
const height = (5/7)*width;

const AppStack_Candidate_Panel: React.FC<Props> = ({ navigation, route }) => {

    const {sending_data} = route.params;
    const {item} = sending_data;
    const [selected, setSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState([]);

    const fetchData= () => {
            const send_data = item.project_candidates;
            
            http.get('/candidate/get_candidates', {params:{send_data}}).then(res=>{
                // alert(JSON.stringify(res.data.data));
                setCandidates(res.data.data);
        });
    }

    const navigations = useNavigation();
    useFocusEffect(
        React.useCallback(
            ()=>{
                fetchData();
            },[navigations]
        )
    );

    const toggle_select = (phoneNumber) => {
        
        setSelected(!selected);
        item.selected_candidates.push(phoneNumber);
        // alert(item._id);
        const send_data = {
            project_id : item._id,
            candidate_phoneNumber:phoneNumber
        }
        http.post('/task/select_candidate',{send_data}).then(res=>{
            if(res.data.message == 'successful'){
                // alert('successful');
            }
        });

    }

    const candidate_detail = (candidate) => {
        setLoading(true);
        navigation.navigate('candidate_detail', {candidate});
        setLoading(false);
        // alert(JSON.stringify(candidate.experience));
    }
    const [isActive, setIsActive] = useState(false); 

    const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenDimensions(window);
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    const { width } = screenDimensions;
    const buttonSize = width / 4; // Calculate size based on screen width

    return(
        <View  style={tw`flex-1 justify-center bg-black`}>
            <ScrollView>

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


                <View style={{flexDirection:'row', backgroundColor:'#101214', width:'100%', height:Dimensions.get('window').width*0.17}}>
                    <View style={{flex:7, justifyContent:'center', marginLeft:'10%'}}>
                        <Text style={{color:'white'}}>{item.project_candidates.length}/{item.available}</Text>
                        
                    </View>
                    <View style={{flex:3, justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{backgroundColor:'#5328C9',width:'80%',height:'50%', borderRadius:10, justifyContent:'center', alignItems:'center', marginRight:20}}>
                            <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>Fulfill</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={{justifyContent:'center', alignItems:'center', marginTop:8}}>
                    <Text style={styles.text}>{item.projectName}</Text>
                    <TouchableOpacity style={{marginTop:5}}>
                        <LinearGradient 
                            colors={['#535353', '#090909']} 
                            style={{ padding: 3, borderRadius: 5, width: 40, height:15 }}
                        >
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize:8 }}>
                                        Edit
                                    </Text> 
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[styles.text,{marginTop:3}]}>Application Candidates</Text>
                    <Text style={{fontSize:9, color:'white', marginBottom:5, marginTop:5}}>Please Select {item.available} Candidates And Fullfill The Project</Text>
                    <TouchableOpacity style={{position:'absolute', backgroundColor:'#790000',height:18, padding:3, alignItems:'center',justifyContent:'center', left:5, top:5, borderRadius:5, marginLeft:8 }}>
                        <Text style={{color:'white', fontSize:9}}>Terminate Project</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.available_button_container}>
                    {candidates.map((candidate, index) => (
                        <View style={{alignItems:'center',width:'25%',marginHorizontal:15, backgroundColor:'black', marginBottom:5, borderRadius:10}}>
                            <TouchableOpacity style={[styles.buttonContainer, { width: buttonSize, height: buttonSize }]} onPress={() => candidate_detail(candidate)}>
                                <View>
                                    <Image source={{ uri: `http://192.168.148.100:8001/${candidate.profileImage}` }} style={{width:'100%', height:'100%'}}/>
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.candidate_text}>{candidate.name}</Text>
                            {!item.selected_candidates.includes(candidate.phoneNumber) && (
                                <TouchableOpacity style={{borderRadius:5, marginTop:3,}} onPress={() => toggle_select(candidate.phoneNumber)}>
                                    <LinearGradient 
                                        colors={['#535353', '#090909']} 
                                        style={{ padding: 3, borderRadius: 5, width: 40 }}
                                    >
                                        <Text style={{ color: 'white', textAlign: 'center', fontSize:8 }}>select</Text> 
                                    </LinearGradient>
                                 </TouchableOpacity>  
                            )}
                            {item.selected_candidates.includes(candidate.phoneNumber) && (
                                <Text style={{position:'absolute', color:'red', top:10, right:5, backgroundColor:'#364251', padding:2, borderRadius:5, fontSize:8, width:32}}>Report</Text>    
                            )}
                        </View>
                    ))}
                </View>

                
            </ScrollView>
            <View style={{ position:'absolute',height:width*0.15, backgroundColor:'white', bottom:0, width:'100%', borderTopEndRadius:10, borderTopLeftRadius:10, justifyContent:'center', }}>
                    <View style={styles.innerContainer}>
                        <View style={styles.flex8}>
                            <Text style={{fontSize:18, fontWeight:'bold', color:'black'}}>Total {item.budget}$</Text>
                        </View>
                        <View style={styles.flex2}>
                            <TouchableOpacity style={{width:100,padding:5, backgroundColor:'#009F4B', justifyContent:'center', alignItems:'center', borderRadius:20}}>
                                <Text style={{color:'white', fontWeight:'bold'}}>Pay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <Text style={{fontSize:8, marginLeft:'5%'}}>*After Payment Project Will Be Fulfilled & Group Chat Will Be Opened</Text> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        
    },
    image: {
        width: '100%',
        height:350
        
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
    available_button_container: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allows buttons to wrap to the next line
        justifyContent: 'space-between', // Space between buttons
        padding: 10,
        width:'93%',
        margin:'auto'
    },
    button: {
        width: width * 0.25,
        height: width * 0.25,
        overflow: "hidden",
        borderRadius: 25,
        // borderColor: "green",
        // borderWidth:3 
    },
    candidate_text:{
        marginTop: 3, // Adds space between the image and text
        fontSize: 9, // Adjust font size as needed
        color: 'white', // Change text color if necessary
        textAlign: 'center', 
        
    },
    text:{
        color:'white',
        fontSize:16,
        fontWeight:'bold'
    },
    innerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        // alignItems:'center'
    },
    flex8: {
        height: '100%',
        justifyContent: 'center',
        // alignItems: 'center',
        flex: 7,
        marginLeft:'5%'
    },
    flex2: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3,
        height: '100%', // Ensure it takes full height for vertical centering
    },
    activeButton: {
        // borderWidth: 2,
        // borderColor: 'grey', // Color of the square outline
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: add a slight background color
    },
    buttonContainer: {
        margin: 5, // Space between buttons
        borderRadius: 20,
        overflow: 'hidden', // To round the corners of the image
    },
   
});

export default AppStack_Candidate_Panel;