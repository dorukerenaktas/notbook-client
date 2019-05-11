import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Environment } from '../environment';
import { SessionService } from './SessionService';
import { Status } from './status';

export class RequestConfig<V> {

    private readonly options: AxiosRequestConfig = {};

    constructor(options: AxiosRequestConfig) {
        this.options = options;
    }

    onStart(callback: (request: AxiosPromise) => void): RequestConfig<V> {
        this.start = callback;
        return this;
    }

    onSuccess(callback: (response: V) => void): RequestConfig<V> {
        this.success = callback;
        return this;
    }

    onFailure(callback: (status: number) => void): RequestConfig<V> {
        this.failure = callback;
        return this;
    }

    onEnd(callback: (response: AxiosResponse<V>) => void): RequestConfig<V> {
        this.end = callback;
        return this;
    }

    exec(): void {
        let promise = axios(this.options);

        this.start(promise);

        promise.then(response => {
            let data = response.data;

            if (data.statusCode) {
                if (data.statusCode === Status.SUCCESS) {
                    this.success(data);
                } else {
                    this.failure(data.statusCode);
                }
            } else {
                console.error('Response do not have status code:', response, promise);
            }

            this.end(response);
        }).catch(error => {
            this.failure(Status.UNKNOWN);
            this.end(error);
        });

    }

    private start: (request: AxiosPromise) => void = (request) => {
        console.log(request);
    };

    private success: (response: V) => void = (response) => {
        console.log(response);
    };

    private failure: (status: number) => void = (status) => {
        console.log(status);
    };

    private end: (response: AxiosResponse<V>) => void = (response) => {
        console.log(response);
    };
}

export class RequestService {

    public static request<V>(options: AxiosRequestConfig): RequestConfig<V> {
        let headers;
        if (options.method === 'POST' || options.method === 'PUT') {
            headers = {
                ...getHeader(),
                'Content-Type': 'application/json'
            };
        } else if (options.method === 'GET' || options.method === 'DELETE') {
            headers = getHeader();
        }

        options.baseURL = Environment.baseApiUrl;
        options.headers = { ...headers, 'Cache-Control': 'no-cache' };

        return new RequestConfig<V>(options);
    }

    public static upload<V>(options: AxiosRequestConfig): RequestConfig<V> {
        options.baseURL = Environment.baseApiUrl;
        options.headers = {
            ...getHeader(),
            'Content-Type': 'multipart/form-data'
        };

        return new RequestConfig<V>(options);
    }
}

axios.interceptors.response.use(undefined, (error: any) => {
    if (error.config && error.response && error.response.status === 401) {
        return refreshAuthentication().then((response: AxiosResponse<any>) => {
            let data = response.data;

            if (data.statusCode === Status.SUCCESS) {
                SessionService.saveTokens(data.accessToken, data.refreshToken);
                error.config.headers['Authorization'] = 'Bearer ' + data.accessToken;
                return axios.request(error.config);
            }

            return response;
        });
    }

    return Promise.reject(error);
});

/**
 * Get Bearer authentication header if exists
 */
function getHeader(): any {
    // return authorization header with jwt token
    let token = SessionService.getAccessToken();

    if (token) {
        return { Authorization: 'Bearer ' + token };
    } else {
        return {};
    }
}

function refreshAuthentication(): any {
    return axios({
        method: 'PUT',
        baseURL: Environment.baseApiUrl,
        url: 'user/token',
        data: {
            AccessToken: SessionService.getAccessToken(),
            RefreshToken: SessionService.getRefreshToken()
        }
    });
}
