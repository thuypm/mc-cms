import { history } from 'context/store'
import { WorkspaceContextProvider } from 'context/workspace.context'
import { addLocale, PrimeReactProvider } from 'primereact/api'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import CustomRouter from 'routers/CustomRouter'
import App from './App'
import i18n from './i18n'
import reportWebVitals from './reportWebVitals'
import './styles/index.scss'

import { locale } from 'primereact/api'
import { ToastFC } from 'utils/toast'
addLocale('jp', {
  firstDayOfWeek: 1,
  dayNames: [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'],
  monthNames: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  monthNamesShort: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  today: 'Hoy',
  clear: 'Limpiar',
  //...
})
locale('jp')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.Fragment>
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <CustomRouter
        history={history}
        // baseName={isBranchPage ? branchRouterId : null}
      >
        <WorkspaceContextProvider>
          <PrimeReactProvider>
            <App />
          </PrimeReactProvider>

          {/* </ConfigProvider> */}
        </WorkspaceContextProvider>
      </CustomRouter>
      <ToastFC />
    </I18nextProvider>
  </React.Fragment>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
