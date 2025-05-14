import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from './router'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { QueryClientProvider } from 'react-query'
import queryClient from './react-query'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
)
