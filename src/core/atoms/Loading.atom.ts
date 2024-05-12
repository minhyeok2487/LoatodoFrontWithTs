import { atom } from "recoil";

// 로딩 상태 state
export const loading = atom({
    key: 'loading',
    default: false
});
