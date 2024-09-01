import React,{useState,useEffect, useRef} from 'react';
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
import countries from '../../lib/countryCode';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import {http} from '../../helpers/http';
import GoBackIcon from 'components/GoBackIcon';

interface Props {
    navigation:NavigationProp<any>;
    route:RouteProp<any, any>;
}

const {width} = Dimensions.get('window');
const height = (5/8)*width;

const AppStack_Profile: React.FC<Props> = ({ navigation, route }) => {

    const {data} = route.params;
    const initialCode = data.country;
    const {item} = data.item;
    
    const [phone, setPhone] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [interestedCity, setInterestedCity] = useState('');

    const [imageUri, setImageUri] = useState(null);
    const [selectImages, setSelectImages] = useState(null);
    const selectImage = () => {
        const options = {
          mediaType: 'photo',
          includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                alert('User cancelled image picker');
            } else if (response.error) {
                alert('ImagePicker Error: ', response.error);
            } else {
                setImageUri(response.assets[0].uri);
                setSelectImages(response.assets[0]);
                // uploadImage(response.assets[0]);
            }
        });
    };
    
    const onPressCountry = () => {
        navigation.navigate('AuthStack_CountryScreen', {
          from: 'sign_up',
        });
    };

    
    const [countryCode, setCountryCode] = useState(initialCode);
    const countryNumber = countries.find(
        country => country.code === countryCode,
      ).dial_code;
    useEffect(() => {
    setPhone(data.phone.slice(countryNumber.length));
    }, [data.phone, countryNumber]);


    const validateData = (send_data) => {
        const errors = {};    
            // Validate name
        if (!send_data.name || send_data.name.trim() === '') {
            errors.name = 'Name is required.';
        }
            // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!send_data.email || !emailPattern.test(send_data.email)) {
            errors.email = 'A valid email is required.';
        }
    
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format

         // Validate the phone number format
        if (!phoneRegex.test(send_data.phoneNumber)) {
            errors.phoneNumber = 'phoneNumber is not valid. Please enter a valid phone number.';
        }
        
        if (!send_data.image_url || send_data.image_url.trim() === '') {
            errors.image_url = 'image is required.';
        }
            // Validate city live
        if (!send_data.city_live || send_data.city_live.trim() === '') {
            errors.city_live = 'City of residence is required.';
        }
            // Validate interested city
        // if (!send_data.interestedCity || send_data.interestedCity.trim() === '') {
        //     errors.interestedCity = 'Interested city is required.';
        // }
    
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };


    const register = () => {

        const send_data = {
            name: name,
            email: email,
            phoneNumber: countryNumber+phone,
            image_url: imageUri,
            city_live: city,
            interestedCity: interestedCity
        };
          
        const validationResult = validateData(send_data); // Call the validation function
    
        if (validationResult.isValid) {

            const formData = new FormData();
            formData.append('image',{
                name: selectImages.fileName,
                type: selectImages.type,
                uri: selectImages.uri,
            });
            formData.append('name',send_data.name);
            formData.append('email',send_data.email);
            formData.append('phoneNumber',send_data.phoneNumber);
            formData.append('city_living_in',send_data.city_live);
            formData.append('city_interested_to_works_in',send_data.interestedCity);

            try{
                
                http.post('/candidate/post_candidate',formData,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(res => {
                    if(res.data.message==='Candidate saved successfully'){
                        navigation.goBack();

                        // navigation.navigate('AppStack_Detail_Project'
                        //     ,{
                        //     item,
                        //     from:'profile'
                        // })
                    }
                });
            }catch{

            }
        } else {
            alert('Validation errors: ' + JSON.stringify(validationResult.errors));
        }
    };

    
    const [isValidEmail, setIsValidEmail] = useState(true);
    const validateEmail = (input) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmail(input);
        setIsValidEmail(emailPattern.test(input));
    };
    const [isValidPassword, setIsValidPassword] = useState(true); // State to track password validity
    const validatePassword = (input) => {
        // Password validation criteria
        const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
        setPassword(input);
        setIsValidPassword(passwordPattern.test(input)); // Update validity based on the input
    };

    return(
        <View  style={tw`flex-1 justify-center bg-black`}>
            <ScrollView>
                    <TouchableOpacity
                        style={[styles.backButton, isActive && styles.activeButton]} // Apply active style when pressed
                        onPress={() => navigation.goBack()}
                        onPressIn={() => setIsActive(true)} // Set active state to true on press in
                        onPressOut={() => setIsActive(false)} // Reset active state on press out
                    >
                        <Icon name="chevron-left" size={20} color="white" />
                    </TouchableOpacity>
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:width*0.1}}>
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>
                            Profile
                        </Text>
                    </View>
                    <View style={{width:'100%', justifyContent:'center', alignItems:'center', marginTop:15}}>
                    <View style={styles.project_detail}>
                        <TextInput
                            style={styles.itemContainer}
                            placeholder={'Name'}
                            placeholderTextColor="gray"
                            onChangeText={setName}
                            value={name}
                        />
                    </View>
                    <View style={styles.project_detail}>
                    <TextInput
                        style={styles.itemContainer}
                        // style={[styles.itemContainer, isValidEmail ? styles.invalid : null]}
                        placeholder={'Email'}
                        placeholderTextColor="gray"
                        onChangeText={validateEmail}
                        value={email}
                    />
                    </View>
                    {!isValidEmail && <Text style={styles.errorText}>A valid email is required.</Text>} 
                    <View style={styles.project_detail}>
                        <View style={{flex:3, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity onPress={onPressCountry} activeOpacity={0.5} disabled>
                                <Image
                                    width={60}
                                    height={30}
                                    source={{
                                        uri: `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`,
                                    }}
                                    style={tw`mx-2.5`}
                                />
                            </TouchableOpacity>
                            <Text style={tw`text-[#6D6D6D] text-[18px] font-dm font-bold`}>
                                {countryNumber}
                            </Text>

                        </View>
                        <View style={{flex:7, justifyContent:'center', alignItems:'center', left:width*0.06}}>
                            <TextInput
                                style={{ color:'gray', fontSize:16, position:'absolute', left:0 }}
                                value={phone}
                                placeholder="Phone Number"
                                placeholderTextColor="white"
                                onChangeText={setPhone}
                                editable={false}
                            /> 
                        </View>
                    </View>
                    <View style={styles.project_detail}>
                            <View style={{justifyContent:'center', alignItems:'center', padding:2.5}}>
                                <TouchableOpacity 
                                    // onPress={selectImage}
                                    style={{width:58, height:58, backgroundColor:'#414B84', borderRadius:10, justifyContent:'center', alignItems:'center', marginLeft:'2%' }}
                                    activeOpacity={0.5}
                                >
                                    <Text style={tw`text-black text-[18px] font-dm font-bold`}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1, justifyContent:'center', right:'50%' }}>                            
                                <Text style={{color: 'gray', position: 'absolute', left: '30%', fontSize: 16}}>
                                    verification with id
                                </Text>
                            </View>
                    </View>
                    <View style={styles.project_detail}>
                        <View style={{justifyContent:'center', alignItems:'center', padding:2.5}}>
                            <TouchableOpacity 
                                onPress={selectImage}
                                style={{width:58, height:58, backgroundColor:'#414B84', borderRadius:10, justifyContent:'center', alignItems:'center', marginLeft:'2%' }}
                                activeOpacity={0.5}
                            >
                                <Text style={tw`text-black text-[18px] font-dm font-bold`}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1, justifyContent:'center',alignItems:'center' }}>
                        
                        {imageUri ? (
                            <View style={{ position: 'relative', width:'100%'}}>
                                <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
                                <TouchableOpacity style={{position:'absolute', backgroundColor:'red', top:5, right:5,padding:3, borderRadius:5}} onPress={()=>setImageUri(null)}>
                                    <Text>
                                        cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ):(
                            <Text style={{color: 'white', position: 'absolute', left: '25%', fontSize: 16}}>
                                add image
                            </Text>
                        )

                        }
                    </View>
                    </View>
                    <View style={styles.project_detail}>
                        <TextInput
                            style={styles.itemContainer}
                            placeholder={'City Living In'}
                            placeholderTextColor="gray"
                            onChangeText={setCity}
                            value={city}
                        />
                    </View>
                    {/* <View style={styles.project_detail}>
                        <TextInput
                            style={styles.itemContainer}
                            placeholder={'City Interested To Work In'}
                            placeholderTextColor="gray"
                            onChangeText={setInterestedCity}
                            value={interestedCity}
                            textAlign='left'
                        />
                    </View> */}
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity style={{width:120, padding:13, justifyContent:'center', alignItems:'center' , backgroundColor:'#01B656', marginTop:20, borderRadius:15}} onPress={() => register()}>
                            <Text style={{color:'white', fontSize:16}}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    errorText: {
        marginLeft:'10%',
        color: 'red',
    },
    invalid: {
        borderBottomColor: 'red',
        borderBottomWidth: 2,
    },
    header_image: {
        alignItems: 'center',
        justifyContent: 'center',
        // flexDirection: 'row',
        overflow:'hidden',
        width:width,
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
        fontSize: 16,
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
        height:72,
        backgroundColor:'#101214',
        borderRadius:15,
        marginTop:14,
        margin:'auto',
        overflow:'hidden',
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:width*0.22,
        height:width*0.11,
        backgroundColor:'#2E3771',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
    },
    cadidate_info_text:{
        color:'white',
        fontSize:14,
        fontWeight:'bold'
    },
    itemContainer: {
        flex:1,
        marginVertical: 5,
        marginHorizontal: 20,
        backgroundColor: '#101214',
        borderRadius: 10,
        height:70,
        // width:'96%',
        fontSize:16,
        color:'white',
        textAlign:'left'

    },
    activeButton: {
        // borderWidth: 2,
        // borderColor: 'grey', // Color of the square outline
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: add a slight background color
    },

});

export default AppStack_Profile;