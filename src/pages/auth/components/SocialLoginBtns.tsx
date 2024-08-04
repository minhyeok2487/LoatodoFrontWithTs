import { css } from "styled-components";

import { socialLogin } from "@core/apis/auth.api";

import Button from "@components/Button";

import GoogleIcon from "@assets/svg/GoogleIcon";

// 소셜 로그인 버튼들
const SocialLoginBtns = () => {
  const handleSocialLogin = (provider: string) => {
    socialLogin(provider);
  };

  return (
    <Button
      css={css`
        svg {
          width: 24px;
          height: 24px;
        }

        font-weight: 700;
        border-radius: 20px;
      `}
      fullWidth
      type="button"
      variant="outlined"
      size="large"
      startIcon={<GoogleIcon />}
      onClick={() => handleSocialLogin("google")}
    >
      구글 로그인으로 시작하기
    </Button>
  );
};

export default SocialLoginBtns;

/* const Button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 50px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  font-size: 16px;
  font-weight: 700;
  border-radius: 20px;
`;
 */
