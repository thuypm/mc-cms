import axios from 'axios'
import LoadingDot from 'components/LoadingDot'
import AuthLayout from 'layouts/AuthLayout'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { REACT_APP_SERVER_API } from 'utils/constants/environment'
// import { CountryService } from '../service/CountryService';
// import './FormDemo.css';

const LoginOauth2 = () => {
  const [loading, setLoading] = useState(false)
  const [errorBackend, setErrorBackend] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const onGetToken = useCallback(async () => {
    const code = searchParams.get('code')

    if (code) {
      setLoading(true)
      try {
        const { data } = await axios.request({
          method: 'post',
          baseURL: REACT_APP_SERVER_API,
          url: '/api/auth/microsoft/callback',
          data: {
            code,
          },
        })

        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken)
          navigate('/')
        }
      } catch (error) {
        setErrorBackend(error?.response?.data?.message)
      } finally {
        setLoading(false)
      }
    }
  }, [searchParams])

  useEffect(() => {
    onGetToken()
  }, [onGetToken])
  return (
    <AuthLayout showLogo>
      {loading ? <LoadingDot /> : errorBackend ? errorBackend : <></>}
    </AuthLayout>
  )
}
export default LoginOauth2
