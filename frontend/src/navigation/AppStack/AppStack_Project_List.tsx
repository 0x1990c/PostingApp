import React,{useState,useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { NavigationProp, RouteProp, } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import tw from '../../../tailwindcss';
import {http} from '../../helpers/http';
import { updatePhoneNumber } from '@react-native-firebase/auth';
import { useAuth } from '../AuthContext';
import { Dropdown } from 'react-native-element-dropdown';
import Loading from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';


interface Props {
    navigation:NavigationProp<any>;
    route:RouteProp<any, any>;
}
const HoverButton = ({ title, isActive, onPress }) => {
    return (
        <TouchableOpacity 
            style={[styles.button, isActive && styles.activeButton]} 
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};
const {width} = Dimensions.get('window');
const height = (3/7)*width;

// const project_lists = [
//     {
//         projectName:'unity',
//         projectType:'Tech',
//         project_image_url:'',
//         bucket:false,
//         description:'About the project This is a SaaS product which was built for a particular org and aims to make work easy for the employees. This is a product where the employees can find the information related to their work and perform various operations',
//         location:'United States',
//         available:10,
//         candidate:8,
//         selected_candidates:[],
//         budget:15000

//     },
//     {
//         projectName:'C#',
//         projectType:'Tech',
//         project_image_url:'',
//         bucket:false,
//         description:'Pixidium is a marketing tool which aims to help clients to advertise their events to the larger audience. I have worked on this project individually and handle the frontend and backend both. This tool is built with the Django framework for backend and the front end is built with HTML, CSS, JAVASCRIPT',
//         location:'United States',
//         available:15,
//         candidate:10,
//         selected_candidates:[],
//         budget:5000

//     },
//     {
//         projectName:'React',
//         projectType:'Tech',
//         project_image_url:'',
//         bucket:false,
//         description:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//         location:'United kingdom',
//         available:25,
//         candidate:10,
//         selected_candidates:[],
//         budget:5000

//     },
//     {
//         projectName:'Java',
//         project_image_url:'',
//         projectType:'Tech',
//         bucket:false,
//         description:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//         location:'United States',
//         available:15,
//         candidate:10,
//         selected_candidates:[],
//         budget:5000

//     },
//     {
//         projectName:'unity',
//         project_image_url:'',
//         projectType:'Tech',
//         bucket:false,
//         description:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//         location:'United States',
//         available:5,
//         candidate:3,
//         selected_candidates:[],
//         budget:3000

//     }
// ];


const AppStack_Project_List: React.FC<Props> = ({ navigation, route }) => {
   
    const fetchProjects = async () => {

        const response = await http.get('/task/get_projects'); // Fetch data from the server
        const res_data = response.data.data; // Extract the data from the response
           setLoading(false);         
          return res_data;
         
    };

    const [project_lists, setProject_lists] = useState([]);

    const {phoneNumber} = useAuth();
    const [activeButtons, setActiveButtons] = useState({});
    const [activatedButtonNames, setActivatedButtonNames] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigations = useNavigation();

    const [loading, setLoading] = useState(false);
    
    const categories = 
        [
            "Art",
            "Restaurant",
            "Tech",
            "Restaurant",
            "Gaming",
            "RealEstate",
            "Travel",
            "E-Commerce",
            "Agriculture",
            "Restaurant",
            "Tech",
            "Tech"
        ];
    
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const temp = await fetchProjects();
                    setProject_lists(temp);
                } catch (error) {
                    console.error('Error fetching projects:', error);
                }
            };
            fetchData(); // Call the async function
                
        }, [navigations]) // Dependency array
    );

    const filter_project = async (buttonNames) => {
        try {
            if(buttonNames.length === 0){
                setLoading(true);
                const temp = await fetchProjects();
                setProject_lists(temp);
            }else{
                setLoading(true);
                http.get('/task/filter_project',{params:{buttonNames}}).then(res => {
                    setProject_lists(res.data); 
                    setLoading(false);               
                });
            }
        } catch (error) {
                console.error('Error communicating with server:', error);
        }
    };
            
    // //------------------------------------------------------------------
    const handleButtonPress = (buttonValue) => {
        
        setActiveButtons(prev => {
            const newActiveButtons = { ...prev, [buttonValue]: !prev[buttonValue] };
            const buttonName = categories[buttonValue - 1];
    
            // Update activated button names based on the new state
            let updatedActivatedButtonNames;
            if (newActiveButtons[buttonValue]) {
                // Button is activated
                updatedActivatedButtonNames = [...activatedButtonNames, buttonName];
                filter_project(updatedActivatedButtonNames);
            } else {
                // Button is deactivated
                updatedActivatedButtonNames = activatedButtonNames.filter(name => name !== buttonName);
                filter_project(updatedActivatedButtonNames);
            }
                // Update the state with the new activated button names
            setActivatedButtonNames(updatedActivatedButtonNames);
                          
            return newActiveButtons;
        });
    };

    const go_to_detailProject = (item) => {
        setLoading(true);
        navigation.navigate('AppStack_Detail_Project', {item});
        setLoading(false);
    };

    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions(window);
        });

        return () => subscription?.remove();
    }, []);
      
    
    useEffect(() => {
        fetchProjects(); // Call fetchProjects on initial load

        // Listen for navigation events
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProjects(); // Call fetchProjects when the screen is focused
        });

        // Cleanup the listener on unmount
        return unsubscribe;
    }, [navigations]);
    useEffect(()=>{
        fetchProjects();
    },[]);
    
   
    const ProjectDetail = ({ item, index }) => {
        const [likedBuckets, setLikedBuckets] = useState({}); // State to track liked buckets
    
        const toggleLike = (bucket) => {
            setLikedBuckets(prevState => ({
                ...prevState,
                [bucket]: !prevState[bucket] // Toggle the like state for the specific bucket
            }));
        };
    
        return (
            <View style={styles.project_detail}>
                <View style={{ backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center', borderRadius: 12, overflow: 'hidden' }}>
                    <Image
                        source={{ uri: `http://192.168.148.100:8001/${item.project_image_url}` }} 
                        // source={require('../../../assets/images/sea.jpg')} 
                        style={{ width: 120, height: 120 }}
                    />
                </View>
                <View style={{ padding: 5, paddingLeft: 10, flex: 1 }}>
                    <View style={styles.header}>
                        <Text style={styles.projectName}>{item.projectName}</Text>
                        <TouchableOpacity onPress={() => toggleLike(item.bucket)}> 
                            <FontAwesome 
                                name={likedBuckets[item.bucket] ? "heart" : "heart-o"} 
                                size={20} 
                                color="red" 
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>
                            {item.description}
                        </Text>  
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.location}>{item.location}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={styles.seatButton} onPress={() => go_to_detailProject(item)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <FontAwesome name="users" size={15} color="#000" /> 
                                        <Text style={{ color: 'white', marginLeft: 5 }}>{item.project_candidates.length}/{item.available}</Text>
                                    </View>
                                    <Text style={styles.seatText}>Seat Available</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.budget}$</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    

    const [selectedValue, setSelectedValue] = useState(null);
    const data = [
      { label: 'post project', value: '1' },
      { label: 'candidate panel', value: '2' },
      
    ];

    
    //--------------------- pass the data with phoneNumber ---------------------------------
    useEffect(() =>{
        switch(selectedValue){
            case '1':
                setSelectedValue(null);
                navigation.navigate('AppStack_Post_Project');
                break;
            case '2':
                setSelectedValue(null);
                const data = project_lists.filter(project => project.phoneNumber === phoneNumber);
                
                // alert(JSON.stringify(data));
                // alert(JSON.stringify(project_lists));
                // navigation.navigate('AppStack_Candidate_Panel',{project_lists});
                navigation.navigate('AppStack_Candidate_Panel',{data});
                break;
            default:
                break;    
        };
    },selectedValue);
    
    if (loading) return <Loading />;  
    return (
        <View style={tw`flex-1 justify-center bg-black`}>
            <ScrollView>
                <View style={styles.header_image}>
                    <View style={{ width: '100%', }}>
                        <Image source={require('../../../assets/images/sea.jpg')} style={{ width: '100%', height: 250, resizeMode: 'cover',borderRadius:10, marginBottom:3 }}/>    
                        
            {/*-------------------  navigating  panel ---------------------------------------*/}
                
                <Dropdown
                    style={[styles.dropdown, { borderWidth: 0, marginTop:5 }]} // Set borderWidth to 0
                    data={data}
                    labelField="label"
                    valueField="value"
                    value={selectedValue}
                    onChange={item => {
                        setSelectedValue(item.value);
                        setIsDropdownOpen(false);
                    }}
                    onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
                    onBlur={() => setIsDropdownOpen(false)}
                    containerStyle={styles.dropdownContainer}
                    // renderLeftIcon={() => (
                    //     <MaterialIcons name="more-horiz" size={20} color="black" style={{ marginRight: 10 }} /> // Optional left icon
                    // )}
                    renderItem={(item) => (
                        <View style={styles.dropdownItem}>
                            <Text style={{color:'black'}}>{item.label}</Text>
                        </View>
                    )}
                    placeholder="" 
                    renderRightIcon={() => (
                        isDropdownOpen ? ( // Show circular icon only when dropdown is open
                            <View style={styles.circleIconContainer}>
                                <MaterialIcons name="more-vert" size={30} color="black" />
                            </View>
                        ) : (<MaterialIcons name="more-vert" size={30} color="black" />)
                    )}
                />
                

                    </View>
                </View>
                <View style={styles.buttonMatrix}>
                    <Text style={tw`text-white text-7 text-center mb-3`}>Interested In</Text>
                    {Array.from({ length: 4 }, (_, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {Array.from({ length: 3 }, (_, colIndex) => {
                                const buttonValue = rowIndex * 3 + colIndex + 1;
                                return (
                                    <HoverButton
                                        key={colIndex}
                                        title={categories[buttonValue - 1]}
                                        isActive={activeButtons[buttonValue]}
                                        onPress={() => handleButtonPress(buttonValue)}
                                    />
                                );
                            })}
                        </View>
                    ))}
                </View>
                <View style={{width:'98%', margin:'auto', marginTop:7}}>
                    {project_lists && project_lists.length>0?(
                        <FlatList 
                        data={project_lists}
                        // renderItem={project_detail}
                        renderItem={({item, index})=><ProjectDetail item={item} index={index}/>}
                        keyExtractor={(item, index)=>index.toString()}
                    />
                    ):(
                        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
                            There are no projects.
                        </Text>
                    )}
                    
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    header_image: {
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        // width: Dimensions.get('window').width*0.98,
        width:'98%',
        flexDirection: 'row',
        margin:'auto',
        overflow:'hidden' ,
        borderRadius:10,
        
    },
    buttonMatrix: {
        width: '100%',
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 25,
    },
    button: {
        // width: Dimensions.get('window').width * 0.28,
        width:'32%',
        height: 30,
        borderRadius: 25,
        backgroundColor: '#101214',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 3,
        borderColor: '#111516',
        // borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontSize: 11,
    },
    activeButton: {
        backgroundColor: '#28a745',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 1.5,
        padding: 3,
    },
    project_detail:{
        flexDirection:'row',
        // width:Dimensions.get('window').width*0.98,
        width:'100%',
        height:120,
        // height:Dimensions.get('window').width*0.28,
        backgroundColor:'#101214',
        borderRadius:10,
        marginTop:6,
        margin:'auto',
        overflow:'hidden'
    },
    header: {
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
        // paddingVertical: 10,
    },
    projectName: {
        fontSize: 18,
        fontWeight: 'bold',
        color:'white'
    },
    descriptionContainer: {
        marginTop:4,
        flex: 1,
        overflow: 'hidden',
        color:'white',
        
    },
    description: {
        fontSize: 7,
        lineHeight:10 ,
        color:'white'
    },
    footer: {
        // paddingVertical: 10,
        // borderTopWidth: 1,
        borderTopColor: '#ccc',
        // alignItems: 'flex-start',
    },
    location: {
        fontSize: 12,
        fontWeight: 'bold',
        color:'white',
        marginBottom:2
    },
    seatButton: {
        // marginTop: 5,
        padding: 2,
        backgroundColor: '#00A84F',
        borderRadius: 8,
        width:180,
        alignItems:'center',
        
    },
    seatText: {
        marginLeft:10,
        fontSize: 12,
        color:'white'
    },
    dropdown: {
        position: 'absolute', // Position the dropdown absolutely
        top: 0, // Adjust this value based on the button height
        right: 1, // Align to the left of the button
        maxHeight: 'auto', // Set maxHeight if needed
        overflow: 'visible',
        
        width: 100, // Set width to match the button
        borderRadius: 5,
        zIndex: 1, // Ensure dro
      
    },
    
    dropdownContainer:{
        // position:'absolute',
        // top:65,
        // right:0,        
        maxHeight: 'auto', // or set a maxHeight if needed
        overflow: 'visible',
        backgroundColor:'#F0F0F0',
        width:100,
        borderRadius:5,
    },
    dropdownContainer1:{
        position:'absolute',
        top:65,
        right:0,        
        maxHeight: 'auto', // or set a maxHeight if needed
        overflow: 'visible',
        backgroundColor:'#F0F0F0',
        width:100,
        borderRadius:5,
    },
    dropdownItem: {
        paddingVertical: 5, // Adjust vertical padding
        paddingHorizontal: 10, // Adjust horizontal padding
        // lineHeight: 1, // Set line height for tighter spacing
    },
    circleIconContainer: {
        width: 30, // Adjust size as needed
        height: 30, // Adjust size as needed
        borderRadius: 15, // Half of width/height for a perfect circle
        backgroundColor: 'lightgray', // Background color for the circle
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5, // Adjust margin as needed
    },
    
});

export default AppStack_Project_List;
