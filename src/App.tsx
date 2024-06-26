import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { createTheme } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import Login from "@pages/auth/Login";
import Logout from "@pages/auth/Logout";
import SignUp from "@pages/auth/SignUp";
import SignUpCharacters from "@pages/auth/SignUpCharacters";
import SocialLogin from "@pages/auth/SocialLogin";
import Board from "@pages/boards/Board";
import BoardInsertForm from "@pages/boards/BoardInsertForm";
import CommentsIndex from "@pages/comments/CommentsIndex";
import FriendTodo from "@pages/friends/FriendTodo";
import FriendsIndex from "@pages/friends/FriendsIndex";
import GuideIndex from "@pages/guide/GuideIndex";
import HomeIndex from "@pages/home/HomeIndex";
import ApiKeyUpdateForm from "@pages/member/ApiKeyUpdateForm";
import Example from "@pages/publish/Example";
import CharacterSetting from "@pages/todo/CharacterSetting";
import TodoAllIndex from "@pages/todo/TodoAllIndex";
import TodoIndex from "@pages/todo/TodoIndex";

import GlobalStyles from "@core/GlobalStyles";
import * as memberApi from "@core/apis/member.api";
import { authAtom, authCheckedAtom } from "@core/atoms/auth.atom";
import { themeAtom } from "@core/atoms/theme.atom";
import { serverState } from "@core/atoms/todo.atom";
import { TEST_ACCESS_TOKEN } from "@core/constants";
import queryKeys from "@core/constants/queryKeys";
import { getDefaultServer } from "@core/func/todo.fun";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import theme from "@core/theme";

import PageGuard from "@components/PageGuard";
import ToastContainer from "@components/ToastContainer";

const materialDefaultTheme = createTheme({
  typography: {
    fontFamily: "inherit",
  },
});

const App = () => {
  const queryClient = useQueryClient();

  const [auth, setAuth] = useRecoilState(authAtom);
  const setAuthChecked = useSetRecoilState(authCheckedAtom);
  const [server, setServer] = useRecoilState(serverState);
  const { getCharacters, getCharactersQueryKey } = useCharacters();
  const { getMyInformation, getMyInformationQueryKey } = useMyInformation();
  const themeState = useRecoilValue(themeAtom);

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN") || TEST_ACCESS_TOKEN;

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
      server === ""
    ) {
      setServer(getDefaultServer(getCharacters.data, getMyInformation.data));
    }
  }, [getCharacters.data, getMyInformation.data, server]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: getMyInformationQueryKey });
    queryClient.invalidateQueries({ queryKey: getCharactersQueryKey });
    queryClient.invalidateQueries({ queryKey: [queryKeys.GET_FRIENDS] });
  }, [auth.token]);

  return (
    <ThemeProvider
      // mui 컴포넌트들 또한 ThemeProvider로부터 값을 제공받고 있어 materialDefaultTheme와 같이 사용
      // theme.ts의 프로퍼티명이 materialDefaultTheme와 겹치는 것을 방지하기 위해 custom 프로퍼티에 넣었음
      theme={{
        ...materialDefaultTheme,
        app: theme.palette[themeState],
        medias: theme.medias,
      }}
    >
      <GlobalStyles />
      <Wrapper>
        <ToastContainer />

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

            {/* 회원 관련 */}
            <Route
              path="/member/apikey"
              element={
                <PageGuard
                  rules={["ONLY_AUTH_USER", "ONLY_CHARACTERS_REGISTERED_USER"]}
                >
                  <ApiKeyUpdateForm />
                </PageGuard>
              }
            />

            {/* <Route path="/example" element={<Example />} /> */}
          </Routes>
        </BrowserRouter>
      </Wrapper>
    </ThemeProvider>
  );
};

export default App;

const Wrapper = styled.div`
  min-height: 100vh;
`;

// background: ${(props) => props.theme.palette.bg.main};
