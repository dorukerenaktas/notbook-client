import { RequestConfig, RequestService } from './RequestService';
import {
    LectureAttendPath,
    LectureAttendRequest,
    LectureAttendRequestType,
    LectureAttendResponse,
    LectureCreatePath,
    LectureCreateRequest,
    LectureCreateRequestType,
    LectureCreateResponse,
    LectureGetAddedPath,
    LectureGetAddedRequest,
    LectureGetAddedRequestType,
    LectureGetAddedResponse,
    LectureGetAllPath,
    LectureGetAllRequest,
    LectureGetAllRequestType,
    LectureGetAllResponse,
    LectureGetAttendedPath,
    LectureGetAttendedRequest,
    LectureGetAttendedRequestType,
    LectureGetAttendedResponse,
    LectureGetPath,
    LectureGetRequest,
    LectureGetRequestType,
    LectureGetResponse,
    LectureQuitPath,
    LectureQuitRequest,
    LectureQuitRequestType,
    LectureQuitResponse
} from './type';

function getAll(args: LectureGetAllRequest): RequestConfig<LectureGetAllResponse> {
    return RequestService.request<LectureGetAllResponse>({
        method: LectureGetAllRequestType,
        url: LectureGetAllPath,
        params: args
    });
}

function get(args: LectureGetRequest): RequestConfig<LectureGetResponse> {
    return RequestService.request<LectureGetResponse>({
        method: LectureGetRequestType,
        url: LectureGetPath,
        params: args
    });
}

function create(args: LectureCreateRequest): RequestConfig<LectureCreateResponse> {
    return RequestService.request<LectureCreateResponse>({
        method: LectureCreateRequestType,
        url: LectureCreatePath,
        data: args
    });
}

function attend(args: LectureAttendRequest): RequestConfig<LectureAttendResponse> {
    return RequestService.request<LectureAttendResponse>({
        method: LectureAttendRequestType,
        url: LectureAttendPath,
        data: args
    });
}

function quit(args: LectureQuitRequest): RequestConfig<LectureQuitResponse> {
    return RequestService.request<LectureQuitResponse>({
        method: LectureQuitRequestType,
        url: LectureQuitPath,
        data: args
    });
}

function getAttended(args: LectureGetAttendedRequest): RequestConfig<LectureGetAttendedResponse> {
    return RequestService.request<LectureGetAttendedResponse>({
        method: LectureGetAttendedRequestType,
        url: LectureGetAttendedPath,
        params: args
    });
}

function getAdded(args: LectureGetAddedRequest): RequestConfig<LectureGetAddedResponse> {
    return RequestService.request<LectureGetAddedResponse>({
        method: LectureGetAddedRequestType,
        url: LectureGetAddedPath,
        params: args
    });
}

export const LectureService = {
    getAll,
    getAttended,
    getAdded,
    create,
    get,
    attend,
    quit
};
