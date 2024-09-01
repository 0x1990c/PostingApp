import React,{useEffect, useState} from 'react';
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
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import tw from '../../../tailwindcss';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../AuthContext';
import {http} from '../../helpers/http';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { PermissionsAndroid } from 'react-native';
import DocumentPicker from 'react-native-document-picker';


const screenWidth = Dimensions.get('window').width;

const HoverButton = ({ title,isActive,onPress }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
        <TouchableOpacity 
            style={[styles.button, isActive && styles.activeButton]} 
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
        );

};

interface Props {
    navigation:NavigationProp<any>;
    route:RouteProp<any, any>;
}

const AppStack_Post_Project: React.FC<Props> = ({navigation, route}) => {

    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    // useEffect(()=>{alert(imageUri);},imageUri);
    const [isActive, setIsActive] = useState(false);
    const {phoneNumber} = useAuth();
    const projectLocations = [
        'About The Project',
        'Plan For Success',
        'Total Project Budget',
        'Ownership For Every Seat',
        'Available Seats',
        'Investment Required For One Seat',
        'Project Location',
        // 'Add Audio'
    ];
    const [inputValues, setInputValues] = useState(Array(projectLocations.length).fill(''));

    const [activeButton, setActiveButton] = useState(null);

    const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };
    
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
   
    const renderItem = ({ item, index }) => (
        <TextInput
            style={[styles.itemContainer, {paddingLeft:'8%'}]}
            placeholder={item}
            placeholderTextColor="white"
            onChangeText={(value)=>handleInputChange(index, value)}
            multiline = {true}
            
        />
       
    );

    

    const validateData = (send_data) => {
        const errors = {};
        
        // Validate name
        if (!send_data.phoneNumber || send_data.phoneNumber.trim() === '') {
            errors.phoneNumber = 'phoneNumber is required.';
        }
        if (!send_data.projectName || send_data.projectName.trim() === '') {
            errors.projectName = 'projectName is required.';
        }
        if (!send_data.projectType || send_data.projectType.trim() === '') {
            errors.projectType = 'projectType is required.';
        }
        if (!send_data.description || send_data.description.trim() === '') {
            errors.description = 'description is required.';
        }
        if (!send_data.plan_for_success || send_data.plan_for_success.trim() === '') {
            errors.plan_for_success = 'plan_for_success is required.';
        }
        if (!send_data.budget || send_data.budget.trim() === '') {
            errors.budget = 'budget is required.';
        }
        if (!send_data.ownership_for_every_seat || send_data.ownership_for_every_seat.trim() === '') {
            errors.ownership_for_every_seat = 'ownership_for_every_seat is required.';
        }
        if (!send_data.available || send_data.available.trim() === '') {
            errors.available = 'available is required.';
        }
        if (!send_data.investment_required_for_one_seat || send_data.investment_required_for_one_seat.trim() === '') {
            errors.investment_required_for_one_seat = 'investment_required_for_one_seat is required.';
        }
        if (!send_data.location || send_data.location.trim() === '') {
            errors.location = 'location is required.';
        }
        if (!send_data.project_image_url || send_data.project_image_url.trim() === '') {
            errors.project_image_url = 'project_image_url is required.';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    const post_project = () => {
        
        //i should add audio file to this.
        const send_data = {
            phoneNumber:phoneNumber,
            projectName:projectName,
            projectType:projectType,
            description:inputValues[0],
            plan_for_success:inputValues[1],
            budget:inputValues[2],
            ownership_for_every_seat:inputValues[3],
            available:inputValues[4],
            investment_required_for_one_seat:inputValues[5],
            location:inputValues[6],
            project_image_url:imageUri
        }
        const validationResult = validateData(send_data);
        if (validationResult.isValid) {
            const formData = new FormData();
            formData.append('image',{
                name: selectImages.fileName,
                type: selectImages.type,
                uri: selectImages.uri,
            });
            if(audioFile){
                formData.append('audioFile',{
                    uri:audioFile.uri,
                    type:audioFile.type,
                    name:audioFile.name,
                });
            }
            
            formData.append('phoneNumber',phoneNumber);
            formData.append('projectName',projectName);
            formData.append('projectType',projectType);
            formData.append('description',inputValues[0]);
            formData.append('plan_for_success',inputValues[1]);
            formData.append('budget',inputValues[2]);
            formData.append('ownership_for_every_seat',inputValues[3]);
            formData.append('available',inputValues[4]);
            formData.append('investment_required_for_one_seat',inputValues[5]);
            formData.append('location',inputValues[6]);
            formData.append('project_image_url',imageUri);

            // Object.keys(send_data).forEach(key => {
            //     formData.append(key, send_data[key]);
            // });
    
            try{
                
                http.post('/task/post_project',formData,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(res => {
                    if(res.data.message==='Post project created successfully'){
                        navigation.navigate('AppStack_Project_List');
                    }
                });
            }catch{

            }
        } else {
            alert('Validation errors: ' + JSON.stringify(validationResult.errors));
        }

    }    

    const [activeButtons, setActiveButtons] = useState(Array(12).fill(false));
    const handleButtonPress = (index) => {
        const newActiveButtons = [...activeButtons];
        newActiveButtons[index] = !newActiveButtons[index]; // Toggle active state
        setActiveButtons(newActiveButtons);
        setActiveButton(index);
        setProjectType(categories[index-1]);
    };
    const [selectImages, setSelectImages] = useState(null);
    const selectImage = () => {
        const options = {
          mediaType: 'photo',
          includeBase64: false
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                alert('User cancelled image picker');
            } else if (response.error) {
                alert('ImagePicker Error: ', response.error);
            } else {
                setImageUri(response.assets[0].uri);
                setSelectImages(response.assets[0]);
                // Here you can also handle the upload to your server            }
            }
        });
    };

    const [audioFile, setAudioFile] = useState(null);

    const selectAudioFile = async () => {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.audio],
            });
            setAudioFile(res[0]); // Store the selected file
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker');
            } else {
                console.error('Error picking audio file:', err);
            }
        }
    };

    


    return (
        <View  style={tw`flex-1 justify-center bg-black`}>
            <ScrollView>
                <View style={tw`flex-row items-center justify-center position-absolute`}>
                    {/* <Text style={tw` text-white text-[20px] text-center font-bold`}>
                        Post Project
                    </Text> */}
                     <TouchableOpacity
                        style={[tw`absolute z-10 top-[10px] left-[20px] p-[6px] rounded-md`, isActive && styles.activeBackButton]}
                        onPress={() => navigation.goBack()}
                        onPressIn={() => setIsActive(true)} // Set active state to true on press in
                        onPressOut={() => setIsActive(false)} // Reset active state on press out
                    >
                        <Icon name="chevron-left" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={tw`mt-[50px] bg-[#101214] rounded-[10px] w-[96%] mx-2`}>
                    <Text style={tw`text-white ml-[7%] text-[18px] mt-5 font-bold`}>Project Name  &  Type</Text>
                    <View style={tw` justify-center items-center bg-[#101214]`}>
                        <TextInput
                            style={tw`text-white rounded-[25px] bg-[#060606] font-dm  text-[13px] w-[80%] mt-5 `}
                            placeholder="project name"
                            placeholderTextColor="white"
                            textAlign="center"
                            value={projectName}
                            onChangeText={setProjectName} 
                        />
                    </View>
                    <View style={styles.buttonMatrix}>
                        {Array.from({ length: 4 }, (_, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {Array.from({ length: 3 }, (_, colIndex) => {
                                    const buttonValue = rowIndex * 3 + colIndex + 1;
                                    return (
                                        <HoverButton key={colIndex} 
                                            title={categories[buttonValue-1]} 
                                            // isActive={activeButtons[buttonValue]} 
                                            isActive={activeButton===buttonValue}
                                            onPress={() => handleButtonPress(buttonValue)}
                                        />
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </View>
                
                <View style={styles.container}>
                        <FlatList
                            data={projectLocations}
                            renderItem = {renderItem}
                            keyExtractor={(item, index)=>index.toString()}
                        />
                       
                        <TouchableOpacity style={ [styles.itemContainer,{justifyContent:'center', paddingLeft:'8%'}]} 
                            onPress={selectAudioFile}
                        >
                            {audioFile ? (
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                                    Audio selected
                                </Text>
                            ) : (
                                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                                    Add Audio
                                </Text>
                            )}

                            
                            
                        </TouchableOpacity>
                        
                        
                </View>

                <View style={styles.bottom_container}>
                     
                    {imageUri && (
                        <>
                            <TouchableOpacity style={styles.upload_image}>
                                {/* <Text>image selected</Text> */}
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>  
                        </>
                    )}
                    <TouchableOpacity style={styles.bottom_button} onPress={selectImage}>
                        <Text style={styles.bottom_text}>+</Text>
                    </TouchableOpacity>
                        
                        

                </View>  
                <View style={tw`flex-1 justify-center items-center mt-5`}>
                    <TouchableOpacity style={tw`bg-transparent mt-5 flex justify-center items-center h-11 w-29 bg-[#00A84F] rounded-[3]`} onPress={post_project}>
                        <Text style={tw`text-white text-[18px] font-abril`}>
                            post
                        </Text>
                    </TouchableOpacity>
                </View>
                
            </ScrollView>
        </View>
        
        
    );
};

const styles = StyleSheet.create({
    container: {
      
      justifyContent: 'center',
      marginTop:15
    },
    input: {
      height: 40,
      borderWidth: 1,
      width: '100%',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    buttonMatrix: {
      width: '100%',
      marginTop:20,
      marginBottom:25,
            
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center', // Adjusts spacing between buttons
      marginVertical: 1,
      padding:3,
      
    },
    buttonHovered: {
        backgroundColor: '#00A84F', // Change to green on hover
      },
    button: {
      width: '28%', // 25% of screen width
      height: 35,
      borderRadius: 25, // Half of the height for elliptical shape
      backgroundColor: '#101214',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 1,
      borderColor:'#181A19',
      borderWidth:2,
      
    },
    buttonText: {
      color: 'white',
      fontSize: 11,
    },
    itemContainer: {
        marginVertical: 5,
        marginHorizontal: 20,
        backgroundColor: '#101214',
        borderRadius: 10,
        height:65,
        width:'96%',
        marginLeft:'2%',
        fontSize:14,
        color:'white',
        fontWeight:'bold',
        marginBottom:9
        // justifyContent:'center',
        
        // alignItems:'center'
    },
    
    activeButton: {
        backgroundColor: '#28a745', // Green color when active
    },
    bottom_container: {
        flexDirection: 'row',
        marginLeft:20,
        // alignItems: 'center', // Center vertically
        gap: 10,
        marginTop:10 
    }
    ,
    bottom_button: {
        padding: 10,
        width:80,
        height:80,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        marginLeft:10,
        borderRadius:12
    },
    upload_image: {
        
        width:80,
        height:80,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        marginLeft:10,
        borderRadius:12
    },
    image: {
        // width: 100, // Set the width of the image
        // height: 100, // Set the height of the image
        // backgroundColor:'red',
        width:'100%',
        height:'100%',
        borderRadius:12
    },
    bottom_text:{
        // width:100,
        // height:100,
        fontSize:24,
        backgroundColor:'white',
        borderRadius:10,
        textAlign:'center'
    },
    activeBackButton: {
     
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: add a slight background color
    },
    
  });

export default AppStack_Post_Project;
