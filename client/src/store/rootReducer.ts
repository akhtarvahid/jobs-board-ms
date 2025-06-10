import { combineReducers } from '@reduxjs/toolkit'
import userAuthReducer from './user/userAuthSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import storyReducer from './story/storySlice'

const tokenPersistConfig = {
  key: 'token',
  storage: storage,
  whitelist: ['token']
}

const rootReducer = combineReducers({
  userAuth: persistReducer(tokenPersistConfig, userAuthReducer),
  storyState: storyReducer
})

export default rootReducer
