import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

export default () => {
  return (
    <DefaultLayout>
      <Wrapper>
        {/* report */}
        <div className="report">
          <div className="top">
            <p className="tit">알림</p>
            <button type="button" className="close">
              팝업닫기
            </button>
          </div>
          <ul>
            <li>
              <div className="item">
                <div className="img noti">&#x1F4E2;</div>
                <div className="cont">
                  <p className="text">
                    새 <strong>공지사항</strong>이 있어요!
                  </p>
                  <p className="date">15초 전</p>
                </div>
              </div>
            </li>

            <li>
              <div className="item">
                <div className="img guest">&#x1F4AC;</div>
                <div className="cont">
                  <p className="text">
                    내가 쓴 <strong>방명록</strong>에 <strong>댓글</strong>이
                    달렸어요.
                  </p>
                  <p className="date">30초 전</p>
                </div>
              </div>
            </li>

            <li>
              <div className="item">
                <div className="img">
                  <img src="raid-images/베히모스.jpg" alt="" />
                </div>
                <div className="cont">
                  <p className="text">
                    <em>얀비</em>님이 <strong>깐부요청</strong>을 보냈어요.
                  </p>
                  <p className="date">1일 전</p>
                </div>
              </div>
              <div className="btn">
                <button type="button" className="confirm">
                  수락
                </button>
                <button type="button" className="refuse">
                  거절
                </button>
              </div>
            </li>

            <li>
              <div className="item">
                <div className="img">
                  <img src="" alt="" />
                </div>
                <div className="cont">
                  <p className="text">
                    <em>마볼링</em>님이 <strong>깐부요청</strong>을 수락했어요.
                  </p>
                  <p className="date">2일 전</p>
                </div>
              </div>
            </li>

            <li>
              <div className="item">
                <div className="img">
                  <img src="" alt="" />
                </div>
                <div className="cont">
                  <p className="text">
                    <em>마볼링</em>님이 <strong>깐부요청</strong>을 거절했어요.
                  </p>
                  <p className="date">일주일 전</p>
                </div>
              </div>
            </li>

            <li>
              <div className="item">
                <div className="img">
                  <img src="" alt="" />
                </div>
                <div className="cont">
                  <p className="text">
                    <em>마볼링</em>님에게 <strong>깐부요청중</strong> 이에요.
                  </p>
                  <p className="date">일주일 전</p>
                </div>
              </div>
            </li>

            <li>
              <div className="item">
                <div className="img nodata">&#x1F4EE;</div>
                <div className="cont">
                  <p className="text">알림을 전부 확인했어요! &#x1F601;</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* report */}
      </Wrapper>
    </DefaultLayout>
  );
};

const Wrapper = styled.div`
  // report
  .report {
    position: fixed;
    top: auto;
    right: 300px;
    min-width: 320px;
    padding: 18px 20px 24px;
    background: ${({ theme }) => theme.app.bg.light};
    border: 1px solid ${({ theme }) => theme.app.border};
    border-radius: 16px;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .tit {
      font-size: 20px;
      font-weight: 600;
    }

    .close {
      width: 24px;
      height: 24px;
      font-size: 0;
      text-indent: -999em;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 16px;

      li {
        .img {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
          }
        }

        .cont {
          margin-left: 12px;
        }

        p {
          font-size: 15px;
          font-weight: 400;

          strong {
            font-weight: 600;
          }
        }

        .date {
          font-size: 13px;
          color: ${({ theme }) => theme.app.text.light2};
        }
      }
    }

    .item {
      display: flex;
      align-items: center;
    }

    .btn {
      display: flex;
      margin-top: 4px;
      margin-left: 42px;
      gap: 6px;

      button {
        font-size: 14px;
        padding: 2px 12px;
        border-radius: 8px;
        border: 1px solid ${({ theme }) => theme.app.border};
      }

      button.confirm {
        background: #222;
        border-color: #222;
        color: #fff;
      }
    }

    ${({ theme }) => theme.medias.max900} {
      right: 50%;
      transform: translateX(50%);
    }
  }
`;
