import React from 'react'
import RootStore from '../store/RootStore'

import { createBrowserHistory } from 'history'
export const history = createBrowserHistory()

export const StoresContext = React.createContext(new RootStore(history))
export const useStore = () => React.useContext(StoresContext)
