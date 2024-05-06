import { atom } from "recoil";

// 캐릭터 서버 선택을 나타내는 Atom
export const serverState = atom({
    key: 'serverState',
    default: ''
});
