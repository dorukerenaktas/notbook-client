import { SimpleUser } from './User';

export interface Post {
    id: number,
    content: string,
    likeCount: number,
    commentCount: number,
    isLiked: boolean,
    isEdited: boolean,
    createdAt: string,
    createdBy: SimpleUser
}

export enum PostType {
    Announcement = 0,
    Suggestion = 1,
    University = 2
}
