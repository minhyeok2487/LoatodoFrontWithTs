import { useCharacters } from "../../../core/apis/Character.api";
import { calculateRaidStatus } from "../../../core/func/todo.fun";

const MainRaids = () => {
  const { data:characters } = useCharacters();
  if (characters === undefined) {
    return null;
  }

  const raidStatus = calculateRaidStatus(characters);

  return (
    <div className="main-raids">
      <div className="main-raids-header">
        <h2>레이드 별 현황</h2>
        <div className="btn-work">
          <button onClick={() => (window.location.href = "/todo")}>
            숙제 바로가기
          </button>
        </div>
      </div>
      <div className="main-raids-content">
        {raidStatus.map((raid, index) => (
          <div key={index} className="radis-content-box">
            <p className="raid-name">{raid.name}</p>
            <p className="radi-score">
              <em>{raid.count}</em> / {raid.totalCount}
            </p>
            <p className="radi-summary">
              <span>
                서폿 <em>{raid.supportCount}</em>
              </span>{" "}
              <span>
                딜러 <em>{raid.dealerCount}</em>
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainRaids;
