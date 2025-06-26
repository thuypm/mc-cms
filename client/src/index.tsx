import { history } from 'context/store'
import { WorkspaceContextProvider } from 'context/workspace.context'
import { PrimeReactProvider } from 'primereact/api'
import React from 'react'
import ReactDOM from 'react-dom/client'
import CustomRouter from 'routers/CustomRouter'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './styles/index.scss'

import { ToastFC } from 'utils/toast'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.Fragment>
    <CustomRouter history={history}>
      <WorkspaceContextProvider>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </WorkspaceContextProvider>
    </CustomRouter>
    <ToastFC />
  </React.Fragment>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
