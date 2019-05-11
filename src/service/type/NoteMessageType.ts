import { Note, NoteTag } from '../../type';
import { BaseResponse } from './MessageType';
import { RequestType } from './RequestType';

export const NoteCreateRequestType: RequestType = RequestType.POST;

export const NoteCreatePath = 'note';

export interface NoteCreateRequest {
    lectureId: number,
    name: string,
    description: string,
    tag: number,
    document: File
}

export interface NoteCreateResponse extends BaseResponse {
    noteId: number
}

export const NoteGetAllRequestType: RequestType = RequestType.GET;

export const NoteGetAllPath = 'note/all';

export interface NoteGetAllRequest {
    lectureId: number
}

export interface NoteGetAllResponse extends BaseResponse {
    notes: Note[]
}

export const NoteGetFavoriteRequestType: RequestType = RequestType.GET;

export const NoteGetFavoritePath = 'note/fav';

export interface NoteGetFavoriteRequest {
}

export interface NoteGetFavoriteResponse extends BaseResponse {
    data: Note[]
}

export const NoteGetAddedRequestType: RequestType = RequestType.GET;

export const NoteGetAddedPath = 'note/added';

export interface NoteGetAddedRequest {
}

export interface NoteGetAddedResponse extends BaseResponse {
    data: Note[]
}

export const NoteGetDocumentPath = 'note/document';

export interface NoteGetDocumentRequest {
    noteId: number
}

export const NoteUpdateRequestType: RequestType = RequestType.PUT;

export const NoteUpdatePath = 'note';

export interface NoteUpdateRequest {
    noteId: number,
    name: string,
    description: string,
    tag: NoteTag
}

export interface NoteUpdateResponse extends BaseResponse {
}

export const NoteReportRequestType: RequestType = RequestType.POST;

export const NoteReportPath = 'note/report';

export interface NoteReportRequest {
    noteId: number
}

export interface NoteReportResponse extends BaseResponse {
}

export const NoteFavRequestType: RequestType = RequestType.POST;

export const NoteFavPath = 'note/fav';

export interface NoteFavRequest {
    noteId: number
}

export interface NoteFavResponse extends BaseResponse {
}

export const NoteUnFavRequestType: RequestType = RequestType.DELETE;

export const NoteUnFavPath = 'note/fav';

export interface NoteUnFavRequest {
    noteId: number
}

export interface NoteUnFavResponse extends BaseResponse {
}

export const NoteRateRequestType: RequestType = RequestType.POST;

export const NoteRatePath = 'note/rate';

export interface NoteRateRequest {
    noteId: number,
    rate: number
}

export interface NoteRateResponse extends BaseResponse {
    rate: number
}

