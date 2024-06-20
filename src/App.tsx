import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeIndex from "./pages/home/HomeIndex";
import TodoIndex from "./pages/todo/TodoIndex";
import Login from "./pages/auth/Login";
import SocialLogin from "./pages/auth/SocialLogin";
import Logout from "./pages/auth/Logout";
import { useRecoilState, useRecoilValue } from "recoil";
import { serverState } from "./core/atoms/Todo.atom";
import { useCharacters } from "./core/apis/Character.api";
import { useMember } from "./core/apis/Member.api";
import { useEffect } from "react";
import { getDefaultServer } from "./core/func/todo.fun";
import FriendsIndex from "./pages/friends/FriendsIndex";
import FriendTodo from "./pages/friends/FriendTodo";
import CharacterSetting from "./components/CharacterSetting";
import CommentsIndex from "./pages/comments/CommentsIndex";
import Board from "./pages/boards/Board";
import BoardInsertForm from "./pages/boards/BoardInsertForm";
import ApiKeyUpdateForm from "./pages/member/ApiKeyUpdateForm";
import { ThemeEnums } from "./core/enum/ThemeEnum";
import { themeMode } from "./core/atoms/theme.atom";
import SignUp from "./pages/auth/SignUp";
import SignUpCharacters from "./pages/auth/SignUpCharacters";
import TodoAllIndex from "./pages/todo/TodoAllIndex";

function App() {
  const [server, setServer] = useRecoilState(serverState);
  const { data: characters } = useCharacters();
  const { data: member } = useMember();
  const theme: ThemeEnums = useRecoilValue(themeMode);
  const { LIGHT } = ThemeEnums;

  useEffect(() => {
    if (member && characters && characters?.length > 0) {
      if (server === "") {
        setServer(getDefaultServer(characters, member));
      }
    }
  }, [characters, member, server]);

  return (
    <div
      className={theme === LIGHT ? "light" : "dark"}
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="" element={<HomeIndex />} />

          {/* 로그인 관련 */}
          <Route path="/login" element={<Login message={""} />} />
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
          <Route path="member/apikey" element={<ApiKeyUpdateForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
