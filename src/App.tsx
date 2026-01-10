import { createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import AdminLayout from "@layouts/AdminLayout";
import AdminDashboard from "@pages/admin";
import CharacterManagement from "@pages/admin/characters";
import CommentManagement from "@pages/admin/comments";
import ContentManagement from "@pages/admin/content";
import DonationManagement from "@pages/admin/donations";
import FriendManagement from "@pages/admin/friends";
import MemberManagement from "@pages/admin/members";
import NotificationManagement from "@pages/admin/notifications";
import AnalysisIndex from "@pages/analysis/AnalysisIndex";
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
import GeneralTodoIndex from "@pages/generalTodo/GeneralTodoIndex";
import LogsIndex from "@pages/logs/LogsIndex";
import CommunityDetail from "@pages/main/CommunityDetail";
import CommunityList from "@pages/main/CommunityList";
import HomeIndex from "@pages/main/HomeIndex";
import ApiKeyUpdateForm from "@pages/member/ApiKeyUpdateForm";
import PrivacyPolicy from "@pages/policy/PrivacyPolicy";
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

import ProsperNewSession from "./ProsperNewSession";

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

        setAuthChecked(true);
      } catch (error) {
        console.error("Auto login error:", error);
      }
    };

    autoLogin(token);
  }, []);

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
    <>
      <ProsperNewSession />

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
                  path="/general-todo"
                  element={
                    <PageGuard>
                      <GeneralTodoIndex />
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

                <Route path="/policy/privacy" element={<PrivacyPolicy />} />

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
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="members" element={<MemberManagement />} />
                  <Route path="characters" element={<CharacterManagement />} />
                  <Route path="content" element={<ContentManagement />} />
                  <Route path="donations" element={<DonationManagement />} />
                  <Route path="comments" element={<CommentManagement />} />
                  <Route path="friends" element={<FriendManagement />} />
                  <Route path="notifications" element={<NotificationManagement />} />
                </Route>

                {/* 로그 관련(추후 디자인 잡기) */}
                <Route
                  path="/logs"
                  element={
                    <PageGuard>
                      <LogsIndex />
                    </PageGuard>
                  }
                />

                <Route
                  path="/analysis"
                  element={
                    <PageGuard>
                      <AnalysisIndex />
                    </PageGuard>
                  }
                />

                <Route path="/game/apple" element={<AppleGame />} />
              </Routes>
            </BrowserRouter>
          </Wrapper>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
};

export default App;

const Wrapper = styled.div`
  min-height: 100vh;
`;
