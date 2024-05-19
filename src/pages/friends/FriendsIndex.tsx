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
    const link = `/friends/${nickName}`
    navigate(link);
  };

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
        <TableContainer className="friend-table-container">
          <Table stickyHeader className="table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={1}
                  sx={{ background: "#dddddd" }}
                >
                  깐부 정보
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={10}
                  sx={{ background: "#dddddd" }}
                >
                  주간 레이드
                </TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ minWidth: column.minWidth }}
                    sx={{ background: "#dddddd" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {friends
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((friend) => {
                  const raidStatus = calculateRaidStatus(friend.characterList);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={friend.nickName}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(friend.nickName)}
                    >
                      <TableCell align="center">{friend.nickName}</TableCell>
                      {columns.slice(1).map((column) => {
                        const raid = raidStatus.find(
                          (status) => status.name === column.label
                        );
                        return (
                          <TableCell key={column.id} align="center">
                            {raid ? `${raid.count} / ${raid.totalCount}` : ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
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
