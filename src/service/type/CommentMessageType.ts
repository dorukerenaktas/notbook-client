import { Comment, CommentType } from '../../type';
import { BaseResponse } from './MessageType';
import { RequestType } from './RequestType';

export const CommentCreateRequestType: RequestType = RequestType.POST;

export const CommentCreatePath = 'comment';

export interface CommentCreateRequest {
    parentId: number,
    type: CommentType,
    content: string
}

export interface CommentCreateResponse extends BaseResponse {
    commentId: number
}

export const CommentGetAllRequestType: RequestType = RequestType.GET;

export const CommentGetAllPath = 'comment/all';

export interface CommentGetAllRequest {
    parentId: number,
    type: CommentType
}

export interface CommentGetAllResponse extends BaseResponse {
    comments: Comment[]
}

export const CommentUpdateRequestType: RequestType = RequestType.PUT;

export const CommentUpdatePath = 'comment';

export interface CommentUpdateRequest {
    commentId: number,
    content: string
}

export interface CommentUpdateResponse extends BaseResponse {
}

export const CommentDeleteRequestType: RequestType = RequestType.DELETE;

export const CommentDeletePath = 'comment';

export interface CommentDeleteRequest {
    commentId: number
}

export interface CommentDeleteResponse extends BaseResponse {
}

export const CommentReportRequestType: RequestType = RequestType.POST;

export const CommentReportPath = 'comment/report';

export interface CommentReportRequest {
    commentId: number
}

export interface CommentReportResponse extends BaseResponse {
}


export const CommentLikeRequestType: RequestType = RequestType.POST;

export const CommentLikePath = 'comment/like';

export interface CommentLikeRequest {
    commentId: number
}

export interface CommentLikeResponse extends BaseResponse {
}

export const CommentUnLikeRequestType: RequestType = RequestType.DELETE;

export const CommentUnLikePath = 'comment/like';

export interface CommentUnLikeRequest {
    commentId: number
}

export interface CommentUnLikeResponse extends BaseResponse {
}
