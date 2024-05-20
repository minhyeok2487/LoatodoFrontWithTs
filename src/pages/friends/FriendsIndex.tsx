import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "../../styles/pages/FriendsIndex.css";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useFriends } from "../../core/apis/Friend.api";
import { calculateRaidStatus } from "../../core/func/todo.fun";
import { useNavigate } from "react-router-dom";
import MainRaids from "../home/components/MainRaids";

interface Column {
  id: string;
  label: string;
  minWidth: number;
}

const columns: Column[] = [
  { id: "mainCharacter", label: "대표 캐릭터", minWidth: 170 },
  { id: "baltan", label: "발탄", minWidth: 50 },
  { id: "biacKiss", label: "비아키스", minWidth: 50 },
  { id: "koukuSaiton", label: "쿠크세이튼", minWidth: 50 },
  { id: "abrelshud", label: "아브렐슈드", minWidth: 50 },
  { id: "kayangel", label: "카양겔", minWidth: 50 },
  { id: "illiakan", label: "일리아칸", minWidth: 50 },
  { id: "ivoryTower", label: "상아탑", minWidth: 50 },
  { id: "kamen", label: "카멘", minWidth: 50 },
  { id: "echidna", label: "에키드나", minWidth: 50 },
  { id: "behemoth", label: "베히모스", minWidth: 50 },
];

const FriendsIndex = () => {
  const { data: friends } = useFriends();
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigate = useNavigate();
  const handleRowClick = (nickName: string) => {
    const link = `/friends/${nickName}`;
    navigate(link);
  };

  if (friends === undefined) {
    return null;
  }

  return (
    <DefaultLayout>
      <div className="friends-wrap">
        <div className="friends-button-group">
          {/* <div className="friends-button-box">
            <Button
              variant="text"
              className="add-button"
              startIcon={<GroupAddIcon />}
            >
              깐부 추가
            </Button>
            <Button
              variant="text"
              className="remove-button"
              startIcon={<GroupRemoveIcon />}
            >
              깐부 삭제
            </Button>
          </div>
          <div className="friends-search-box">
            <input type="text" placeholder="이메일 또는 캐릭터 검색" />
            <Button variant="text" className="search-button">
              <SearchIcon />
            </Button>
          </div> */}
        </div>
        {friends.map((friend) => (
          <div className="home-content" key={friend.friendId}>
            <MainRaids characters={friend.characterList} friendName={friend.nickName}/>
          </div>
        ))}
        <div className="table-pagination-container">
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={friends?.length ?? 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FriendsIndex;
