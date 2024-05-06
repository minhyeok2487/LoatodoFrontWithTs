export type BoardsDto = {
    boardResponseDtoList: Board[];
    totalPages: number;
    page: number;
}

export type Board = {
    id: number;
    writer: string;
    title: string;
    content: string;
    views: number;
    regDate: string;
}
