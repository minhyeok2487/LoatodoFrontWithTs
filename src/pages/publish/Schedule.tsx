import styled from "@emotion/styled";

import DefaultLayout from "@layouts/DefaultLayout";

export default () => {
  return (
    <DefaultLayout pageTitle="일정">
      <Wrapper>
        <div className="schedule">
          <div className="topArea">
            <div className="dateArea">
              <button type="button" className="prev">이전</button>
              <span>2024년 06월 5주</span>
              <button type="button" className="next">다음</button>
            </div>
            
            <div className="tab">
              <button type="button" className="on">모든일정</button>
              <button type="button">내일정</button>
              <button type="button">파티일정</button>
            </div>
          </div>
          
          <div className="contArea">
            <ul>
              <li>
                <p className="tit loday">26일(수)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">파티</span>
                    <span className="time">20:00</span>
                    <span className="raid hard">카멘</span>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit">27일(목)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">파티</span>
                    <span className="time">18:00</span>
                    <span className="raid normal">에키드나</span>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit">28일(금)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">파티</span>
                    <span className="time">18:00</span>
                    <span className="raid normal">에키드나</span>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit saturday">29일(토)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">파티</span>
                    <span className="time">18:00</span>
                    <span className="raid normal">에키드나</span>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit sunday on">30일(일)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty01">나</span>
                    <span className="time">16:00</span>
                    <span className="raid hard">비아키스</span>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit">1일(월)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">파티</span>
                    <span className="time">18:00</span>
                    <span className="raid normal">에키드나</span>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit">2일(화)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">파티</span>
                    <span className="time">19:00</span>
                    <span className="raid">가디언토벌</span>
                  </div>
                  
                  <div className="item">
                    <span className="label ty02">파티</span>
                    <span className="time">19:00</span>
                    <span className="raid">아브렐슈드</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="btnArea">
          <button type="button" className="btnLarge">일정추가</button>
        </div>
      </Wrapper>
    </DefaultLayout>
  );
};

const Wrapper = styled.div`
  width: 100%;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.light};
  padding: 24px;

  .topArea {
    display: flex;
    align-items: center;
    justify-content: center;
    position:relative;

    .dateArea {
      display: flex;
      align-items: center;
      span {
        padding: 0 24px;
        font-size: 22px;
        font-weight: 700;
      }
    }

    .tab {
      display: flex;
      position: absolute;
      right: 0;
      gap: 6px;

      button {
        display: flex;
        align-items: center;
        height: 36px;
        padding: 0 16px;
        border-radius: 32px;
        background: ${({ theme }) => theme.app.bg.gray1};
        color: ${({ theme }) => theme.app.text.light1};
      }

      button.on {
        background: ${({ theme }) => theme.app.bg.reverse};
        color: ${({ theme }) => theme.app.text.reverse};
      }
    }

    .prev, .next {
      width: 40px;
      height: 40px;
      font-size: 0;
      text-indent: -999em;
      background: url("/ico_cal_arr.svg") no-repeat center / 100%;
    }

    .next {
      transform: rotate(180deg);
    }
  }
    
  .contArea {
    margin-top: 32px;
    
    ul {
      display: flex;
    }

    li {
      width: calc(100% / 7);
      min-height: 500px;
      border: 1px solid ${({ theme }) => theme.app.border};
    }

    li + li {
      border-left: 0;
    }

    .tit {
      padding: 4px 0;
      text-align: center;
      border-bottom: 1px solid ${({ theme }) => theme.app.border};
      background: ${({ theme }) => theme.app.bg.main};
    }

    .tit.on {
      background: ${({ theme }) => theme.app.bg.reverse};
      color: ${({ theme }) => theme.app.text.reverse};
    }

    .tit.sunday {
      color: ${({ theme }) => theme.app.blue1};
    }

    .tit.saturday {
      color: ${({ theme }) => theme.app.red};
    }

    .cont {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
    }

    .item {
      display: flex;
      align-items: center;
    }

    .label {
      display: inline-flex;
      justify-content: center;
      min-width: 28px;
      margin-right: 6px;
      padding: 3px 5px;
      border-radius: 4px;
      font-size: 12px;
      background: ${({ theme }) => theme.app.pink2};
      color: ${({ theme }) => theme.app.black};
    }

    .label.ty01 {
      background: ${({ theme }) => theme.app.pink2};
    }
      
    .label.ty02 {
      background: ${({ theme }) => theme.app.sky1};
    }

    .time {
      margin-right: 4px;
      font-weight: 600;
      font-size: 15px;
    }

    .raid.hard {
      color: ${({ theme }) => theme.app.red};
    }

    .raid.normal {
      color: ${({ theme }) => theme.app.blue1};
    }
  }

  .btnArea {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;

    .btnLarge{
      display: flex;
      align-items: center;
      justfiy-content: center;
      height: 48px;
      padding: 0 32px;
      border-radius: 12px;
      background: ${({ theme }) => theme.app.semiBlack1};
      color: ${({ theme }) => theme.app.white};
      font-weight: 600;
    }
  }

  // addSchedule
  .addSchedule {
    position: fixed;
    top: 130px;
    left: 50%;
    transform: translateX(-50%);
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
      background: url("/ico_close.svg") no-repeat center / 100%;
      font-size: 0;
      text-indent: -999em;
    }
  }
`;
