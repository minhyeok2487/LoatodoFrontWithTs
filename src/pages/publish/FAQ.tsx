import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

export default () => {
  return (
    <DefaultLayout pageTitle="자주묻는 질문">
      <Wrapper>
        <div className="accArea">
          <div className="accItem on">
            {/* 열렸을 때 on 추가 */}
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>부계정도 등록할 수 있나요?</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                부계정을 이메일로(본계정과 다른 방식) 가입한 뒤{" "}
                <strong>부계정을 깐부로 등록</strong> 하고{" "}
                <strong>체크 권한</strong>을 주면 우측 사이드 바로가기로 편하게
                사용하실 수 있어요.
                <br />
                현재 별도로 해당 기능을 추가하진 않았지만,(개발 설계가
                복잡해요.🤔) 요청주시는 분들이 많아 추후 기능을 추가해 볼게요!
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>제가 보유한 캐릭터가 다 뜨지 않아요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                로아투두는 카오스던전, 가디언토벌 통계로 예상 수익을 계산하기
                때문에 <strong>API 통계 데이터가 있는</strong> 아이템 레벨{" "}
                <strong>1415이상</strong>만 출력돼요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>숙제 자동체크는 안되나요?</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                로스트아크에서 공식적으로 지원은 하지 않지만, 추후 고정시간 대에
                자동으로 체크되는 기능을 추가할 예정이에요!
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>
                  특정 캐릭은 숙제를 하지 않아서 화면에 안보이게 하고 싶어요.
                </p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                우측 사이드바에 <strong>‘+’</strong> 버튼 클릭 후{" "}
                <strong>‘출력 내용 변경’</strong>에서 스위치를 꺼주세요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>
                  강화를 해서 캐릭 레벨이 올랐는데(또는 닉네임을 변경했는데)
                  로아투두에 정보를 업데이트 하고 싶어요.
                </p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                우측 사이드바에 <strong>‘+’</strong> 버튼 클릭 후{" "}
                <strong>‘캐릭터 정보 업데이트’</strong> 버튼을 클릭해 주세요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>내 캐릭터 순서를 변경하고 싶어요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                우측 사이드바에 <strong>‘+’</strong> 버튼 클릭 후{" "}
                <strong>‘캐릭터 순서 변경’</strong> 버튼을 한 뒤 드래그로 수정해
                주세요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>획득 골드가 NaN %이나 0으로 떠요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                숙제페이지 <strong>‘편집’</strong> 버튼 클릭 후{" "}
                <strong>골드 획득 캐릭터 지정 후</strong> 골드 획득할 레이드를
                선택해 주세요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>API를 복사 붙여넣기 했는데 올바르지 않는 API 키라고 떠요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>API 사이트 번역이 켜있다면 끄고 복사 붙여넣기해 주세요!</p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>모바일 접속시 액세스 차단이 떠요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                카톡앱, 네이버앱을 제외한 구글이나 인터넷, 사파리로 로그인
                해주세요!
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>레이드 정렬(순서)을 위아래 변경하고 싶어요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <p>
                숙제페이지 <strong>‘정렬’</strong>로 순서를 변경하신 뒤{" "}
                <strong>‘저장’</strong> 버튼을 클릭해주세요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>깐부 순서를 변경하고 싶어요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <span className="label ty02">개발중</span>
              <p>
                다음 업데이트에 추가될 예정이에요.(개발자들이 전부
                직장인이에요.😂) 조금만 기다려주세요!
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>격주 입장 레이드 관문이 초기화가 안돼요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <span className="label">버그수정중</span>
              <p>
                현재 격주 레이드(카멘 4관문, 아브렐슈드 4관문)는 레이드가 초기화
                되는 주에 등록을 해야만 정상적으로 작동되는 버그를 수정
                중이에요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>깐부는 템렙 업데이트나 주간 레이드 수정이 안돼요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <span className="label ty02">개발중</span>
              <p>
                현재 깐부 탭이 숙제 탭과 동일하게 작동되도록 기능을 개발
                중이에요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>캐릭터 개별 메모는 안되나요?</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <span className="label ty02">개발중</span>
              <p>UI/UX 부분에서 걸리는 게 있어 회의 중에 있어요.</p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>
                  레이드를 전부 체크했는데도 주간레이드가 100%로 안채워져요.
                </p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <span className="label">버그수정중</span>
              <p>
                주간 레이드 체크시 왼클릭과 우클릭이 섞이면 간혈적으로
                중간관문이 체크가 되지 않는 버그를 수정 중이에요.
              </p>
            </div>
          </div>

          <div className="accItem on">
            <div className="tit">
              <button type="button">
                <i>Q</i>
                <p>비밀번호 찾기나 회원탈퇴 하고 싶어요.</p>
              </button>
            </div>
            <div className="cont">
              <i>A</i>
              <span className="label ty02">개발중</span>
              <p>
                아직 개발중인 내용이에요. 개발자에게 디스코드 DM을 보내주시면
                해당 내용을 도와드릴게요.🤗
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    </DefaultLayout>
  );
};

const Wrapper = styled.div`
  width: 100%;

  .accItem {
    position: relative;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.app.border};
    background: ${({ theme }) => theme.app.bg.light};
    overflow: hidden;
  }

  .accItem.on {
    border: 1px solid ${({ theme }) => theme.app.bg.reverse};
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .accItem.on .cont {
    display: block;
  }

  .accItem + .accItem {
    margin-top: 12px;
  }

  button {
    position: relative;
    width: 100%;
    text-align: left;
    padding: 20px 60px 20px 24px;
    p {
      color: ${({ theme }) => theme.app.text.main};
    }
  }

  button:after {
    content: "";
    width: 24px;
    height: 24px;
    position: absolute;
    right: 24px;
    top: 22px;
    transform: rotate(90deg);
  }

  .accItem.on button:after {
    transform: rotate(270deg);
  }

  .cont {
    display: none;
    padding: 20px 24px 24px;
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }

  p {
    display: inline-block;
    padding-left: 30px;
    color: ${({ theme }) => theme.app.text.light1};
    line-height: 28px;
    font-weight: 400;
    word-break: keep-all;
  }

  strong {
    display: inline-block;
    font-weight: 600;
    color: ${({ theme }) => theme.app.text.dark2};
  }

  i {
    position: absolute;
    left: 24px;
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    vertical-align: top;
  }

  .label {
    display: inline-flex;
    justify-content: center;
    margin-right: 6px;
    margin-bottom: 6px;
    padding: 3px 5px;
    border-radius: 6px;
    font-size: 14px;
    background: ${({ theme }) => theme.app.palette.red[0]};
    color: ${({ theme }) => theme.app.black};
  }

  .label.ty02 {
    background: ${({ theme }) => theme.app.palette.blue[0]};
  }

  ${({ theme }) => theme.medias.max900} {
    i {
      font-size: 18px;
    }

    p {
      padding-left: 28px;
      font-size: 14px;
    }

    button,
    .cont {
      padding-top: 18px;
      padding-bottom: 18px;
    }

    button:after {
      top: 20px;
    }
  }

  ${({ theme }) => theme.dark} {
    button:after {
      stroke: #fff;
    }
  }
`;
