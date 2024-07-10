import type { FAQItem } from "@core/types/faq";

export default [
  {
    title: "부계정도 등록할 수 있나요?",
    description: `부계정을 이메일로(본계정과 다른 방식) 가입한 뒤 <strong>부계정을 깐부로 등록</strong> 하고 <strong>체크 권한</strong>을 주면 우측 사이드 바로가기로 편하게 사용하실 수 있어요.
                <br />
                현재 별도로 해당 기능을 추가하진 않았지만,(개발 설계가 복잡해요.🤔) 요청주시는 분들이 많아 추후 기능을 추가해 볼게요!`,
  },
  {
    title: "제가 보유한 캐릭터가 다 뜨지 않아요.",
    description: `로아투두는 카오스던전, 가디언토벌 통계로 예상 수익을 계산하기 때문에 <strong>API 통계 데이터가 있는</strong> 아이템 레벨 <strong>1415이상</strong>만 출력돼요.`,
  },
  {
    title: "숙제 자동체크는 안되나요?",
    description: `로스트아크에서 공식적으로 지원은 하지 않지만, 추후 고정시간 대에 자동으로 체크되는 기능을 추가할 예정이에요!`,
  },
  {
    title: "특정 캐릭은 숙제를 하지 않아서 화면에 안보이게 하고 싶어요.",
    description: `우측 사이드바에 <strong>‘+’</strong> 버튼 클릭 후 <strong>‘출력 내용 변경’</strong>에서 스위치를 꺼주세요.`,
  },
  {
    title:
      "강화를 해서 캐릭 레벨이 올랐는데(또는 닉네임을 변경했는데) 로아투두에 정보를 업데이트 하고 싶어요.",
    description: `우측 사이드바에 <strong>‘+’</strong> 버튼 클릭 후 <strong>‘캐릭터 정보 업데이트’</strong> 버튼을 클릭해 주세요.`,
  },
  {
    title: "내 캐릭터 순서를 변경하고 싶어요.",
    description: `우측 사이드바에 <strong>‘+’</strong> 버튼 클릭 후 <strong>‘캐릭터 순서 변경’</strong> 버튼을 한 뒤 드래그로 수정해 주세요.`,
  },
  {
    title: "획득 골드가 NaN %이나 0으로 떠요.",
    description: `숙제페이지 <strong>‘편집’</strong> 버튼 클릭 후 <strong>골드 획득 캐릭터 지정 후</strong> 골드 획득할 레이드를 선택해 주세요.`,
  },
  {
    title: "API를 복사 붙여넣기 했는데 올바르지 않는 API 키라고 떠요.",
    description: `API 사이트 번역이 켜져있다면 끄고 복사 붙여넣기해 주세요!`,
  },
  {
    title: "모바일 접속시 액세스 차단이 떠요.",
    description: `카톡앱, 네이버앱을 제외한 구글이나 인터넷, 사파리로 로그인 해주세요!`,
  },
  {
    title: "레이드 정렬(순서)을 위아래 변경하고 싶어요.",
    description: `숙제페이지 <strong>‘정렬’</strong>로 순서를 변경하신 뒤 <strong>‘저장’</strong> 버튼을 클릭해주세요.`,
  },
  {
    title: "깐부 순서를 변경하고 싶어요.",
    label: "DEVELOP",
    description: `다음 업데이트에 추가될 예정이에요.(개발자들이 전부 직장인이에요.😂) 조금만 기다려주세요!`,
  },
  {
    title: "격주 입장 레이드 관문이 초기화가 안돼요.",
    label: "DEBUG",
    description: `현재 격주 레이드(카멘 4관문, 아브렐슈드 4관문)는 레이드가 초기화 되는 주에 등록을 해야만 정상적으로 작동되는 버그를 수정 중이에요.`,
  },
  {
    title: "깐부는 템렙 업데이트나 주간 레이드 수정이 안돼요.",
    label: "DEVELOP",
    description: `현재 깐부 탭이 숙제 탭과 동일하게 작동되도록 기능을 개발 중이에요.`,
  },
  {
    title: "캐릭터 개별 메모는 안되나요?",
    label: "DEVELOP",
    description: `UI/UX 부분에서 걸리는 게 있어 회의 중에 있어요.`,
  },
  {
    title: "비밀번호 찾기나 회원탈퇴 하고 싶어요.",
    label: "DEVELOP",
    description: `아직 개발중인 내용이에요. 개발자에게 디스코드 DM을 보내주시면 해당 내용을 도와드릴게요.🤗`,
  },
] as FAQItem[];
