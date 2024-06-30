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
              <button type="button" className="on">모든일정</button>{/* 선택시 on */}
              <button type="button">내일정</button>
              <button type="button">깐부일정</button>
            </div>
          </div>

          {/* <Weekdays>
            {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
              const date = dayjs(wednesdayDate).add(offset, "days");

              return (
                <WeekItem
                  key={offset}
                  type="button"
                  isActive={
                    offset === (dayOfWeek >= 3 ? dayOfWeek - 3 : 4 + dayOfWeek)
                  }
                  onClick={() => setCurrentDate(date.format("YYYY-MM-DD"))}
                >
                  <dl>
                    <dt>{date.get("date")}</dt>
                    <dd>{date.format("dd")}</dd>
                  </dl>
                </WeekItem>
              );
            })}
          </Weekdays> */}
        
          <div className="scheduleCont">
            <ul>
              <li>
                <p className="tit loday">26일(수)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">깐부</span>
                    <div>
                      <span className="time">오후 06:00</span>
                      <span className="raid hard">카멘 하드</span>
                      <span className="name">· 닉네임이뭐라열글자야</span>
                      <span className="memo">· 메모 : 볼링님이랑 같이가기로 함</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit">27일(목)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">깐부</span>
                    <div>
                      <span className="time">오후 06:00</span>
                      <span className="raid normal">에키드나 노말</span>
                      <span className="name">· 닉네임이뭐라열글자야</span>
                      <span className="memo">· 메모 : 메모에용</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit">28일(금)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">깐부</span>
                    <div>
                      <span className="time">오후 06:00</span>
                      <span className="raid normal">에키드나 노말</span>
                      <span className="name">· 키키</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit saturday">29일(토)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">깐부</span>
                    <div>
                      <span className="time">오후 06:00</span>
                      <span className="raid normal">에키드나 노말</span>
                      <span className="name">· 캐릭명임</span>
                      <span className="memo">· 메모 : 메모세요</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="on">{/* 오늘에 on */}
                <p className="tit sunday">30일(일)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty01">나</span>
                    <div>
                      <span className="time">오후 04:00</span>
                      <span className="raid hard">비아키스</span>
                      <span className="name">· 얀비</span>
                      <span className="memo">· 메모 : 나혼자만의 숙제다</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit">1일(월)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">깐부</span>
                    <div>
                      <span className="time">오후 06:00</span>
                      <span className="raid hard">비아키스</span>
                      <span className="name">· 닉네임이뭐라열두글자야요</span>
                      <span className="memo">· 메모 : 볼링님이랑 같이가기로 함</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <p className="tit">2일(화)</p>
                <div className="cont">
                  <div className="item">
                    <span className="label ty02">깐부</span>
                    <div>
                      <span className="time">오후 07:00</span>
                      <span className="raid">가디언토벌</span>
                      <span className="name">· 닉네임이뭐라열글자야</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="btnArea">
          <button type="button" className="btnLarge">일정추가</button>
        </div>

        {/* addSchedule */}
        {/* <div className="addSchedule">
          <div className="top">
            <p className="tit">일정추가</p>
            <button type="button" className="close">
              팝업닫기
            </button>
          </div>
          <dl>
            <dt>레이드</dt>
            <dd>
              <select>
                <option value="">가디언토벌</option>
              </select>
            </dd>
          </dl>
          <dl>
            <dt>종류</dt>
            <dd>
              <button type="button">내일정</button>
              <button type="button">깐부일정</button>
            </dd>
          </dl>
        </div> */}
        {/* addSchedule */}
      </Wrapper>
    </DefaultLayout>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.light};

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

  .scheduleCont {
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

    li.on {
      border: 1px solid ${({ theme }) => theme.app.bg.reverse};
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .tit {
      padding: 4px 0;
      text-align: center;
      border-bottom: 1px solid ${({ theme }) => theme.app.border};
      background: ${({ theme }) => theme.app.bg.main};
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
      gap: 10px;
      padding: 10px;
    }

    .item {
      display: flex;
      width:100%;
      align-items: flex-start;
      flex-direction: column;
      min-height: 125px;
      padding-bottom: 10px;
      font-size: 15px;
      border-bottom: 1px dashed ${({ theme }) => theme.app.border};
    }

    .item > div {
      width: 100%;
      padding: 0 4px;
    }

    .label {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-right: 6px;
      margin-bottom: 6px;
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
      font-size: 14px;
    }

    .raid {
      display: block;
      margin-bottom:1px;
      font-size: 16px;
    }

    .raid.hard {
      color: ${({ theme }) => theme.app.red};
    }

    .raid.normal {
      color: ${({ theme }) => theme.app.blue1};
    }

    .name {
      display: flex;
      font-size: 13px;
      color: ${({ theme }) => theme.app.text.light1};
    }

    .memo {
      display: block;
      margin-top: 1px;
      font-size: 13px;
      color: ${({ theme }) => theme.app.text.light2};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
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

  ${({ theme }) => theme.medias.max900} {
    .topArea {
      flex-direction: column;
      margin-top: -8px;
      
      .tab{
        position: relative;
        margin-top: 10px;
        
        button{
          height:30px;
          font-size: 14px;
        }
      }
        
      .dateArea span{
        font-size: 18px;
      }
        
      .prev, .next{
        width: 30px;
      }
        
      
     
    }
      
     .scheduleCont li{
        display: none;
      }
      .scheduleCont li.on {
        display: block;
        width: 100%;
        border: 1px solid ${({ theme }) => theme.app.border};
        box-shadow: none;
      }
      
    

    .memo{
      display:none;
    }
  }
`;
