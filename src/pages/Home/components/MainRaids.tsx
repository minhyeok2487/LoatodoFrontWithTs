import { RAID_SORT_ORDER } from "../../../constants";
import { useCharacters } from "../../../apis/Character.api";
import { TodoType } from "../../../types/Character.type";

const MainRaids = () => {
  const { data:characters } = useCharacters();
  if (characters === undefined) {
    return null;
  }
  const calculateRaidStatus = () => {
    const todoListGroupedByWeekCategory = characters
      .flatMap((character) => character.todoList)
      .reduce<{ [key: string]: TodoType[] }>((grouped, todo) => {
        grouped[todo.weekCategory] = grouped[todo.weekCategory] || [];
        grouped[todo.weekCategory].push(todo);
        return grouped;
      }, {});

    function isDealer(characterClassName: string) {
      switch (characterClassName) {
        case "도화가":
        case "홀리나이트":
        case "바드":
          return false;
        default:
          return true;
      }
    }

    const raidStatus = RAID_SORT_ORDER.map((key) => {
      const todoResponseDtos = todoListGroupedByWeekCategory[key] || [];
      const count = todoResponseDtos.filter((dto) => dto.check).length;
      const totalCount = todoResponseDtos.length;
      const dealerCount = todoResponseDtos.filter((dto) =>
        isDealer(dto.characterClassName)
      ).length;
      const supportCount = totalCount - dealerCount;

      return {
        name: key,
        count,
        dealerCount,
        supportCount,
        totalCount,
      };
    });

    return raidStatus.filter((raid) => raid.totalCount >= 1);
  };

  const raidStatus = calculateRaidStatus();

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
