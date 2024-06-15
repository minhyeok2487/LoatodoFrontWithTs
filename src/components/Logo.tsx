import { FC } from "react";
import { Link } from "react-router-dom";

// 로고 출력 컴포넌트
interface Props {
  isDarkMode: boolean;
}

const Logo: FC<Props> = ({ isDarkMode }) => {
  return (
    <Link to="/" className="logo">
      {isDarkMode ? (
        <img alt="logo" src="/logo_white.png" />
      ) : (
        <img alt="logo" src="/logo.png" />
      )}
    </Link>
  );
};

export default Logo;
