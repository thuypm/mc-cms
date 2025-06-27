import {
  REACT_APP_MS_CLIENT_ID,
  REACT_APP_TENANT_ID,
} from 'utils/constants/environment'
import msLogo from './mslogo.png'
export default function MicrosoftLoginButton() {
  const loginWithMicrosoft = () => {
    const params = new URLSearchParams({
      client_id: REACT_APP_MS_CLIENT_ID,
      response_type: 'code',
      redirect_uri: 'http://localhost/ms-login-oauth2',
      response_mode: 'query',
      scope: 'openid profile email',
      state: 'abc123',
    })
    window.location.href = `https://login.microsoftonline.com/${REACT_APP_TENANT_ID}/oauth2/v2.0/authorize?${params}`
  }

  return (
    <div
      onClick={loginWithMicrosoft}
      className="flex gap-2 border-1 border-gray-300 p-2 border-round-md cursor-pointer justify-content-center align-items-center
      hover:bg-gray-100
      "
    >
      <img src={msLogo} alt="Microsoft" width={20} height={20} />
      <span>Đăng nhập với Microsoft</span>
    </div>
  )
}
