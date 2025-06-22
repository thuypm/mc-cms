import PrivateLayoutContent from 'layouts/PrivateLayout'
import PublicLayout from 'layouts/PublicLayout'
import { observer } from 'mobx-react'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Route, Routes } from 'react-router-dom'
import { publicRoutes } from 'routers/routes'
import { ToastFC } from 'utils/toast'

function App() {
  return (
    <>
      <Routes>
        {publicRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={<PublicLayout>{route.element}</PublicLayout>}
          ></Route>
        ))}
        <Route
          path={'/*'}
          element={<PrivateLayoutContent></PrivateLayoutContent>}
        ></Route>
      </Routes>
      <ConfirmDialog />
    </>
  )
}

export default observer(App)
