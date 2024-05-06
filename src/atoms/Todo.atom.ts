import { atom } from "recoil";

// 서버 상태를 나타내는 Atom
export const serverState = atom({
    key: 'serverState',
    default: ''
});
