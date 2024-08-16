import { createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import FindPassword from "@pages/auth/FindPassword";
import Login from "@pages/auth/Login";
import Logout from "@pages/auth/Logout";
import SignUp from "@pages/auth/SignUp";
import SignUpCharacters from "@pages/auth/SignUpCharacters";
import SocialLogin from "@pages/auth/SocialLogin";
import Board from "@pages/board/Board";
import BoardInsertForm from "@pages/board/BoardInsertForm";
import CommentsIndex from "@pages/comment/CommentsIndex";
import FaqIndex from "@pages/faq/FaqIndex";
import FriendTodo from "@pages/friend/FriendTodo";
import FriendsIndex from "@pages/friend/FriendsIndex";
import GuideIndex from "@pages/guide/GuideIndex";
import HomeIndex from "@pages/home/HomeIndex";
import ApiKeyUpdateForm from "@pages/member/ApiKeyUpdateForm";
import ScheduleIndex from "@pages/schedule/ScheduleIndex";
import CharacterSetting from "@pages/todo/CharacterSetting";
import TodoAllIndex from "@pages/todo/TodoAllIndex";
import TodoIndex from "@pages/todo/TodoIndex";

// import Publish from '@pages/publish/Schedule'
import GlobalStyles from "@core/GlobalStyles";
import * as memberApi from "@core/apis/member.api";
import { authAtom, authCheckedAtom } from "@core/atoms/auth.atom";
import { themeAtom } from "@core/atoms/theme.atom";
import { serverAtom } from "@core/atoms/todo.atom";
import { LOCAL_STORAGE_KEYS, TEST_ACCESS_TOKEN } from "@core/constants";
import medias from "@core/constants/medias";
import theme from "@core/constants/theme";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import { getDefaultServer } from "@core/utils/todo.util";

import PageGuard from "@components/PageGuard";
import ToastContainer from "@components/ToastContainer";

const App = () => {
  const queryClient = useQueryClient();

  const [auth, setAuth] = useAtom(authAtom);
  const [authChecked, setAuthChecked] = useAtom(authCheckedAtom);
  const [server, setServer] = useAtom(serverAtom);

  const getCharacters = useCharacters();
  const getMyInformation = useMyInformation();
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

  useEffect(() => {
    const token =
      localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken) || TEST_ACCESS_TOKEN;

    const autoLogin = async (token: string) => {
      const response = await memberApi.getMyInformation();

      setAuth({
        token,
        username: response.username,
      });
      setAuthChecked(true);
    };

    autoLogin(token);
  }, []);

  useEffect(() => {
    if (
      getMyInformation.data &&
      getCharacters.data &&
      getCharacters.data.length > 0 &&
      !server
    ) {
      setServer(getDefaultServer(getCharacters.data, getMyInformation.data));
    }
  }, [getCharacters.data, getMyInformation.data, server]);

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
                path="/todo/all"
                element={
                  <PageGuard>
                    <TodoAllIndex />
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
                path="/friends/:nickName"
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

              {/* 방명록 관련 */}
              <Route
                path="/comments"
                element={
                  <PageGuard>
                    <CommentsIndex />
                  </PageGuard>
                }
              />

              {/* 가이드 관련 */}
              <Route
                path="/guide"
                element={
                  <PageGuard>
                    <GuideIndex />
                  </PageGuard>
                }
              />
              <Route
                path="/faq"
                element={
                  <PageGuard>
                    <FaqIndex />
                  </PageGuard>
                }
              />

              {/* 게시글(공지사항) 관련 */}
              <Route
                path="/boards/:no"
                element={
                  <PageGuard>
                    <Board />
                  </PageGuard>
                }
              />
              <Route
                path="/boards/insert"
                element={
                  <PageGuard>
                    <BoardInsertForm />
                  </PageGuard>
                }
              />
              <Route
                path="/schedule"
                element={
                  <PageGuard>
                    <ScheduleIndex />
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

              {/* <Route path="/buttons" element={<ButtonsPage />} /> */}
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
