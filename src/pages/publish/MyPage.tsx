import styled, { useTheme } from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import Button from "@components/Button";
import Select from "@components/form/Select";

const GuideIndex = () => {
  const theme = useTheme();
  return (
    <DefaultLayout pageTitle="마이페이지">
      <Wrapper>
        <p className="tit">
          <span className="img">
            <img src="" alt="" />
          </span>
          <em>마볼링</em>님 안녕하세요
        </p>

        <div className="formList">
          <p className="label">로그인 정보</p>
          <div className="formArea">
            <Input onChange={() => {}} value="loatodo@naver.com" readOnly />
          </div>
          <div className="formArea">
            <Input onChange={() => {}} value="loatodo@gmail.com" readOnly />
            <Button variant="contained" size="large" onClick={() => {}}>
              이메일 계정으로 전환
            </Button>
          </div>
        </div>

        <div className="formList">
          <p className="label">Apikey</p>
          <div className="formArea">
            <Input onChange={() => {}} value="1492812049812904142" readOnly />
            <Button variant="contained" size="large" onClick={() => {}}>
              Apikey 변경
            </Button>
          </div>
        </div>

        <div className="formList">
          <p className="label">대표캐릭터</p>
          <div className="formArea">
            <Select
              fullWidth
              options={[
                {
                  label: "마볼링1",
                  value: 1,
                },
                {
                  label: "마볼링2",
                  value: 2,
                },
              ]}
              onChange={() => {}}
              value={1}
            />
          </div>
        </div>

        <div className="formList">
          <p className="label">캐릭터 노출</p>
          <div className="formArea">
            <Select
              fullWidth
              options={[
                {
                  label: "서버별로 보기",
                  value: 1,
                },
                {
                  label: "전체 보기",
                  value: 2,
                },
              ]}
              onChange={() => {}}
              value={1}
            />
          </div>
        </div>

        <span className="line">라인</span>

        <div className="formList">
          <p className="label">계정 초기화</p>
          <div className="formArea left">
            <Button variant="outlined" onClick={() => {}}>
              등록된 캐릭터 전체삭제
            </Button>
          </div>
        </div>

        <div className="formList">
          <div className="formArea left">
            <Button
              variant="outlined"
              color={theme.app.palette.red[650]}
              onClick={() => {}}
            >
              회원탈퇴
            </Button>
          </div>
        </div>
      </Wrapper>
    </DefaultLayout>
  );
};

export default GuideIndex;

const Wrapper = styled.div`
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  text-align: center;

  .tit {
    font-size: 20px;

    .img {
      display: block;
      width: 60px;
      height: 60px;
      margin: 0 auto 12px;
      background: gray;
      border-radius: 50%;

      img {
        width: 100%;
        height: auto;
      }
    }

    em {
      font-weight: 700;
    }
  }

  .line {
    display: block;
    width: 100%;
    height: 1px;
    margin-top: 60px;
    font-size: 0;
    text-indent: -999em;
    border-top: 1px dashed ${({ theme }) => theme.app.border};
  }

  .formArea {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;

    button {
      position: absolute;
      right: 10px;
    }
  }

  .formArea.left {
    margin-top: 12px;
    button {
      position: relative;
      right: 0;
    }
  }

  select {
    padding: 0 16px !important;
    font-size: 16px;
    font-weight: 500;
    height: 53px !important;
    border-radius: 10px !important;
  }

  .label {
    margin: 24px 0 6px;
    text-align: left;
    color: ${({ theme }) => theme.app.text.light2};
    font-weight: 300;
  }

  a {
    font-size: 14px;
  }

  ${({ theme }) => theme.medias.max900} {
    input {
      width: 100%;
    }
    .formArea {
      display: block;
      text-align: left;
    }

    input + button {
      margin-top: 10px;
    }

    .formArea button {
      position: relative;
      right: 0;
    }
  }
`;
const Input = styled.input`
  padding: 16px;
  width: 100%;
  font-size: 16px;
  line-height: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;
