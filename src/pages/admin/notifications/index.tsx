import { useState } from "react";
import styled from "styled-components";
import { MdSend } from "@react-icons/all-files/md/MdSend";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
  AdminCard,
} from "@components/admin";
import Button from "@components/Button";

// 알림 타입
type NotificationType = "system" | "friend" | "comment" | "raid" | "broadcast";

// 목업 데이터
const MOCK_NOTIFICATIONS = Array.from({ length: 85 }, (_, i) => ({
  notificationId: i + 1,
  memberId: Math.floor(Math.random() * 50) + 1,
  memberUsername: `user${String(Math.floor(Math.random() * 50) + 1).padStart(4, "0")}`,
  type: ["system", "friend", "comment", "raid", "broadcast"][
    Math.floor(Math.random() * 5)
  ] as NotificationType,
  title:
    i % 5 === 0
      ? "[공지] 서버 점검 안내"
      : i % 5 === 1
        ? "새로운 깐부 요청"
        : i % 5 === 2
          ? "방명록에 새 댓글"
          : i % 5 === 3
            ? "레이드 일정 알림"
            : "시스템 알림",
  message:
    i % 5 === 0
      ? "2024년 1월 15일 06:00 ~ 10:00 서버 점검이 진행됩니다."
      : i % 5 === 1
        ? "user0023님이 깐부 요청을 보냈습니다."
        : i % 5 === 2
          ? "user0045님이 방명록에 댓글을 남겼습니다."
          : i % 5 === 3
            ? "오늘 21:00 카멘 하드 레이드 일정이 있습니다."
            : "시스템 알림 메시지입니다.",
  isRead: i % 3 !== 0,
  createdDate: new Date(
    Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
  ).toISOString(),
}));

const PAGE_SIZE = 15;

const NotificationManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "전체">("전체");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 전체 공지 발송 폼
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  const filteredNotifications = MOCK_NOTIFICATIONS.filter((notification) => {
    const matchesSearch =
      notification.memberUsername
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "전체" || notification.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredNotifications.length / PAGE_SIZE);
  const paginatedNotifications = filteredNotifications.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleToggleSelect = (notificationId: number) => {
    setSelectedIds((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedNotifications.map((n) => n.notificationId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 알림을 선택해주세요.");
      return;
    }
    if (
      window.confirm(`선택된 ${selectedIds.length}개의 알림을 삭제하시겠습니까?`)
    ) {
      alert(`${selectedIds.length}개 알림 삭제 (목업)`);
      setSelectedIds([]);
    }
  };

  const handleDelete = (notificationId: number) => {
    if (window.confirm("이 알림을 삭제하시겠습니까?")) {
      alert(`알림 ${notificationId} 삭제 (목업)`);
    }
  };

  const handleSendBroadcast = () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (window.confirm("전체 사용자에게 공지를 발송하시겠습니까?")) {
      alert("전체 공지 발송 완료 (목업)");
      setBroadcastTitle("");
      setBroadcastMessage("");
      setShowBroadcastForm(false);
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "broadcast":
        return <AdminBadge variant="error">전체공지</AdminBadge>;
      case "system":
        return <AdminBadge variant="warning">시스템</AdminBadge>;
      case "friend":
        return <AdminBadge variant="primary">깐부</AdminBadge>;
      case "comment":
        return <AdminBadge variant="success">댓글</AdminBadge>;
      case "raid":
        return <AdminBadge variant="gray">레이드</AdminBadge>;
      default:
        return <AdminBadge variant="gray">{type}</AdminBadge>;
    }
  };

  // 통계
  const stats = {
    total: MOCK_NOTIFICATIONS.length,
    unread: MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length,
    broadcasts: MOCK_NOTIFICATIONS.filter((n) => n.type === "broadcast").length,
  };

  const columns = [
    {
      key: "select",
      header: (
        <Checkbox
          type="checkbox"
          checked={
            paginatedNotifications.length > 0 &&
            selectedIds.length === paginatedNotifications.length
          }
          onChange={handleSelectAll}
        />
      ),
      width: "40px",
      render: (item: typeof MOCK_NOTIFICATIONS[0]) => (
        <Checkbox
          type="checkbox"
          checked={selectedIds.includes(item.notificationId)}
          onChange={() => handleToggleSelect(item.notificationId)}
        />
      ),
    },
    {
      key: "notificationId",
      header: "ID",
      width: "60px",
    },
    {
      key: "type",
      header: "유형",
      width: "90px",
      render: (item: typeof MOCK_NOTIFICATIONS[0]) => getTypeBadge(item.type),
    },
    {
      key: "memberUsername",
      header: "수신자",
      width: "120px",
      render: (item: typeof MOCK_NOTIFICATIONS[0]) => (
        <UsernameCell>{item.memberUsername}</UsernameCell>
      ),
    },
    {
      key: "content",
      header: "내용",
      render: (item: typeof MOCK_NOTIFICATIONS[0]) => (
        <ContentCell>
          <ContentTitle $unread={!item.isRead}>{item.title}</ContentTitle>
          <ContentMessage>{item.message}</ContentMessage>
        </ContentCell>
      ),
    },
    {
      key: "isRead",
      header: "읽음",
      width: "70px",
      render: (item: typeof MOCK_NOTIFICATIONS[0]) => (
        <AdminBadge variant={item.isRead ? "gray" : "primary"}>
          {item.isRead ? "읽음" : "안읽음"}
        </AdminBadge>
      ),
    },
    {
      key: "createdDate",
      header: "발송일",
      width: "150px",
      render: (item: typeof MOCK_NOTIFICATIONS[0]) =>
        new Date(item.createdDate).toLocaleString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "80px",
      render: (item: typeof MOCK_NOTIFICATIONS[0]) => (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleDelete(item.notificationId)}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <div>
      <HeaderRow>
        <AdminPageTitle
          title="알림 관리"
          description="사용자 알림을 조회하고 전체 공지를 발송합니다"
        />
        <Button
          variant="contained"
          onClick={() => setShowBroadcastForm(!showBroadcastForm)}
        >
          <MdSend size={18} />
          전체 공지 발송
        </Button>
      </HeaderRow>

      {showBroadcastForm && (
        <AdminCard>
          <BroadcastForm>
            <BroadcastTitle>전체 공지 발송</BroadcastTitle>
            <FormGroup>
              <Label>제목</Label>
              <Input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="공지 제목을 입력하세요"
              />
            </FormGroup>
            <FormGroup>
              <Label>내용</Label>
              <Textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="공지 내용을 입력하세요"
                rows={4}
              />
            </FormGroup>
            <BroadcastActions>
              <Button
                variant="outlined"
                onClick={() => setShowBroadcastForm(false)}
              >
                취소
              </Button>
              <Button variant="contained" onClick={handleSendBroadcast}>
                <MdSend size={16} />
                발송
              </Button>
            </BroadcastActions>
          </BroadcastForm>
        </AdminCard>
      )}

      <StatsRow>
        <StatCard>
          <StatLabel>전체 알림</StatLabel>
          <StatValue>{stats.total}건</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>읽지 않은 알림</StatLabel>
          <StatValue $warning>{stats.unread}건</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>전체 공지</StatLabel>
          <StatValue $highlight>{stats.broadcasts}건</StatValue>
        </StatCard>
      </StatsRow>

      <FilterSection>
        <SearchBar onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="수신자, 제목, 내용으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="contained">
            검색
          </Button>
        </SearchBar>

        <FilterGroup>
          <FilterLabel>유형</FilterLabel>
          <FilterSelect
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as NotificationType | "전체");
              setCurrentPage(0);
            }}
          >
            <option value="전체">전체</option>
            <option value="broadcast">전체공지</option>
            <option value="system">시스템</option>
            <option value="friend">깐부</option>
            <option value="comment">댓글</option>
            <option value="raid">레이드</option>
          </FilterSelect>
        </FilterGroup>
      </FilterSection>

      {selectedIds.length > 0 && (
        <BulkActions>
          <span>{selectedIds.length}개 선택됨</span>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleBulkDelete}
          >
            <MdDelete size={16} />
            선택 삭제
          </Button>
        </BulkActions>
      )}

      <TableInfo>
        총 <strong>{filteredNotifications.length}</strong>개의 알림
      </TableInfo>

      <AdminTable
        columns={columns}
        data={paginatedNotifications}
        keyExtractor={(item) => item.notificationId}
        emptyMessage="알림이 없습니다."
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default NotificationManagement;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  button {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const BroadcastForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BroadcastTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const Textarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const BroadcastActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  button {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const StatLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 8px 0;
`;

const StatValue = styled.p<{ $highlight?: boolean; $warning?: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme, $highlight, $warning }) =>
    $highlight ? "#667eea" : $warning ? "#f59e0b" : theme.app.text.dark1};
  margin: 0;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const SearchBar = styled.form`
  display: flex;
  gap: 12px;
`;

const SearchInput = styled.input`
  width: 280px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const BulkActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 10px;
  margin-bottom: 16px;

  span {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.app.text.main};
  }

  button {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const TableInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 16px 0;

  strong {
    color: ${({ theme }) => theme.app.text.main};
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const UsernameCell = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const ContentCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ContentTitle = styled.span<{ $unread: boolean }>`
  font-weight: ${({ $unread }) => ($unread ? 600 : 400)};
  color: ${({ theme }) => theme.app.text.dark1};
`;

const ContentMessage = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
