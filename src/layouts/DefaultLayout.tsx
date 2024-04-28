import '../styles/layouts/DefaultLayout.css';
import { FC } from "react";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default DefaultLayout;
