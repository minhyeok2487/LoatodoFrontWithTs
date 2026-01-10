import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import styled from "styled-components";

import { authAtom, authCheckedAtom } from "@core/atoms/auth.atom";
import AdminSidebar from "@components/admin/AdminSidebar";
import AdminHeader from "@components/admin/AdminHeader";

const AdminLayout = () => {
  const auth = useAtomValue(authAtom);
  const authChecked = useAtomValue(authCheckedAtom);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 인증 확인이 완료되지 않았으면 로딩
  if (!authChecked) {
    return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  }

  // TODO: 실제 권한 체크 로직 추가
  // if (auth.role !== "ADMIN") {
  //   return <Navigate to="/" replace />;
  // }

  if (!auth.username) {
    return <Navigate to="/login" replace />;
  }

  return (
    <LayoutWrapper>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainWrapper>
        <AdminHeader
          username={auth.username}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <ContentWrapper>
          <ContentInner>
            <Outlet />
          </ContentInner>
        </ContentWrapper>
      </MainWrapper>
    </LayoutWrapper>
  );
};

export default AdminLayout;

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.app.bg.main};
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  transition: margin-left 0.3s ease;

  ${({ theme }) => theme.medias.max1024} {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 24px;
  margin-top: 64px;
  overflow-y: auto;

  ${({ theme }) => theme.medias.max768} {
    padding: 16px;
  }
`;

const ContentInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 16px;
  color: ${({ theme }) => theme.app.text.light1};
`;
