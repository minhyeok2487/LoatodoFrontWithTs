import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeIndex from "./pages/home/HomeIndex";
import TodoIndex from "./pages/todo/TodoIndex";
import Login from "./pages/auth/Login";
import SocialLogin from "./pages/auth/SocialLogin";
import Logout from "./pages/auth/Logout";
import { useRecoilState } from "recoil";
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

function App() {
  const [server, setServer] = useRecoilState(serverState);
  const { data: characters } = useCharacters();
  const { data: member } = useMember();

  useEffect(() => {
    if (characters && member) {
      if (server === "") {
        setServer(getDefaultServer(characters, member));
      }
    }
  }, [characters, member, server]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomeIndex />} />
        <Route path="/login" element={<Login message={""} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/sociallogin" element={<SocialLogin />} />
        <Route path="/todo" element={<TodoIndex />} />
        <Route path="/friends" element={<FriendsIndex />} />
        <Route path="/friends/:nickName" element={<FriendTodo />} />
        <Route path="/setting" element={<CharacterSetting />} />
        <Route path="/comments" element={<CommentsIndex />} />

        {/* 게시글(공지사항) 관련 */}
        <Route path="/boards/:no" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
