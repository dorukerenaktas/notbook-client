import { SimpleLecture, University } from '../../type';
import { BaseResponse } from './MessageType';
import { RequestType } from './RequestType';

export const SearchGetRequestType: RequestType = RequestType.GET;

export const SearchGetPath = 'search';

export interface SearchGetRequest {
    query: string
}

export interface SearchGetResponse extends BaseResponse {
    universities: University[],
    lectures: SimpleLecture[]
}
