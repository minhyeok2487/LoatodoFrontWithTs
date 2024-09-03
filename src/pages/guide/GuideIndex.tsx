import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

const GuideIndex = () => {
  return (
    <DefaultLayout pageTitle="로아투두 가이드">
      <Wrapper>
        <p className="tit">
          LOA TODO
          <br />
          가이드
        </p>

        <ul>
          <li className="dep01">
            <img src="/images/guide01.png" alt="로아투두 사용법" />
            <div className="txt">
              <strong>1</strong>
              <em>회원가입</em> 또는 <em>구글로그인으로 시작하기</em>
            </div>
          </li>
          <li className="dep02">
            <img src="/images/guide02.png" alt="로아투두 사용법" />
            <div className="txt">
              <strong>2</strong>
              <em>APIKEY 발급 받기</em> 링크로 들어가 주세요{" "}
              <span>
                * 해당 홈페이지 이용 시, 자동 번역 기능을 꼭 해제해 주세요!
              </span>
            </div>
          </li>
          <li className="dep03">
            <img src="/images/guide03.png" alt="로아투두 사용법" />
            <div className="txt">
              <strong>3</strong>상단 로그인 버튼으로{" "}
              <em>로스트아크 계정으로 로그인 후</em>{" "}
              <em>GET ACCESS TO LOSTARK API</em>을 눌러 주세요.
            </div>
          </li>
          <li className="dep04">
            <img src="/images/guide04.png" alt="로아투두 사용법" />
            <div className="txt">
              <strong>4</strong>
              <em>CLIENT NAME</em>- 영어 이름을 입력해 주세요.(임의로 입력 가능)
              <br />
              <em>REQUIRED READING AND AGREEMENTS</em> - 약관을 모두 체크해
              주세요.
            </div>
          </li>
          <li className="dep05">
            <img src="/images/guide05.png" alt="로아투두 사용법" />
            <div className="txt">
              <strong>5</strong>
              <em>CORY</em> 버튼을 눌러 <em>복사</em>해 주세요.
            </div>
          </li>
          <li className="dep06">
            <img src="/images/guide06.png" alt="로아투두 사용법" />
            <div className="txt">
              <strong>6</strong>복사한 <em>API KERY를 붙여넣기</em>하고,{" "}
              <em>대표 닉네임</em>을 입력해 주세요.
            </div>
          </li>
        </ul>

        <p className="welcomeTxt">
          로아투두에 어서오세요!
          <br />
          회원가입이 완료되었어요.🥰
        </p>

        <p className="tit">가입 후 최초설정</p>
        <ul>
          <li className="dep07">
            <img src="/images/guide07.png" alt="로아투두 사용법" />
            <div className="txt">
              <strong>1</strong>
              <em>편집</em> 버튼을 눌러주세요.
            </div>
          </li>
          <li className="dep08">
            <img src="/images/guide08.png" alt="로아투두 사용법" />
            <div className="txt">
              <strong>2</strong>
              <em>골드 획득 캐릭터 지정</em> 후, <em>골드를 획득할 레이드</em>를
              선택해 주세요.
            </div>
          </li>
        </ul>
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
    display: block;
    margin: 26px 0 60px;
    font-size: 40px;
    font-weight: 900;
    line-height: 1.2;
  }

  strong {
    display: block;
    font-size: 40px;
    font-weight: 700;
    color: ${({ theme }) => theme.app.text.black};
  }

  ul li {
    position: relative;
    margin-bottom: 60px;
    border-radius: 16px;
    overflow: hidden;
    z-index: 0;
  }

  img {
    margin: 0 auto;
  }

  .txt {
    font-size: 20px;
    font-weight: 300;
    color: ${({ theme }) => theme.app.text.main};
  }

  .txt em {
    font-weight: 600;
    color: ${({ theme }) => theme.app.text.black};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 16px;
    color: #ff0000;
  }

  .dep01,
  .dep02 {
    background: #eff1f7;
  }

  .dep01 img,
  .dep02 img {
    margin: 0;
  }

  .dep02 {
    padding-left: 40px;
  }

  .dep01 .txt,
  .dep02 .txt {
    text-align: left;
    position: absolute;
    bottom: 50px;
    left: 500px;
    z-index: 1;
    color: #444;
  }

  .dep01 .txt em,
  .dep02 .txt em {
    color: #000;
  }

  .dep01 .txt strong,
  .dep02 .txt strong {
    color: #000;
  }

  .welcomeTxt {
    margin-bottom: 80px;
    font-size: 20px;
    font-weight: 300;
  }

  ${({ theme }) => theme.dark} {
    .dep01,
    .dep02 {
      filter: brightness(0.9);
    }
  }
`;
