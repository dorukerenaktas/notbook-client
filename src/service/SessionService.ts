import { User } from '../type';

function saveUser(user: User): void {
    window.localStorage.setItem('user', JSON.stringify(user));
}

function saveTokens(accessToken: string, refreshToken: string): void {
    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('refreshToken', refreshToken);
}

function getUser(): User | null {
    let user = window.localStorage.getItem('user');
    if (user) {
        return JSON.parse(user);
    } else {
        return null;
    }
}

function getAccessToken(): string | null {
    let token = window.localStorage.getItem('accessToken');
    if (token) {
        return token;
    } else {
        return null;
    }
}

function getRefreshToken(): string | null {
    let token = window.localStorage.getItem('refreshToken');
    if (token) {
        return token;
    } else {
        return null;
    }
}

function removeSession(): void {
    window.localStorage.clear();
}

export const SessionService = {
    saveUser,
    saveTokens,
    getUser,
    getAccessToken,
    getRefreshToken,
    removeSession
};
