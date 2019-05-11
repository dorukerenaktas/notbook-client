import { RequestConfig, RequestService } from './RequestService';
import { SearchGetPath, SearchGetRequest, SearchGetRequestType, SearchGetResponse } from './type';

function get(args: SearchGetRequest): RequestConfig<SearchGetResponse> {
    return RequestService.request<SearchGetResponse>({
        method: SearchGetRequestType,
        url: SearchGetPath,
        params: args
    });
}

export const SearchService = {
    get
};
