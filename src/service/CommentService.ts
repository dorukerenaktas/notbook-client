import { RequestConfig, RequestService } from './RequestService';
import {
    CommentCreatePath,
    CommentCreateRequest,
    CommentCreateRequestType,
    CommentCreateResponse,
    CommentDeletePath,
    CommentDeleteRequest,
    CommentDeleteRequestType,
    CommentDeleteResponse,
    CommentGetAllPath,
    CommentGetAllRequest,
    CommentGetAllRequestType,
    CommentGetAllResponse,
    CommentLikePath,
    CommentLikeRequest,
    CommentLikeRequestType,
    CommentLikeResponse,
    CommentReportPath,
    CommentReportRequest,
    CommentReportRequestType,
    CommentReportResponse,
    CommentUnLikePath,
    CommentUnLikeRequest,
    CommentUnLikeRequestType,
    CommentUnLikeResponse,
    CommentUpdatePath,
    CommentUpdateRequest,
    CommentUpdateRequestType,
    CommentUpdateResponse
} from './type';

function create(args: CommentCreateRequest): RequestConfig<CommentCreateResponse> {
    return RequestService.request<CommentCreateResponse>({
        method: CommentCreateRequestType,
        url: CommentCreatePath,
        data: args
    });
}

function getAll(args: CommentGetAllRequest): RequestConfig<CommentGetAllResponse> {
    return RequestService.request<CommentGetAllResponse>({
        method: CommentGetAllRequestType,
        url: CommentGetAllPath,
        params: args
    });
}

function update(args: CommentUpdateRequest): RequestConfig<CommentUpdateResponse> {
    return RequestService.request<CommentUpdateResponse>({
        method: CommentUpdateRequestType,
        url: CommentUpdatePath,
        data: args
    });
}

function remove(args: CommentDeleteRequest): RequestConfig<CommentDeleteResponse> {
    return RequestService.request<CommentDeleteResponse>({
        method: CommentDeleteRequestType,
        url: CommentDeletePath,
        data: args
    });
}

function report(args: CommentReportRequest): RequestConfig<CommentReportResponse> {
    return RequestService.request<CommentReportResponse>({
        method: CommentReportRequestType,
        url: CommentReportPath,
        data: args
    });
}

function like(args: CommentLikeRequest): RequestConfig<CommentLikeResponse> {
    return RequestService.request<CommentLikeResponse>({
        method: CommentLikeRequestType,
        url: CommentLikePath,
        data: args
    });
}

function unlike(args: CommentUnLikeRequest): RequestConfig<CommentUnLikeResponse> {
    return RequestService.request<CommentUnLikeResponse>({
        method: CommentUnLikeRequestType,
        url: CommentUnLikePath,
        data: args
    });
}

export const CommentService = {
    create,
    getAll,
    update,
    remove,
    report,
    like,
    unlike
};
