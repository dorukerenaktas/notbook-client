import { Lecture, SimpleLecture } from '../../type';
import { BaseResponse } from './MessageType';
import { RequestType } from './RequestType';

export const LectureCreateRequestType: RequestType = RequestType.POST;

export const LectureCreatePath = 'lecture';

export interface LectureCreateRequest {
    code: string,
    name: string
}

export interface LectureCreateResponse extends BaseResponse {
    lectureId: number
}

export const LectureGetRequestType: RequestType = RequestType.GET;

export const LectureGetPath = 'lecture';

export interface LectureGetRequest {
    lectureId: number,
}

export interface LectureGetResponse extends BaseResponse {
    data: Lecture
}

export const LectureGetAllRequestType: RequestType = RequestType.GET;

export const LectureGetAllPath = 'lecture/all';

export interface LectureGetAllRequest {
    universityId: number,
}

export interface LectureGetAllResponse extends BaseResponse {
    data: SimpleLecture[]
}

export const LectureGetAttendedRequestType: RequestType = RequestType.GET;

export const LectureGetAttendedPath = 'lecture/attended';

export interface LectureGetAttendedRequest {
}

export interface LectureGetAttendedResponse extends BaseResponse {
    data: SimpleLecture[]
}

export const LectureGetAddedRequestType: RequestType = RequestType.GET;

export const LectureGetAddedPath = 'lecture/added';

export interface LectureGetAddedRequest {
}

export interface LectureGetAddedResponse extends BaseResponse {
    data: SimpleLecture[]
}


export const LectureAttendRequestType: RequestType = RequestType.POST;

export const LectureAttendPath = 'lecture/attend';

export interface LectureAttendRequest {
    lectureId: number
}

export interface LectureAttendResponse extends BaseResponse {
}

export const LectureQuitRequestType: RequestType = RequestType.DELETE;

export const LectureQuitPath = 'lecture/attend';

export interface LectureQuitRequest {
    lectureId: number
}

export interface LectureQuitResponse extends BaseResponse {
}
