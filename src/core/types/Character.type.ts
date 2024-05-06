export type CharacterType = {
    characterId: number;
    characterClassName: string;
    characterImage: string;
    characterName: string;
    itemLevel: number;
    serverName: string;
    sortNumber: number;
    chaosName: string;
    chaosCheck: number;
    chaosGauge: number;
    chaosGold: number;
    guardianName: string;
    guardianCheck: number;
    guardianGauge: number;
    guardianGold: number;
    eponaCheck: number;
    eponaGauge: number;
    goldCharacter: boolean;
    challengeGuardian: boolean;
    challengeAbyss: boolean;
    settings: Settings;
    weekGold: number;
    weekEpona: number;
    silmaelChange: boolean;
    cubeTicket: number;
    weekDayTodoGold: number;
    weekRaidGold: number;
    todoList: TodoType[];
}


export type TodoType = {
    id: number;
    name: string;
    characterClassName: string;
    gold: number;
    check: boolean;
    message: string;
    currentGate: number;
    totalGate: number;
    weekCategory: string;
    weekContentCategory: string;
    sortNumber: number;
    goldCheck: boolean;
}


interface Settings {
    showCharacter: boolean;
    showEpona: boolean;
    showChaos: boolean;
    showGuardian: boolean;
    showWeekTodo: boolean;
    showWeekEpona: boolean;
    showSilmaelChange: boolean;
    showCubeTicket: boolean;
    goldCheckVersion: boolean;
    goldCheckPolicyEnum: string;
}