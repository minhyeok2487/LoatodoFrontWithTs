import { useState, useEffect } from 'react';

const GRID_CONFIG_STORAGE_KEY = 'todolist-grid-config';

export interface GridConfig {
    normalColumns: number;
    wideColumns: number;
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
    normalColumns: 6,
    wideColumns: 10,
};

export const usePersistedGridConfig = () => {
    const [gridConfig, setGridConfig] = useState<GridConfig>(DEFAULT_GRID_CONFIG);

    // 컴포넌트 마운트 시 localStorage에서 불러오기
    useEffect(() => {
        try {
            const stored = localStorage.getItem(GRID_CONFIG_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setGridConfig({
                    ...DEFAULT_GRID_CONFIG,
                    ...parsed,
                });
            }
        } catch (error) {
            // 로컬스토리지 파싱 실패 무시
        }
    }, []);

    const updateGridConfig = (newConfig: GridConfig) => {
        setGridConfig(newConfig);

        try {
            localStorage.setItem(GRID_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
        } catch (error) {
            // 저장 실패 무시
        }
    };


    return [gridConfig, updateGridConfig] as const;
};

export default usePersistedGridConfig;
