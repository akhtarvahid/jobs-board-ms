import { combineReducers } from '@reduxjs/toolkit';
import userAuthReducer from './user/userAuthSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import storyReducer from './story/storySlice';
import profileReducer from './profile/profileSlice';

const tokenPersistConfig = {
  key: 'token',
  storage: storage,
  whitelist: ['token'],
};

const rootReducer = combineReducers({
  userAuth: persistReducer(tokenPersistConfig, userAuthReducer),
  storyState: storyReducer,
  profileState: profileReducer,
});

export default rootReducer;
