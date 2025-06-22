import { useLayoutEffect, useState } from 'react'
import { Router } from 'react-router-dom'
import { branchRouterId } from 'utils/constants/user'
import { isBranchPage } from './routes'

const CustomRouter = ({ history, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  })

  useLayoutEffect(() => history.listen(setState), [history])

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
      basename={isBranchPage ? branchRouterId : ''}
    />
  )
}
export default CustomRouter
