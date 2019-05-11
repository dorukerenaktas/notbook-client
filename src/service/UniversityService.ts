import { RequestConfig, RequestService } from './RequestService';
import { UniversityGetPath, UniversityGetRequest, UniversityGetRequestType, UniversityGetResponse } from './type';

function get(args: UniversityGetRequest): RequestConfig<UniversityGetResponse> {
    return RequestService.request<UniversityGetResponse>({
        method: UniversityGetRequestType,
        url: UniversityGetPath,
        params: args
    });
}

export const UniversityService = {
    get
};
