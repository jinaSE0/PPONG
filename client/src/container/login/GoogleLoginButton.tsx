import styled from 'styled-components';
import ICON_GOOGLE from '../../assets/ic_login_google.svg';

const GoogleLoginWrapper = styled.button`
  position: relative;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border: 0.5px solid #9fa6ad;
  box-sizing: border-box;
  img {
    position: absolute;
    left: 32px;
    width: 18px;
    height: 18px;
  }
`;

const Text = styled.span`
  font-family: 'Noto Sans KR';
  font-weight: 400;
  text-align: center;
  vertical-align: top;
  letter-spacing: -0.05em;
  font-size: 14px;
  line-height: auto;
  color: #3a3f44;
`;

const handleGoogleLogin = async () => {
  window.location.href = `${process.env.REACT_APP_OAUTH_URL}/oauth2/authorization/google `;
};

const GoogleLoginButton = () => {
  return (
    <GoogleLoginWrapper onClick={handleGoogleLogin}>
      <img src={ICON_GOOGLE} alt="google" />
      <Text>구글 로그인</Text>
    </GoogleLoginWrapper>
  );
};

export default GoogleLoginButton;
