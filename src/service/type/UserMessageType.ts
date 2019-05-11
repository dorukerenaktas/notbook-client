import { RcFile } from 'antd/lib/upload/interface';
import { User } from '../../type';
import { BaseResponse } from './MessageType';
import { RequestType } from './RequestType';

export const UserRegisterRequestType: RequestType = RequestType.POST;

export const UserRegisterPath = 'user/register';

export interface UserRegisterRequest {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface UserRegisterResponse extends BaseResponse {
}

export const UserLoginRequestType: RequestType = RequestType.POST;

export const UserLoginPath = 'user/login';

export interface UserLoginRequest {
    email: string,
    password: string
}

export interface UserLoginResponse extends BaseResponse {
    user: User,
    accessToken: string,
    refreshToken: string
}

export const UserGetImagePath = 'user/image';

export interface UserGetImageRequest {
    userId: number,
    updated: boolean
}

export const UserUpdateImageRequestType: RequestType = RequestType.PUT;

export const UserUpdateImagePath = 'user/image';

export interface UserUpdateImageRequest {
    image: RcFile
}

export interface UserUpdateImageResponse extends BaseResponse {
}

export const UserVerifyEmailRequestType: RequestType = RequestType.POST;

export const UserVerifyEmailPath = 'user/verify/email';

export interface UserVerifyEmailRequest {
    hash: string
}

export interface UserVerifyEmailResponse extends BaseResponse {
}

export const UserReSendVerificationRequestType: RequestType = RequestType.PUT;

export const UserReSendVerificationPath = 'user/send/verification';

export interface UserReSendVerificationRequest {
    email: string
}

export interface UserReSendVerificationResponse extends BaseResponse {
}

export const UserVerifyPasswordRequestType: RequestType = RequestType.POST;

export const UserVerifyPasswordPath = 'user/verify/password';

export interface UserVerifyPasswordRequest {
    hash: string,
    password: string
}

export interface UserVerifyPasswordResponse extends BaseResponse {
}

export const UserForgotPasswordRequestType: RequestType = RequestType.PUT;

export const UserForgotPasswordPath = 'user/send/password';

export interface UserForgotPasswordRequest {
    email: string
}

export interface UserForgotPasswordResponse extends BaseResponse {
}
