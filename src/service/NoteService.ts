import { Environment } from '../environment';
import { RequestConfig, RequestService } from './RequestService';
import {
    NoteCreatePath,
    NoteCreateRequest,
    NoteCreateRequestType,
    NoteCreateResponse,
    NoteFavPath,
    NoteFavRequest,
    NoteFavRequestType,
    NoteFavResponse,
    NoteGetAddedPath,
    NoteGetAddedRequest,
    NoteGetAddedRequestType,
    NoteGetAddedResponse,
    NoteGetAllPath,
    NoteGetAllRequest,
    NoteGetAllRequestType,
    NoteGetAllResponse,
    NoteGetDocumentPath,
    NoteGetDocumentRequest,
    NoteGetFavoritePath,
    NoteGetFavoriteRequest,
    NoteGetFavoriteRequestType,
    NoteGetFavoriteResponse,
    NoteRatePath,
    NoteRateRequest,
    NoteRateRequestType,
    NoteRateResponse,
    NoteReportPath,
    NoteReportRequest,
    NoteReportRequestType,
    NoteReportResponse,
    NoteUnFavPath,
    NoteUnFavRequest,
    NoteUnFavRequestType,
    NoteUnFavResponse,
    NoteUpdatePath,
    NoteUpdateRequest,
    NoteUpdateRequestType,
    NoteUpdateResponse
} from './type';

function create(args: NoteCreateRequest, onUploadProgress: (progressEvent: ProgressEvent) => void): RequestConfig<NoteCreateResponse> {
    const data = new FormData();
    data.append('lectureId', args.lectureId.toString());
    data.append('name', args.name);
    data.append('description', args.description);
    data.append('tag', args.tag.toString());
    data.append('document', args.document);
    return RequestService.upload<NoteCreateResponse>({
        method: NoteCreateRequestType,
        url: NoteCreatePath,
        data: data,
        onUploadProgress
    });
}

function getAll(args: NoteGetAllRequest): RequestConfig<NoteGetAllResponse> {
    return RequestService.request<NoteGetAllResponse>({
        method: NoteGetAllRequestType,
        url: NoteGetAllPath,
        params: args
    });
}

function getFav(args: NoteGetFavoriteRequest): RequestConfig<NoteGetFavoriteResponse> {
    return RequestService.request<NoteGetFavoriteResponse>({
        method: NoteGetFavoriteRequestType,
        url: NoteGetFavoritePath,
        data: args
    });
}

function getAdded(args: NoteGetAddedRequest): RequestConfig<NoteGetAddedResponse> {
    return RequestService.request<NoteGetAddedResponse>({
        method: NoteGetAddedRequestType,
        url: NoteGetAddedPath,
        data: args
    });
}

function getDocumentUrl(args: NoteGetDocumentRequest): string {
    return Environment.baseApiUrl + NoteGetDocumentPath + '?noteId=' + args.noteId;
}

function update(args: NoteUpdateRequest): RequestConfig<NoteUpdateResponse> {
    return RequestService.request<NoteUpdateResponse>({
        method: NoteUpdateRequestType,
        url: NoteUpdatePath,
        data: args
    });
}

function report(args: NoteReportRequest): RequestConfig<NoteReportResponse> {
    return RequestService.request<NoteReportResponse>({
        method: NoteReportRequestType,
        url: NoteReportPath,
        data: args
    });
}

function fav(args: NoteFavRequest): RequestConfig<NoteFavResponse> {
    return RequestService.request<NoteFavResponse>({
        method: NoteFavRequestType,
        url: NoteFavPath,
        data: args
    });
}

function unFav(args: NoteUnFavRequest): RequestConfig<NoteUnFavResponse> {
    return RequestService.request<NoteUnFavResponse>({
        method: NoteUnFavRequestType,
        url: NoteUnFavPath,
        data: args
    });
}

function rate(args: NoteRateRequest): RequestConfig<NoteRateResponse> {
    return RequestService.request<NoteRateResponse>({
        method: NoteRateRequestType,
        url: NoteRatePath,
        data: args
    });
}

export const NoteService = {
    create,
    getAll,
    getFav,
    getAdded,
    getDocumentUrl,
    update,
    report,
    fav,
    unFav,
    rate
};
