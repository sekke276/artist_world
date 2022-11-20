import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export interface ProfileState {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: 'man' | 'woman' | 'not';
  musicInterests: string[];
  musicRoles: string[];
}

const initialState: ProfileState = {
  avatarUrl: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  sex: 'man',
  musicInterests: [],
  musicRoles: [],
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateBasicInfo: (state, action: PayloadAction<Profile.BasicInfo>) => {
      const {lastName, firstName, avatarUrl, birthDate} = action.payload;
      state.avatarUrl = avatarUrl;
      state.firstName = firstName;
      state.lastName = lastName;
      state.birthDate = birthDate;
    },
    updateSex: (state, action: PayloadAction<'man' | 'woman' | 'not'>) => {
      state.sex = action.payload;
    },
    updateMusicInterests: (state, action: PayloadAction<string[]>) => {
      state.musicInterests = action.payload;
    },
    updateMusicRoles: (state, action: PayloadAction<string[]>) => {
      state.musicRoles = action.payload;
    },
    updateDataFirebase: state => {
      console.log('called');
      const uid = auth().currentUser.uid;
      try {
        firestore()
          .collection('Users')
          .doc(uid)
          .set({
            avatarUrl: state.avatarUrl,
            firstName: state.firstName,
            lastName: state.lastName,
            birthDate: state.birthDate,
            sex: state.sex,
            musicInterests: state.musicInterests,
            musicRoles: state.musicRoles,
          })
          .then(() => console.log('Added'));
      } catch (error) {
        console.log(error);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const ProfileActions = profileSlice.actions;

export default profileSlice.reducer;
