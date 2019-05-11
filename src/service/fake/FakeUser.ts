import * as faker from 'faker';
import { SimpleUser, User } from '../../type';
import { Status } from '../status';
import {
    UserForgotPasswordPath,
    UserForgotPasswordRequestType,
    UserForgotPasswordResponse,
    UserLoginPath,
    UserLoginRequestType,
    UserLoginResponse,
    UserRegisterPath,
    UserRegisterRequestType,
    UserRegisterResponse,
    UserReSendVerificationPath,
    UserReSendVerificationRequestType,
    UserReSendVerificationResponse,
    UserUpdateImagePath,
    UserUpdateImageRequestType,
    UserUpdateImageResponse,
    UserVerifyEmailPath,
    UserVerifyEmailRequestType,
    UserVerifyEmailResponse,
    UserVerifyPasswordPath,
    UserVerifyPasswordRequestType,
    UserVerifyPasswordResponse
} from '../type';
import { fakeRequest } from './FakeRequest';
import { fakeUniversity } from './FakeUniversity';

export function fakeSimpleUser(id?: number): SimpleUser {
    return {
        id: id ? id : faker.random.number(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
    };
}

export function fakeUser(id?: number): User {
    return {
        ...fakeSimpleUser(id),
        attendedLectureCount: faker.random.number({ max: 10 }),
        addedLectureCount: faker.random.number({ max: 10 }),
        favNoteCount: faker.random.number({ max: 10 }),
        addedNoteCount: faker.random.number({ max: 10 }),
        university: fakeUniversity()
    };
}

fakeRequest<UserRegisterResponse>(
    UserRegisterRequestType,
    UserRegisterPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<UserLoginResponse>(
    UserLoginRequestType,
    UserLoginPath,
    200,
    {
        statusCode: Status.SUCCESS,
        user: fakeUser(),
        accessToken: faker.random.uuid(),
        refreshToken: faker.random.uuid()
    }
);

fakeRequest<UserUpdateImageResponse>(
    UserUpdateImageRequestType,
    UserUpdateImagePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<UserVerifyEmailResponse>(
    UserVerifyEmailRequestType,
    UserVerifyEmailPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<UserReSendVerificationResponse>(
    UserReSendVerificationRequestType,
    UserReSendVerificationPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<UserVerifyPasswordResponse>(
    UserVerifyPasswordRequestType,
    UserVerifyPasswordPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<UserForgotPasswordResponse>(
    UserForgotPasswordRequestType,
    UserForgotPasswordPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);
