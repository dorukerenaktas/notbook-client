import { ExtendedUniversity } from '../../type';
import { BaseResponse } from './MessageType';
import { RequestType } from './RequestType';

export const UniversityGetRequestType: RequestType = RequestType.GET;

export const UniversityGetPath = 'university';

export interface UniversityGetRequest {
    universityId: number
}

export interface UniversityGetResponse extends BaseResponse {
    data: ExtendedUniversity
}
