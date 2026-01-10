import { useState } from "react";
import styled from "styled-components";
import { MdSend } from "@react-icons/all-files/md/MdSend";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import { toast } from "react-toastify";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
  AdminCard,
} from "@components/admin";
import Button from "@components/Button";
import type { AdminNotification } from "@core/types/admin";
import {
  useNotifications,
  useSendBroadcast,
  useDeleteNotification,
} from "./hooks/useNotifications";

const PAGE_SIZE = 20;

const NotificationManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 전체 공지 발송 폼
  const [broadcastContent, setBroadcastContent] = useState("");
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  const { data, isLoading } = useNotifications({
    page: currentPage + 1,
    limit: PAGE_SIZE,
  });

  const sendBroadcast = useSendBroadcast();
  const deleteNotification = useDeleteNotification();

  const handleToggleSelect = (notificationId: number) => {
    setSelectedIds((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = data?.content.map((n) => n.notificationId) ?? [];
    if (currentPageIds.length > 0 && selectedIds.length === currentPageIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentPageIds);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning("삭제할 알림을 선택해주세요.");
      return;
    }
    if (
      window.confirm(`선택된 ${selectedIds.length}개의 알림을 삭제하시겠습니까?`)
    ) {
      try {
        await Promise.all(
          selectedIds.map((id) => deleteNotification.mutateAsync(id))
        );
        toast.success(`${selectedIds.length}개 알림이 삭제되었습니다.`);
        setSelectedIds([]);
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (window.confirm("이 알림을 삭제하시겠습니까?")) {
      try {
        await deleteNotification.mutateAsync(notificationId);
        toast.success("알림이 삭제되었습니다.");
        setSelectedIds((prev) => prev.filter((id) => id !== notificationId));
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastContent.trim()) {
      toast.error("공지 내용을 입력해주세요.");
      return;
    }
    if (window.confirm("전체 사용자에게 공지를 발송하시겠습니까?")) {
      try {
        const result = await sendBroadcast.mutateAsync({
          content: broadcastContent,
        });
        toast.success(`전체 공지가 ${result.sentCount}명에게 발송되었습니다.`);
        setBroadcastContent("");
        setShowBroadcastForm(false);
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const columns = [
    {
      key: "select",
      header: (
        <Checkbox
          type="checkbox"
          checked={
            (data?.content.length ?? 0) > 0 &&
            selectedIds.length === (data?.content.length ?? 0)
          }
          onChange={handleSelectAll}
        />
      ),
      width: "40px",
      render: (item: AdminNotification) => (
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
      width: "70px",
    },
    {
      key: "receiverUsername",
      header: "수신자",
      width: "150px",
      render: (item: AdminNotification) => (
        <UsernameCell>{item.receiverUsername}</UsernameCell>
      ),
    },
    {
      key: "content",
      header: "내용",
      render: (item: AdminNotification) => (
        <ContentCell $unread={!item.isRead}>{item.content}</ContentCell>
      ),
    },
    {
      key: "isRead",
      header: "읽음",
      width: "80px",
      render: (item: AdminNotification) => (
        <AdminBadge variant={item.isRead ? "gray" : "primary"}>
          {item.isRead ? "읽음" : "안읽음"}
        </AdminBadge>
      ),
    },
    {
      key: "createdDate",
      header: "발송일",
      width: "170px",
      render: (item: AdminNotification) =>
        new Date(item.createdDate).toLocaleString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "80px",
      render: (item: AdminNotification) => (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleDelete(item.notificationId)}
          disabled={deleteNotification.isPending}
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
              <Label>공지 내용</Label>
              <Textarea
                value={broadcastContent}
                onChange={(e) => setBroadcastContent(e.target.value)}
                placeholder="전체 사용자에게 발송할 공지 내용을 입력하세요"
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
              <Button
                variant="contained"
                onClick={handleSendBroadcast}
                disabled={sendBroadcast.isPending}
              >
                <MdSend size={16} />
                {sendBroadcast.isPending ? "발송 중..." : "발송"}
              </Button>
            </BroadcastActions>
          </BroadcastForm>
        </AdminCard>
      )}

      {selectedIds.length > 0 && (
        <BulkActions>
          <span>{selectedIds.length}개 선택됨</span>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleBulkDelete}
            disabled={deleteNotification.isPending}
          >
            <MdDelete size={16} />
            선택 삭제
          </Button>
        </BulkActions>
      )}

      <TableInfo>
        총 <strong>{(data?.totalElements ?? 0).toLocaleString()}</strong>개의 알림
      </TableInfo>

      <AdminTable
        columns={columns}
        data={data?.content ?? []}
        keyExtractor={(item) => item.notificationId}
        emptyMessage="알림이 없습니다."
        isLoading={isLoading}
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 0}
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

const ContentCell = styled.span<{ $unread: boolean }>`
  font-weight: ${({ $unread }) => ($unread ? 600 : 400)};
  color: ${({ theme }) => theme.app.text.main};
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
