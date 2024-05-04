import { CharacterDto } from "../../../types/MemberResponse";
import {
  editMainCharacter,
  useCharacterData,
  useMember,
} from "../../../apis/Member.api";
import DefaultButton from "../../../layouts/DefaultButton";
import { useRecoilState } from "recoil";
import { modalState } from "../../../Atoms";
import { EditMainCharacterType } from "../../../types/Member.type";
import '../../../styles/pages/home/components/MainCharacters.css';

const MainCharacters = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const { data: member, refetch: refetchMember } = useMember();
  const mainCharacter = member?.mainCharacter;

  const { data: characters, refetch: refetchCharacters } = useCharacterData();

  if (!characters || !characters.characterDtoMap) {
    return null;
  }

  const characterList: CharacterDto[] = Object.values(
    characters.characterDtoMap
  ).flat();

  const calAverageLevel = characterList.reduce((accumulator, character) => {
    accumulator += character.itemLevel;
    return accumulator;
  }, 0);

  const supportList = ["바드", "도화가", "홀리나이트"];
  const countDealer = characterList.reduce((accumulator, character) => {
    if (!supportList.includes(character.characterClassName)) {
      accumulator++;
    }
    return accumulator;
  }, 0);

  const countSupport = characterList.reduce((accumulator, character) => {
    if (supportList.includes(character.characterClassName)) {
      accumulator++;
    }
    return accumulator;
  }, 0);

  const isMainCharacter = (characterName: string): boolean => {
    return characterName === mainCharacter?.characterName;
  };

  const handleUpdateMainCharacter = async (characterName: string) => {
    const data:EditMainCharacterType = {
      mainCharacter: characterName
    }
    try {
      await editMainCharacter(data);
      refetchMember();
      refetchCharacters();
    } catch (error) {
      console.error("Error editing main character:", error);
    } finally {
      setModal({...modal, openModal: false})
    }
  };

  const openUpdateMainCharacterForm = (characterName: string) => {
    const modalTitle = "대표 캐릭터 변경";
    const modalContent = (
      <div className="update-main-character-form">
        <p>{characterName} 으로 대표 캐릭터를 변경 하시겠습니까?</p>
        <div className="button-wrap">
          <DefaultButton handleEvent={() => handleUpdateMainCharacter(characterName)} name="확인" />
          <DefaultButton handleEvent={() => setModal({...modal, openModal: false})} name="취소" />
        </div>
      </div>
    );
    setModal({
      ...modal,
      openModal: true,
      modalTitle: modalTitle,
      modalContent: modalContent,
    });
  };

  return (
    <div className="main-characters">
      <div className="characters-info-header">
        <h1>내 캐릭터</h1>
      </div>

      <div className="characters-info">
        <div className="represent">
          <span
            className="img"
            style={{
              backgroundImage:
                mainCharacter?.characterImage !== null
                  ? `url(${mainCharacter?.characterImage})`
                  : "",
              backgroundPosition:
                mainCharacter?.characterClassName === "도화가" ||
                mainCharacter?.characterClassName === "기상술사"
                  ? "50% 32%"
                  : "50% 15%",
              backgroundColor: "black", // 캐릭터가 이미지가 없으면 배경색을 검정으로 설정
            }}
          ></span>
          <span className="name">{mainCharacter?.characterName}</span>
          <span className="level">Lv. {mainCharacter?.itemLevel}</span>
          <span className="info">
            @{mainCharacter?.serverName} {mainCharacter?.characterClassName}
          </span>
        </div>
        <div className="character-list">
          {characterList.map((character, index) => (
            <div key={index} className="character-info-box">
              <span className="character-server">@{character.serverName}</span>
              <span className="character-className">
                {character.characterClassName}
              </span>
              <span className="character-name">{character.characterName}</span>
              <span className="character-itemLevel">
                Lv. {character.itemLevel}
              </span>
              {!isMainCharacter(character.characterName) && (
                <DefaultButton
                  handleEvent={() =>
                    openUpdateMainCharacterForm(character.characterName)
                  }
                  name="대표"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="characters-info total">
        <div className="characters-average">
          <span className="characters-average-text">평균 아이템 레벨</span>
          <span className="characters-average-level">
            Lv.{(calAverageLevel / characterList.length).toFixed(2)}
          </span>
        </div>
        <div className="characters-info-summary">
          <div className="summary">
            <span>총</span>
            <span className="val">{characterList.length}</span>
            <span>캐릭</span>
          </div>
          <div className="summary">
            <span>딜러</span>
            <span className="val">{countDealer}</span>
          </div>
          <div className="summary">
            <span>서폿</span>
            <span className="val">{countSupport}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCharacters;
