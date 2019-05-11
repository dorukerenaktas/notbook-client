import { RequestConfig, RequestService } from './RequestService';
import {
    PostCreatePath,
    PostCreateRequest,
    PostCreateRequestType,
    PostCreateResponse,
    PostDeletePath,
    PostDeleteRequest,
    PostDeleteRequestType,
    PostDeleteResponse,
    PostGetAllPath,
    PostGetAllRequest,
    PostGetAllRequestType,
    PostGetAllResponse,
    PostLikePath,
    PostLikeRequest,
    PostLikeRequestType,
    PostLikeResponse,
    PostReportPath,
    PostReportRequest,
    PostReportRequestType,
    PostReportResponse,
    PostUnLikePath,
    PostUnLikeRequest,
    PostUnLikeRequestType,
    PostUnLikeResponse,
    PostUpdatePath,
    PostUpdateRequest,
    PostUpdateRequestType,
    PostUpdateResponse
} from './type';

function create(args: PostCreateRequest): RequestConfig<PostCreateResponse> {
    return RequestService.request<PostCreateResponse>({
        method: PostCreateRequestType,
        url: PostCreatePath,
        data: args
    });
}

function getAll(args: PostGetAllRequest): RequestConfig<PostGetAllResponse> {
    return RequestService.request<PostGetAllResponse>({
        method: PostGetAllRequestType,
        url: PostGetAllPath,
        params: args
    });
}

function update(args: PostUpdateRequest): RequestConfig<PostUpdateResponse> {
    return RequestService.request<PostUpdateResponse>({
        method: PostUpdateRequestType,
        url: PostUpdatePath,
        data: args
    });
}

function remove(args: PostDeleteRequest): RequestConfig<PostDeleteResponse> {
    return RequestService.request<PostDeleteResponse>({
        method: PostDeleteRequestType,
        url: PostDeletePath,
        data: args
    });
}

function report(args: PostReportRequest): RequestConfig<PostReportResponse> {
    return RequestService.request<PostReportResponse>({
        method: PostReportRequestType,
        url: PostReportPath,
        data: args
    });
}

function like(args: PostLikeRequest): RequestConfig<PostLikeResponse> {
    return RequestService.request<PostLikeResponse>({
        method: PostLikeRequestType,
        url: PostLikePath,
        data: args
    });
}

function unlike(args: PostUnLikeRequest): RequestConfig<PostUnLikeResponse> {
    return RequestService.request<PostUnLikeResponse>({
        method: PostUnLikeRequestType,
        url: PostUnLikePath,
        data: args
    });
}

export const PostService = {
    create,
    getAll,
    update,
    remove,
    report,
    like,
    unlike
};
