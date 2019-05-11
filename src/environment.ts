import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { delayResponse: 2000 });

type environment = {
    init: () => void,
    isTest: boolean,
    isDev: boolean,
    isProd: boolean,
    baseApiUrl: string,
    mock: MockAdapter,
}

export const Environment: environment = {
    init: () => {
        switch (process.env.NODE_ENV) {
            case 'test':
                Environment.isTest = true;
                Environment.baseApiUrl = 'http://localhost:5000/v1/';

                break;
            case 'development':
                Environment.isDev = true;
                Environment.baseApiUrl = 'http://localhost:5000/v1/';

                // Use REACT_APP_NO_FAKE=true npm start for using local api server
                if (process.env.REACT_APP_NO_FAKE) {
                    // Remove mock adapter
                    mock.restore();
                }

                break;
            case 'production':
                Environment.isProd = true;
                Environment.baseApiUrl = 'https://api.notbook.net/v1/';
                // Remove mock adapter
                mock.restore();

                // Disable console logs
                window.console.log = function () {
                };
                window.console.warn = function () {
                };
                window.console.error = function () {
                };
                window.console.debug = function () {
                };
                window.console.info = function () {
                };
                break;
            default:
                console.log('Environment is not defined!');
        }
    },
    isTest: false,
    isDev: false,
    isProd: false,
    baseApiUrl: '',
    mock: mock
};
