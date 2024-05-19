import { MemberType } from "./Member.type";

export type CommentsType = {
    commentDtoList: CommentType[];
    totalPages: number;
    memberResponseDto: MemberType;
}


export type CommentType = {
    id: number;
    body: string;
    username: string;
    parentId: number;
    regDate: string;
    memberId: number;
    role: string;
}