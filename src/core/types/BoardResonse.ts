export type BoardsDto = {
    boardResponseDtoList: BoardType[];
    totalPages: number;
    page: number;
}

export type BoardType = {
    id: number;
    writer: string;
    title: string;
    content: string;
    views: number;
    regDate: string;
}
