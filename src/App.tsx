import { createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { lazy, Suspense, useEffect, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

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

const HomeIndex = lazy(() => import("@pages/main/HomeIndex"));
const TodoIndex = lazy(() => import("@pages/todo/TodoIndex"));
const CommunityList = lazy(() => import("@pages/main/CommunityList"));
const CommunityDetail = lazy(() => import("@pages/main/CommunityDetail"));
const Login = lazy(() => import("@pages/auth/Login"));
const FindPassword = lazy(() => import("@pages/auth/FindPassword"));
const Logout = lazy(() => import("@pages/auth/Logout"));
const SocialLogin = lazy(() => import("@pages/auth/SocialLogin"));
const SignUp = lazy(() => import("@pages/auth/SignUp"));
const SignUpCharacters = lazy(() => import("@pages/auth/SignUpCharacters"));
const GeneralTodoIndex = lazy(() => import("@pages/generalTodo/GeneralTodoIndex"));
const FriendsIndex = lazy(() => import("@pages/friend/FriendsIndex"));
const FriendTodo = lazy(() => import("@pages/friend/FriendTodo"));
const CharacterSetting = lazy(() => import("@pages/todo/CharacterSetting"));
const CubeIndex = lazy(() => import("@pages/cube/CubeIndex"));
const CommentsIndex = lazy(() => import("@pages/comment/CommentsIndex"));
const Mypage = lazy(() => import("@pages/publish/MyPage"));
const ScheduleIndex2 = lazy(() => import("@pages/schedule/ScheduleIndex2"));
const PrivacyPolicy = lazy(() => import("@pages/policy/PrivacyPolicy"));
const ApiKeyUpdateForm = lazy(() => import("@pages/member/ApiKeyUpdateForm"));
const SampleComponentsPage = lazy(() => import("@pages/publish/SampleComponentsPage"));
const RecruitingBoard = lazy(() => import("@pages/recruitingBoard/RecrutingBoard"));
const CategoryBoard = lazy(() => import("@pages/recruitingBoard/CategoryBoard"));
const LogsIndex = lazy(() => import("@pages/logs/LogsIndex"));
const AnalysisIndex = lazy(() => import("@pages/analysis/AnalysisIndex"));
const ArmoryIndex = lazy(() => import("@pages/armory/ArmoryIndex"));
const AppleGame = lazy(() => import("@pages/game/AppleGame"));

const AdminLayout = lazy(() => import("@layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("@pages/admin"));
const CharacterManagement = lazy(() => import("@pages/admin/characters"));
const CommentManagement = lazy(() => import("@pages/admin/comments"));
const ContentManagement = lazy(() => import("@pages/admin/content"));
const FriendManagement = lazy(() => import("@pages/admin/friends"));
const MemberManagement = lazy(() => import("@pages/admin/members"));
const NotificationManagement = lazy(() => import("@pages/admin/notifications"));

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
          role: response.role,
          adsDate: response.adsDate,
        });

        setAuthChecked(true);
      } catch (error) {
        // eslint-disable-next-line no-console
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
              <Suspense fallback={<LoadingFallback />}>
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

                {/* 전투정보실 */}
                <Route
                  path="/character-profile"
                  element={<ArmoryIndex />}
                />

                <Route path="/game/apple" element={<AppleGame />} />
              </Routes>
              </Suspense>
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

const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;
