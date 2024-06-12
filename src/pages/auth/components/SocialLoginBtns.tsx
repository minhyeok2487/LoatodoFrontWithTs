import { socialLogin } from "@core/apis/Auth.api";

// 소셜 로그인 버튼들
const SocialLoginBtns = () => {
  const handleSocialLogin = (provider: string) => {
    socialLogin(provider);
  };

  return (
    <div className="auth-login-btns">
      <button
        type="button"
        className="login-with-google-btn"
        onClick={() => handleSocialLogin("google")}
      >
        구글 로그인으로 시작하기
      </button>
    </div>
  );
};

export default SocialLoginBtns;
