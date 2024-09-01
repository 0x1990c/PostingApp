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

    // const {project_lists} = route.params;
    const {data} = route.params;
    const project_lists = data;
    

    // const candidates = [
    //     {
    //         id:1,
    //         Name:'Tom',
    //         Email:'asdfadf',
    //         phoneNumber:'555206878',
    //         Verification_with_id:'',
    //         profile_picture:'../../../assets/images/sea.jpg',
    //         city_living_in:'bogota',
    //         city_interested_to_works_in:'Tokyo',
            

    //         experience:{
    //                 commitment_rating:35,
    //                 project_fullfilled:5,
    //                 chosen:15,
    //                 project_terminated:2,
    //                 left_after_selection:5,
    //                 biggest_invest:20000,
    //                 biggest_project:100000
    //         },
    //         project_id:[1,2,3]
            
    //     },
    //     {
    //         id:2,
    //         Name:'Ury',
    //         Email:'',
    //         phoneNumber:'555206878',
    //         Verification_with_id:'',
    //         profile_picture:'../../../assets/images/sea.jpg',
    //         city_living_in:'bogota',
    //         city_interested_to_works_in:'Tokyo',
            
    //         experience:{
    //                 commitment_rating:35,
    //                 project_fullfilled:5,
    //                 chosen:15,
    //                 project_terminated:2,
    //                 left_after_selection:5,
    //                 biggest_invest:20000,
    //                 biggest_project:100000
    //         },
    //         project_id:[1,2,3]
            
    //     },
    //     {
    //         id:3,
    //         Name:'TDM',
    //         Email:'',
    //         phoneNumber:'555206878',
    //         Verification_with_id:'',
    //         profile_picture:'../../../assets/images/sea.jpg',
    //         city_living_in:'bogota',
    //         city_interested_to_works_in:'Tokyo',
            
    //         experience:{
    //                 commitment_rating:335,
    //                 project_fullfilled:5,
    //                 chosen:15,
    //                 project_terminated:2,
    //                 left_after_selection:5,
    //                 biggest_invest:20000,
    //                 biggest_project:100000
    //         },
    //         project_id:[1,2,3]
            
    //     },
    //     {
    //         id:4,
    //         Name:'Age',
    //         Email:'',
    //         phoneNumber:'555206878',
    //         Verification_with_id:'',
    //         profile_picture:'../../../assets/images/sea.jpg',
    //         city_living_in:'bogota',
    //         city_interested_to_works_in:'Tokyo',
            
    //         experience:{
    //                 commitment_rating:385,
    //                 project_fullfilled:5,
    //                 chosen:15,
    //                 project_terminated:2,
    //                 left_after_selection:5,
    //                 biggest_invest:20000,
    //                 biggest_project:100000
    //         },
    //         project_id:[1,2,3]
            
    //     },
    //     {
    //         id:5,
    //         Name:'CS',
    //         Email:'',
    //         phoneNumber:'555206878',
    //         Verification_with_id:'',
    //         profile_picture:'../../../assets/images/sea.jpg',
    //         city_living_in:'bogota',
    //         city_interested_to_works_in:'Tokyo',
            
    //         experience:{
    //                 commitment_rating:350,
    //                 project_fullfilled:5,
    //                 chosen:15,
    //                 project_terminated:2,
    //                 left_after_selection:5,
    //                 biggest_invest:20000,
    //                 biggest_project:100000
    //         },
    //         project_id:[1,2,3]
            
    //     },
    //     {
    //         id:6,
    //         Name:'Jerry',
    //         Email:'',
    //         phoneNumber:'555206878',
    //         Verification_with_id:'',
    //         profile_picture:'../../../assets/images/sea.jpg',
    //         city_living_in:'bogota',
    //         city_interested_to_works_in:'Tokyo',
            
    //         experience:{
    //                 commitment_rating:3,
    //                 project_fullfilled:5,
    //                 chosen:15,
    //                 project_terminated:2,
    //                 left_after_selection:5,
    //                 biggest_invest:20000,
    //                 biggest_project:100000
    //         },
    //         project_id:[1,2,3]
            
    //     }
    // ]; 
    const [loading, setLoading] = useState(false);

    //--------- navigate to AppStack_Candidates_In_Project with project_candidates and candidates--------------------------
    const candidates_in_project = (item) => {
        setLoading(true);
        // alert(JSON.stringify(item));
        const sending_data = {candidates:item.project_candidates,  item:item};
        navigation.navigate('candidates_in_project',{sending_data});
        // setLoading(false);
    };
    
    const [isHovered, setIsHovered] = useState(false);
    const project_detail = ({ item, index }) => (
        <View style={styles.project_detail}>
            <View style={{  backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center',borderRadius:10,overflow:'hidden' }}>
                <Image
                    source={require('../../../assets/images/sea.jpg')}
                    style={{width:80, height:80}}
                />
            </View>
            <View style={styles.outerContainer}>
                <View style={styles.innerContainer}>
                    <View style={styles.flex8}>
                        <Text style={styles.text}>{item.projectName}</Text>
                    </View>
                    <View style={styles.flex2}>
                        <TouchableOpacity onPress={()=>candidates_in_project(item)}>
                            <Icon
                                name="chevron-right"
                                size={10}
                                color="white"

                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );


    if (loading) return <Loading />;
    return(
        <View  style={tw`flex-1 bg-black`}>
            <ScrollView>
                <TouchableOpacity
                    style={[styles.backButton, isHovered && styles.hoveredButton]} // Apply hover style when hovered
                    onPress={() => navigation.goBack()}
                    onMouseOver={() => setIsHovered(true)} // Set hovered state to true on mouse enter
                    onMouseLeave={() => setIsHovered(false)} // Reset hovered state on mouse leave
                    >
                    <Icon name="chevron-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.panel_name}>Candidate Panel</Text>
                <View style={tw`mt-5 flex-row items-center justify-center w-full`}>
                    {project_lists && project_lists.length > 0 ? (
                        <FlatList 
                            data={project_lists}
                            renderItem={project_detail}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text  style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>No projects you post.</Text> 
                    )}
                </View>
            </ScrollView>
            

        </View>
    );
};
const styles = StyleSheet.create({
    project_detail:{
        flexDirection:'row',
        // width:Dimensions.get('window').width*0.98,
        width:'94%',
        height:92,
        backgroundColor:'#101214',
        borderRadius:10,
        marginTop:8,
        margin:'auto',
        overflow:'hidden',
        padding:6
    },
    panel_name:{
        marginTop:70,
        color:'white',
        fontSize:20,
        fontWeight:"bold",
        textAlign:'center'
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
        color: '#fff',
        fontSize: 18,
        fontWeight:'bold'
    },
    outerContainer: {
        flex: 1,
        padding: 5,
        justifyContent: 'center', // Center vertically
    },
    innerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between', // Center the row content
    },
    flex8: {
        // height: '100%',
        flex:8,
        justifyContent: 'center',
        marginLeft:'5%'
        // alignItems: 'center',
        
    },
    flex2: {
    
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        
    },
    text: {
        color: 'white',
        fontSize: 18, // Optional: increase font size for better visibility
    },
   
});


export default AppStack_Candidate_Panel;