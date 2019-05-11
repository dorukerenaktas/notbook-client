import { SimpleUser } from './User';

export interface Comment {
    id: number,
    content: string,
    likeCount: number,
    isLiked: boolean,
    isEdited: boolean,
    createdAt: string,
    createdBy: SimpleUser
}

export enum CommentType {
    Post = 0,
    Note = 1
}
