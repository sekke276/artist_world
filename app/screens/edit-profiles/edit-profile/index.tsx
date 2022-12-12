import React from 'react';
import {Button, UploadImage} from '@components';
import {DropDown} from '@components';
import DateTimePicker from '@components/date-time-picker/date-time-picker';
import {TextInputCustom} from '@components/text-input/text-input';
import {color} from '@theme';
import {CommonType} from '@utils/types';
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {useAppDispatch} from '@store/hook';
import {ProfileActions} from '@store/profile/reducer';
import {images} from '@assets/images';
import {getSize} from '@utils/responsive';

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.whiteBackground,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getSize.v(50),
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  birthdayButton: {
    backgroundColor: color.palette.wispPink,
    width: 295,
    height: 58,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  textButtonBirthday: {
    color: color.primary,
    textAlign: 'center',
    fontWeight: '700',
  },
  dropdown: {
    borderRadius: 25,
    borderColor: color.primary,
  },
  about: {
    borderWidth: 1,
    borderColor: color.primary,
    width: 295,
    height: 112,
    borderRadius: 25,
    color: color.storybookTextColor,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  labelTextCustom: {
    marginVertical: 10,
    color: color.storybookTextColor,
  },
  label: {
    marginBottom: 0,
    marginLeft: 20,
    color: color.storybookTextColor,
  },
  inputContainer: {
    marginVertical: 5,
  },
  genderLabel: {
    color: color.storybookTextColor,
    marginLeft: 25,
  },
  buttonSave: {
    width: 295,
    height: 56,
    borderRadius: 25,
    backgroundColor: color.primary,
  },
  buttonGallery: {
    width: 295,
    backgroundColor: color.palette.PrimaryWithOpacity(0.1),
    borderRadius: 25,
    height: 56,
    marginBottom: 25,
  },
  textGallery: {
    color: color.palette.PrimaryWithOpacity(0.7),
    fontWeight: '500',
    marginLeft: 10,
  },
  loadingImage: {
    width: 101,
    height: 106,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHoler: {
    width: 99,
    height: 99,
    borderRadius: 25,
  },
});
interface Props {}
export const EditProfile: CommonType.EditProfileScreenProps<
  'editProfile',
  Props
> = ({navigation}) => {
  const [pic, setPic] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const genderList = [
    {
      id: '1',
      label: 'man',
    },
    {
      id: '2',
      label: 'woman',
    },
    {
      id: '3',
      label: "dont' want to share",
    },
  ];
  const [gender, setGender] = useState<'man' | 'not' | 'woman'>('man');
  const [dateTimePicker, setDateTimePicker] = useState(false);
  const [birthDate, setBirthDate] = useState('Choose your birth date');
  const [about, setAbout] = useState('');
  const [interests, setInterests] = useState([]);
  const [roles, setRoles] = useState([]);
  const [changePic, setChangePic] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleInterest = () => {
    navigation.push('editInterest', {interests: interests});
  };
  const handleRoles = () => {
    navigation.navigate('editRole', {roles: roles});
  };
  const handleChangeAvatar = value => {
    setChangePic(true);
    setPic(value);
  };
  const handleGallery = () => {
    navigation.navigate('editGallery', {gallery: gallery});
  };

  const postPic = async picture => {
    var parts = picture.split('/');
    var picRef = parts[parts.length - 1];
    const ref = storage().ref(picRef);
    await ref.putFile(picture);
    return storage().ref(picRef).getDownloadURL();
  };

  const handleSaveChange = () => {
    const sendData = async () => {
      if (changePic) {
        postPic(pic)
          .then(value => {
            dispatch(
              ProfileActions.updateBasicInfo({
                avatarUrl: value,
                firstName: firstName,
                lastName: lastName,
                birthDate: birthDate,
              }),
            );
            setPic(value);
          })
          .catch(console.error);
      } else {
        dispatch(
          ProfileActions.updateBasicInfo({
            avatarUrl: pic,
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
          }),
        );
      }
      dispatch(ProfileActions.updateAbout(about));
      dispatch(ProfileActions.updateSex(gender));
      dispatch(ProfileActions.updateMusicInterests(interests));
      dispatch(ProfileActions.updateMusicRoles(roles));
      dispatch(ProfileActions.updateGallery(gallery));
    };
    if (firstName.trim() !== '' && lastName.trim() !== '') {
      sendData()
        .then(() => dispatch(ProfileActions.updateDataFirebase()))
        .finally(() => {
          setChangePic(false);
          setLoading(false);
          navigation.goBack();
        })
        .catch(console.error);
    } else {
      Alert.alert('Warning', 'Your information should not be empty', [
        {
          text: 'OK',
          style: 'cancel',
        },
      ]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .onSnapshot(value => {
          const data = value.data();
          setBirthDate(data.birthDate);
          setPic(data.avatarUrl.trim());
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setGender(data.sex);
          setAbout(data.about ? data.about : '');
          setInterests(data.musicInterests ? data.musicInterests : []);
          setRoles(data.musicRoles ? data.musicRoles : []);
          setGallery(data.gallery ? data.gallery : []);
        });
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {pic ? (
          <UploadImage source={pic} onUpload={handleChangeAvatar} />
        ) : (
          <View style={styles.loadingImage}>
            <Image style={styles.placeHoler} source={images.placeholder} />
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.inputContainer}>
            <TextInputCustom
              value={firstName}
              labelStyle={styles.labelTextCustom}
              label={'FirstName'}
              icon={'account'}
              onChangeText={text => setFirstName(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInputCustom
              labelStyle={styles.labelTextCustom}
              label="LastName"
              value={lastName}
              icon={'account'}
              onChangeText={text => setLastName(text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <DropDown
              data={genderList}
              value={gender}
              onSelect={setGender}
              containerStyles={styles.dropdown}
              maxDropdownHeight={200}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>BirthDate</Text>
            <TouchableOpacity
              style={styles.birthdayButton}
              onPress={() => setDateTimePicker(true)}>
              <Text style={styles.textButtonBirthday}>{birthDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>About</Text>
            <TextInput
              multiline={true}
              onChangeText={text => setAbout(text)}
              value={about}
              style={styles.about}
            />
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handleInterest}>
              <TextInputCustom
                value={interests ? interests.join(',') : ''}
                label="Interests"
                labelStyle={styles.labelTextCustom}
                editable={false}
                icon="music-box-multiple"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handleRoles}>
              <TextInputCustom
                value={roles ? roles.join(' , ') : ''}
                label="Roles"
                labelStyle={styles.labelTextCustom}
                editable={false}
                icon="guitar-electric"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          text="Your Gallery"
          style={styles.buttonGallery}
          onPress={handleGallery}>
          <Icon
            name="image-album"
            size={20}
            color={color.palette.PrimaryWithOpacity(0.7)}
          />
          <Text style={styles.textGallery}>Your Gallery</Text>
        </Button>

        <Button
          text="Save Changes"
          disabled={loading}
          onPress={handleSaveChange}
          style={styles.buttonSave}
        />
      </ScrollView>

      <DateTimePicker
        visible={dateTimePicker}
        onSave={value => {
          setBirthDate(value);
          setDateTimePicker(false);
        }}
        onBackPress={() => setDateTimePicker(false)}
      />
    </>
  );
};
