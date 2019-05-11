import { Environment } from '../environment';
import { RequestConfig, RequestService } from './RequestService';
import {
    UserForgotPasswordPath,
    UserForgotPasswordRequest,
    UserForgotPasswordRequestType,
    UserForgotPasswordResponse,
    UserGetImagePath,
    UserGetImageRequest,
    UserLoginPath,
    UserLoginRequest,
    UserLoginRequestType,
    UserLoginResponse,
    UserRegisterPath,
    UserRegisterRequest,
    UserRegisterRequestType,
    UserRegisterResponse,
    UserReSendVerificationPath,
    UserReSendVerificationRequest,
    UserReSendVerificationRequestType,
    UserReSendVerificationResponse,
    UserUpdateImagePath,
    UserUpdateImageRequest,
    UserUpdateImageRequestType,
    UserUpdateImageResponse,
    UserVerifyEmailPath,
    UserVerifyEmailRequest,
    UserVerifyEmailRequestType,
    UserVerifyEmailResponse,
    UserVerifyPasswordPath,
    UserVerifyPasswordRequest,
    UserVerifyPasswordRequestType,
    UserVerifyPasswordResponse
} from './type';

function register(args: UserRegisterRequest): RequestConfig<UserRegisterResponse> {
    return RequestService.request<UserRegisterResponse>({
        method: UserRegisterRequestType,
        url: UserRegisterPath,
        data: args
    });
}

function login(args: UserLoginRequest): RequestConfig<UserLoginResponse> {
    return RequestService.request<UserLoginResponse>({
        method: UserLoginRequestType,
        url: UserLoginPath,
        data: args
    });
}

function getImageUrl(args: UserGetImageRequest): string {
    return Environment.baseApiUrl + UserGetImagePath + '?userId=' + args.userId + ((args.updated) ? '&t=' + args.updated : '');
}

function updateImage(args: UserUpdateImageRequest): RequestConfig<UserUpdateImageResponse> {
    const data = new FormData();
    data.append('image', args.image);
    return RequestService.upload<UserUpdateImageResponse>({
        method: UserUpdateImageRequestType,
        url: UserUpdateImagePath,
        data: data
    });
}

function verifyEmail(args: UserVerifyEmailRequest): RequestConfig<UserVerifyEmailResponse> {
    return RequestService.request<UserVerifyEmailResponse>({
        method: UserVerifyEmailRequestType,
        url: UserVerifyEmailPath,
        data: args
    });
}

function resendVerification(args: UserReSendVerificationRequest): RequestConfig<UserReSendVerificationResponse> {
    return RequestService.request<UserReSendVerificationResponse>({
        method: UserReSendVerificationRequestType,
        url: UserReSendVerificationPath,
        data: args
    });
}

function verifyPassword(args: UserVerifyPasswordRequest): RequestConfig<UserVerifyPasswordResponse> {
    return RequestService.request<UserVerifyPasswordResponse>({
        method: UserVerifyPasswordRequestType,
        url: UserVerifyPasswordPath,
        data: args
    });
}

function forgotPassword(args: UserForgotPasswordRequest): RequestConfig<UserForgotPasswordResponse> {
    return RequestService.request<UserForgotPasswordResponse>({
        method: UserForgotPasswordRequestType,
        url: UserForgotPasswordPath,
        data: args
    });
}

export const UserService = {
    register,
    login,
    getImageUrl,
    updateImage,
    verifyEmail,
    resendVerification,
    verifyPassword,
    forgotPassword
};
