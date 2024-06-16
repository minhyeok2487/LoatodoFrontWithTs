import styled from "@emotion/styled";

import { useCharacters } from "@core/apis/Character.api";

const SignUpCharactersNotify = () => {
  const { data: characters } = useCharacters();

  if (characters?.length !== 0) {
    return null;
  }

  return (
    <Button
      type="button"
      onClick={() => {
        window.location.href = "/signup/characters";
      }}
    >
      캐릭터 등록하기
    </Button>
  );
};

export default SignUpCharactersNotify;

const Button = styled.button`
  display: flex;
  justify-content: center;
  padding: 10px 0;
  margin-bottom: 5px;
  width: 100%;
  max-width: 1220px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  transition: all 0.3s;
  transform: scale(1);

  color: ${({ theme }) => theme.app.white};
  font-size: 16px;
  font-weight: 700;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    color: #ffda79;
  }
`;
