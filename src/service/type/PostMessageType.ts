import { Post, PostType } from '../../type';
import { BaseResponse } from './MessageType';
import { RequestType } from './RequestType';

export const PostCreateRequestType: RequestType = RequestType.POST;

export const PostCreatePath = 'post';

export interface PostCreateRequest {
    parentId: number,
    type: PostType,
    content: string
}

export interface PostCreateResponse extends BaseResponse {
    postId: number
}

export const PostGetAllRequestType: RequestType = RequestType.GET;

export const PostGetAllPath = 'post/all';

export interface PostGetAllRequest {
    parentId: number,
    type: PostType
}

export interface PostGetAllResponse extends BaseResponse {
    posts: Post[]
}

export const PostUpdateRequestType: RequestType = RequestType.PUT;

export const PostUpdatePath = 'post';

export interface PostUpdateRequest {
    postId: number,
    content: string
}

export interface PostUpdateResponse extends BaseResponse {
}

export const PostDeleteRequestType: RequestType = RequestType.DELETE;

export const PostDeletePath = 'post';

export interface PostDeleteRequest {
    postId: number
}

export interface PostDeleteResponse extends BaseResponse {
}

export const PostReportRequestType: RequestType = RequestType.POST;

export const PostReportPath = 'post/report';

export interface PostReportRequest {
    postId: number
}

export interface PostReportResponse extends BaseResponse {
}

export const PostLikeRequestType: RequestType = RequestType.POST;

export const PostLikePath = 'post/like';

export interface PostLikeRequest {
    postId: number
}

export interface PostLikeResponse extends BaseResponse {
}

export const PostUnLikeRequestType: RequestType = RequestType.DELETE;

export const PostUnLikePath = 'post/like';

export interface PostUnLikeRequest {
    postId: number
}

export interface PostUnLikeResponse extends BaseResponse {
}



