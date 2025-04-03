import { createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import AdminIndex from "@pages/admin/AdminIndex";
import FindPassword from "@pages/auth/FindPassword";
import Login from "@pages/auth/Login";
import Logout from "@pages/auth/Logout";
import SignUp from "@pages/auth/SignUp";
import SignUpCharacters from "@pages/auth/SignUpCharacters";
import SocialLogin from "@pages/auth/SocialLogin";
import CommentsIndex from "@pages/comment/CommentsIndex";
import CubeIndex from "@pages/cube/CubeIndex";
import FriendTodo from "@pages/friend/FriendTodo";
import FriendsIndex from "@pages/friend/FriendsIndex";
import AppleGame from "@pages/game/AppleGame";
import LogsIndex from "@pages/logs/LogsIndex";
import CommunityDetail from "@pages/main/CommunityDetail";
import CommunityList from "@pages/main/CommunityList";
import HomeIndex from "@pages/main/HomeIndex";
import ApiKeyUpdateForm from "@pages/member/ApiKeyUpdateForm";
import Mypage from "@pages/publish/MyPage";
import SampleComponentsPage from "@pages/publish/SampleComponentsPage";
import CategoryBoard from "@pages/recruitingBoard/CategoryBoard";
import RecruitingBoard from "@pages/recruitingBoard/RecrutingBoard";
import ScheduleIndex2 from "@pages/schedule/ScheduleIndex2";
import CharacterSetting from "@pages/todo/CharacterSetting";
import TodoIndex from "@pages/todo/TodoIndex";

// import Publish from '@pages/publish/Schedule'
import GlobalStyles from "@core/GlobalStyles";
import * as memberApi from "@core/apis/member.api";
import {
  authAtom,
  authCheckedAtom,
  isAccountChangedAtom,
} from "@core/atoms/auth.atom";
import { themeAtom } from "@core/atoms/theme.atom";
import { todoServerAtom } from "@core/atoms/todo.atom";
import { LOCAL_STORAGE_KEYS, TEST_ACCESS_TOKEN } from "@core/constants";
import medias from "@core/constants/medias";
import theme from "@core/constants/theme";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import PageGuard from "@components/PageGuard";
import ToastContainer from "@components/ToastContainer";

const App = () => {
  const queryClient = useQueryClient();

  const [isAccountChanged, setIsAccountChanged] = useAtom(isAccountChangedAtom);
  const [auth, setAuth] = useAtom(authAtom);
  const [authChecked, setAuthChecked] = useAtom(authCheckedAtom);
  const [todoServer, setTodoServer] = useAtom(todoServerAtom);

  const themeState = useAtomValue(themeAtom);

  const materialDefaultTheme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "inherit",
        },
        components: {
          MuiButton: {
            defaultProps: {
              variant: themeState === "dark" ? "contained" : "outlined",
            },
          },
        },
      }),
    [themeState]
  );

  // 광고 관리 함수
  const manageAdsDisplay = (shouldShowAds: boolean) => {
    // 광고 스크립트 관리
    const handleAdsScript = () => {
      const existingScript = document.querySelector(
        'script[src*="adsbygoogle"]'
      );
      if (!shouldShowAds) {
        if (existingScript) {
          existingScript.remove();
        }
        // adsbygoogle 객체 초기화
        if (typeof window !== "undefined" && window.adsbygoogle) {
          window.adsbygoogle = [];
        }
      } else if (!existingScript && shouldShowAds) {
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    };

    // 광고 요소 관리
    const handleAdsElements = () => {
      const adElements = document.querySelectorAll(".adsbygoogle");

      adElements.forEach((adElement) => {
        if (adElement instanceof HTMLElement && adElement.parentElement) {
          if (!shouldShowAds) {
            const element = adElement as HTMLElement;
            element.style.display = "none";
            const classes = element.className
              .split(" ")
              .filter((c) => c !== "adsbygoogle");
            element.className = classes.join(" ");
          } else {
            const element = adElement as HTMLElement;
            element.style.display = "block";
            if (!element.className.includes("adsbygoogle")) {
              element.className = `${element.className} adsbygoogle`.trim();
            }
          }
        }
      });
    };

    try {
      handleAdsScript();
      handleAdsElements();
    } catch (error) {
      console.error("Error managing ads display:", error);
    }
  };

  const currentDateTime = new Date();

  useEffect(() => {
    const token =
      localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken) || TEST_ACCESS_TOKEN;

    const autoLogin = async (token: string) => {
      try {
        const response = await memberApi.getMyInformation();

        setAuth({
          token,
          username: response.username,
          adsDate: response.adsDate,
        });

        // 광고 상태 업데이트
        const shouldShowAds =
          response.adsDate == null ||
          new Date(response.adsDate) < currentDateTime;
        manageAdsDisplay(shouldShowAds); // 광고 상태 업데이트를 여기서 수행

        setAuthChecked(true);
      } catch (error) {
        console.error("Error managing ads display:", error);
      }
    };

    autoLogin(token);
  }, []);

  // 사용자 상태 변경 시 광고 상태 업데이트
  useEffect(() => {
    if (authChecked) {
      const shouldShowAds =
        auth.adsDate == null || new Date(auth.adsDate) < currentDateTime;
      manageAdsDisplay(shouldShowAds);
    }
  }, [auth.adsDate, authChecked]);

  useEffect(() => {
    // 토큰 변경 발생 시 메인 쿼리 invalidate
    if (authChecked) {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getSchedules(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getNotifications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getNotificationStatus(),
      });
    }
  }, [authChecked, auth.token]);

  useEffect(() => {
    if (isAccountChanged) {
      setTodoServer("전체");
      setIsAccountChanged(false);
    }
  }, [isAccountChanged]);

  useEffect(() => {
    if (!todoServer) {
      setTodoServer("전체");
    }
  }, [todoServer]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider
        // mui 컴포넌트들 또한 ThemeProvider로부터 값을 제공받고 있어 materialDefaultTheme와 같이 사용
        // theme.ts의 프로퍼티명이 materialDefaultTheme와 겹치는 것을 방지하기 위해 custom 프로퍼티에 넣었음
        theme={{
          ...materialDefaultTheme,
          currentTheme: themeState,
          app: theme[themeState] || theme.light,
          medias,
        }}
      >
        <GlobalStyles />
        <ToastContainer />

        <Wrapper>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PageGuard>
                    <HomeIndex />
                  </PageGuard>
                }
              />

              <Route
                path="/post"
                element={
                  <PageGuard>
                    <CommunityList />
                  </PageGuard>
                }
              />

              <Route
                path="/post/:communityId"
                element={
                  <PageGuard>
                    <CommunityDetail />
                  </PageGuard>
                }
              />

              {/* 로그인 관련 */}
              <Route
                path="/login"
                element={
                  <PageGuard rules={["ONLY_GUEST"]}>
                    <Login />
                  </PageGuard>
                }
              />
              <Route
                path="/findPassword"
                element={
                  <PageGuard rules={["ONLY_GUEST"]}>
                    <FindPassword />
                  </PageGuard>
                }
              />
              <Route
                path="/logout"
                element={
                  <PageGuard rules={["ONLY_AUTH_USER"]}>
                    <Logout />
                  </PageGuard>
                }
              />
              <Route
                path="/sociallogin"
                element={
                  <PageGuard rules={["ONLY_GUEST"]}>
                    <SocialLogin />
                  </PageGuard>
                }
              />
              <Route
                path="/signup"
                element={
                  <PageGuard rules={["ONLY_GUEST"]}>
                    <SignUp />
                  </PageGuard>
                }
              />

              <Route
                path="/signup/characters"
                element={
                  <PageGuard
                    rules={["ONLY_AUTH_USER", "ONLY_NO_CHARACTERS_USER"]}
                  >
                    <SignUpCharacters />
                  </PageGuard>
                }
              />

              {/* 숙제 관련 */}
              <Route
                path="/todo"
                element={
                  <PageGuard>
                    <TodoIndex />
                  </PageGuard>
                }
              />
              <Route
                path="/friends"
                element={
                  <PageGuard>
                    <FriendsIndex />
                  </PageGuard>
                }
              />
              <Route
                path="/friends/:friendUsername"
                element={
                  <PageGuard>
                    <FriendTodo />
                  </PageGuard>
                }
              />
              <Route
                path="/setting"
                element={
                  <PageGuard>
                    <CharacterSetting />
                  </PageGuard>
                }
              />

              {/* 큐브 관련 */}
              <Route
                path="/cube"
                element={
                  <PageGuard>
                    <CubeIndex />
                  </PageGuard>
                }
              />

              {/* 방명록 관련 */}
              <Route
                path="/comments"
                element={
                  <PageGuard>
                    <CommentsIndex />
                  </PageGuard>
                }
              />

              <Route
                path="/mypage"
                element={
                  <PageGuard>
                    <Mypage />
                  </PageGuard>
                }
              />

              <Route
                path="/schedule"
                element={
                  <PageGuard>
                    <ScheduleIndex2 />
                  </PageGuard>
                }
              />

              {/* 회원 관련 */}
              <Route
                path="/member/apikey"
                element={
                  <PageGuard
                    rules={[
                      "ONLY_AUTH_USER",
                      "ONLY_CHARACTERS_REGISTERED_USER",
                    ]}
                  >
                    <ApiKeyUpdateForm />
                  </PageGuard>
                }
              />

              {/* <Route
                path="/publish"
                element={
                    <Publish />
                }
              /> */}

              <Route
                path="/sample-components"
                element={<SampleComponentsPage />}
              />

              <Route path="/recruiting-board" element={<RecruitingBoard />} />
              <Route
                path="/recruiting-board/:category"
                element={<CategoryBoard />}
              />

              {/* 어드민 관련 */}
              <Route
                path="/admin"
                element={
                  <PageGuard>
                    <AdminIndex />
                  </PageGuard>
                }
              />

              {/* 로그 관련(추후 디자인 잡기) */}
              {/* <Route
                path="/logs"
                element={
                  <PageGuard>
                    <LogsIndex />
                  </PageGuard>
                }
              /> */}

              <Route path="/game/apple" element={<AppleGame />} />
            </Routes>
          </BrowserRouter>
        </Wrapper>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;

const Wrapper = styled.div`
  min-height: 100vh;
`;

// background: ${(props) => props.theme.palette.bg.main};
