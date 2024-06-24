import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { createTheme } from "@mui/material";
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
import HomeIndex from "@pages/home/HomeIndex";
import ApiKeyUpdateForm from "@pages/member/ApiKeyUpdateForm";
import Example from "@pages/publish/Example";
import CharacterSetting from "@pages/todo/CharacterSetting";
import TodoAllIndex from "@pages/todo/TodoAllIndex";
import TodoIndex from "@pages/todo/TodoIndex";

import GlobalStyles from "@core/GlobalStyles";
import { useCharacters } from "@core/apis/character.api";
import { getMember, useMember } from "@core/apis/member.api";
import { authAtom } from "@core/atoms/auth.atom";
import { themeAtom } from "@core/atoms/theme.atom";
import { serverState } from "@core/atoms/todo.atom";
import { TEST_ACCESS_TOKEN } from "@core/constants";
import { getDefaultServer } from "@core/func/todo.fun";
import theme from "@core/theme";

const materialDefaultTheme = createTheme({
  typography: {
    fontFamily: "inherit",
  },
});

const App = () => {
  const setAuth = useSetRecoilState(authAtom);
  const [server, setServer] = useRecoilState(serverState);
  const { data: characters } = useCharacters();
  const { data: member } = useMember();
  const themeState = useRecoilValue(themeAtom);

  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN") || TEST_ACCESS_TOKEN;

    const autoLogin = async (token: string) => {
      const response = await getMember();
      setAuth({
        token,
        username: response.username,
      });
    };

    autoLogin(token);
  }, []);

  useEffect(() => {
    if (member && characters && characters?.length > 0 && server === "") {
      setServer(getDefaultServer(characters, member));
    }
  }, [characters, member, server]);

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeIndex />} />

            {/* 로그인 관련 */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/sociallogin" element={<SocialLogin />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup/characters" element={<SignUpCharacters />} />

            {/* 숙제 관련 */}
            <Route path="/todo" element={<TodoIndex />} />
            <Route path="/todo/all" element={<TodoAllIndex />} />
            <Route path="/friends" element={<FriendsIndex />} />
            <Route path="/friends/:nickName" element={<FriendTodo />} />
            <Route path="/setting" element={<CharacterSetting />} />

            {/* 코멘트 관련 */}
            <Route path="/comments" element={<CommentsIndex />} />

            {/* 게시글(공지사항) 관련 */}
            <Route path="/boards/:no" element={<Board />} />
            <Route path="/boards/insert" element={<BoardInsertForm />} />

            {/* 회원 관련 */}
            <Route path="/member/apikey" element={<ApiKeyUpdateForm />} />

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
