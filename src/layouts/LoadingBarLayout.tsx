import { LinearProgress } from "@mui/material";
import { useRecoilState } from "recoil";
import { loading } from "../core/atoms/Loading.atom";
import "../styles/layouts/LoadingBarLayout.css";

const LoadingBarLayout = () => {
  const [loadingState, setLoadingState] = useRecoilState(loading);

  return loadingState ? (
    <div className="loading-overlay">
      <LinearProgress color="success" style={{ height: 7 }} />
    </div>
  ) : null;
};

export default LoadingBarLayout;
