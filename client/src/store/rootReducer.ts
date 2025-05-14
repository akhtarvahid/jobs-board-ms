import { combineReducers } from '@reduxjs/toolkit'
import userAuthReducer from './user/userAuthSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const tokenPersistConfig = {
  key: 'token',
  storage: storage,
  whitelist: ['token']
}

const rootReducer = combineReducers({
  userAuth: persistReducer(tokenPersistConfig, userAuthReducer)
})

export default rootReducer
