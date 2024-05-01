export type MemberResponse = {
    characterDtoMap: { [serverName: string]: CharacterDto[] };
}

export type CharacterDto = {
    characterClassName: string;
    characterImage: string;
    characterName: string;
    itemLevel: number;
    serverName: string;
    sortNumber: number;
    chaosName?: string;
    chaos?: DayContent;
    chaosCheck: number;
    chaosGauge: number;
    chaosGold: number;
    guardianName?: string;
    guardian?: DayContent;
    guardianCheck: number;
    guardianGauge: number;
    guardianGold: number;
    eponaCheck: number;
    eponaGauge: number;
    todoList: TodoResponseDto[];
    goldCharacter: boolean;
    challengeGuardian: boolean;
    challengeAbyss: boolean;
    settings: Settings;
    weekGold: number;
    weekEpona: number;
    silmaelChange: boolean;
    cubeTicket: number;
}

interface Content {
    id: number;
    category: string;
    name: string;
    level: number;
}

interface DayContent extends Content {
    shilling: number;
    honorShard: number;
    leapStone: number;
    destructionStone: number;
    guardianStone: number;
    jewelry: number;
}

export type TodoResponseDto = {
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

