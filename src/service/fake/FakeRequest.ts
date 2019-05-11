import { Environment } from '../../environment';
import { RequestType } from '../type';

export function fakeRequest<T>(requestType: RequestType, postPath: string, status: number, response: T): void {
    let request;
    switch (requestType) {
        case RequestType.GET:
            request = Environment.mock.onGet(postPath);
            break;
        case RequestType.HEAD:
            request = Environment.mock.onHead(postPath);
            break;
        case RequestType.POST:
            request = Environment.mock.onPost(postPath);
            break;
        case RequestType.PUT:
            request = Environment.mock.onPut(postPath);
            break;
        case RequestType.DELETE:
            request = Environment.mock.onDelete(postPath);
            break;
        default:
            request = Environment.mock.onGet(postPath);
    }

    request.reply(status, response);
}
