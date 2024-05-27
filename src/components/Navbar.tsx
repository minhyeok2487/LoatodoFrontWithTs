import { useState } from "react";
import "../styles/components/Navbar.css";
import Logo from "./Logo";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useMember } from "../core/apis/Member.api";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import ToggleTheme from "./ToggleTheme";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "../core/atoms/Modal.atom";
import * as memberApi from "../core/apis/Member.api";
import { loading } from "../core/atoms/Loading.atom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [modal, setModal] = useRecoilState(modalState);
  const setLoading = useSetRecoilState(loading);

  const { data: member } = useMember();

  const toggleClickEvent = () => {
    const dropDownMenu = document.querySelector(".dropdown_menu");
    dropDownMenu!!.classList.toggle("open");

    const isOpenNow = dropDownMenu!!.classList.contains("open");
    setIsOpen(isOpenNow);
  };

  const handlerDropdownUser = () => {
    setUsernameOpen(!usernameOpen);
  };

  const openDeleteUserCharactersForm = () => {
    const modalTitle = "등록 캐릭터 삭제";
    var modalContent = (
      <div className="delete-user-characters-form">
        <p>정말로 등록된 캐릭터를 삭제하시겠습니까?</p>
        <ul>
          <li>등록된 캐릭터, 숙제, 깐부 데이터가 삭제됩니다.</li>
          <li>코멘트 데이터는 유지됩니다.</li>
        </ul>
        <button onClick={() => deleteUserCharacters(true)}>확인</button>
        <button onClick={() => deleteUserCharacters(false)}>취소</button>
      </div>
    );
    setModal({
      ...modal,
      openModal: true,
      modalTitle: modalTitle,
      modalContent: modalContent,
    });
  };

  const deleteUserCharacters = async (state: boolean) => {
    try {
      if (state) {
        setLoading(true);
        const response = await memberApi.deleteUserCharacters();
        if (response) {
          alert(response.message);
          window.location.href = "/";
        }
      } else {
        setModal({ ...modal, openModal: false });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header>
      <div className="navbar">
        <Logo isDarkMode={true} />
        <ul className="links">
          <li>
            <NavLink
              to="/todo"
              className={location.pathname === "/todo" ? "active" : ""}
            >
              숙제
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/friends"
              className={location.pathname === "/friends" ? "active" : ""}
            >
              깐부
            </NavLink>
          </li>
          <li>
            <NavLink
              to={{
                pathname: "/comments",
                search: `?page=1`,
              }}
              className={location.pathname === "/comments" ? "active" : ""}
            >
              방명록
            </NavLink>
          </li>
        </ul>

        <div className="menus">
          <ToggleTheme />
          <div className="buttons">
            <div style={{ marginLeft: 10 }}>
              {member?.username === null ? (
                <Link to="/login" className="action_btn">
                  로그인
                </Link>
              ) : (
                <div
                  onClick={() => handlerDropdownUser()}
                  className="login_name"
                >
                  {member?.username}
                </div>
              )}
            </div>
          </div>
          <div className="toggle_btn">
            <div className="icon" onClick={() => toggleClickEvent()}>
              {isOpen ? (
                <CloseIcon sx={{ fontSize: 30 }} />
              ) : (
                <MenuIcon sx={{ fontSize: 30 }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="user_info_wrap">
        {usernameOpen && (
          <div className="user_info">
            <li>
              <Link to="/member/apikey">API Key 변경</Link>
            </li>
            <li>
              <div onClick={openDeleteUserCharactersForm}>등록 캐릭터 삭제</div>
            </li>
            <li>
              <div onClick={() => navigate("/logout")}>로그아웃</div>
            </li>
          </div>
        )}
      </div>

      <div className="dropdown_menu">
        <li>
          <Link to="/todo">숙제</Link>
        </li>
        <li>
          <Link to="/friends">깐부</Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/comments",
              search: `?page=1`,
            }}
          >
            방명록
          </Link>
        </li>
        <li>
          {member?.username === null ? (
            <Link to="/login" className="action_btn">
              로그인
            </Link>
          ) : (
            <div className="login_box">
              <div className="login_name">{member?.username}</div>
              <li>
                <Link style={{fontWeight:"normal"}} to="/member/apikey">API Key 변경</Link>
              </li>
              <li>
                <div onClick={openDeleteUserCharactersForm}>
                  등록 캐릭터 삭제
                </div>
              </li>
              <li>
                <div onClick={() => navigate("/logout")} className="logout_btn">
                  로그아웃
                </div>
              </li>
            </div>
          )}
        </li>
      </div>
    </header>
  );
};

export default Navbar;
