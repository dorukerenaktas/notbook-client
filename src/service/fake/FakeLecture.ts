import * as faker from 'faker';
import { Lecture, SimpleLecture } from '../../type';
import { Status } from '../status';
import {
    LectureAttendPath,
    LectureAttendRequestType,
    LectureAttendResponse,
    LectureCreatePath,
    LectureCreateRequestType,
    LectureCreateResponse,
    LectureGetAddedPath,
    LectureGetAddedRequestType,
    LectureGetAddedResponse,
    LectureGetAllPath,
    LectureGetAllRequestType,
    LectureGetAllResponse,
    LectureGetAttendedPath,
    LectureGetAttendedRequestType,
    LectureGetAttendedResponse,
    LectureGetPath,
    LectureGetRequestType,
    LectureGetResponse,
    LectureQuitPath,
    LectureQuitRequestType,
    LectureQuitResponse
} from '../type';
import { fakeRequest } from './FakeRequest';
import { fakeUniversity } from './FakeUniversity';

export function fakeSimpleLecture(id?: number): SimpleLecture {
    return {
        id: (id) ? id : faker.random.number(),
        code: faker.lorem.words(1),
        name: faker.lorem.words(3),
        university: fakeUniversity()
    };
}

export function fakeLecture(id?: number): Lecture {
    return {
        ...fakeSimpleLecture(id),
        attendCount: faker.random.number({ max: 10 }),
        postCount: faker.random.number({ max: 10 }),
        noteCount: faker.random.number({ max: 10 }),
        isAttended: faker.random.boolean()
    };
}

export function fakeSimpleLectures(count?: number): SimpleLecture[] {
    let threshold = count ? count : faker.random.number({ max: 10 });
    let lectures: SimpleLecture[] = [];
    for (let i = 0; i < threshold; i++) {
        lectures.push(fakeSimpleLecture());
    }
    return lectures;
}

fakeRequest<LectureCreateResponse>(
    LectureCreateRequestType,
    LectureCreatePath,
    200,
    {
        statusCode: Status.SUCCESS,
        lectureId: faker.random.number()
    }
);

fakeRequest<LectureGetAllResponse>(
    LectureGetAllRequestType,
    LectureGetAllPath,
    200,
    {
        statusCode: Status.SUCCESS,
        data: fakeSimpleLectures()
    }
);

fakeRequest<LectureGetResponse>(
    LectureGetRequestType,
    LectureGetPath,
    200,
    {
        statusCode: Status.SUCCESS,
        data: fakeLecture()
    }
);

fakeRequest<LectureAttendResponse>(
    LectureAttendRequestType,
    LectureAttendPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<LectureQuitResponse>(
    LectureQuitRequestType,
    LectureQuitPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<LectureGetAttendedResponse>(
    LectureGetAttendedRequestType,
    LectureGetAttendedPath,
    200,
    {
        statusCode: Status.SUCCESS,
        data: fakeSimpleLectures()
    }
);

fakeRequest<LectureGetAddedResponse>(
    LectureGetAddedRequestType,
    LectureGetAddedPath,
    200,
    {
        statusCode: Status.SUCCESS,
        data: fakeSimpleLectures()
    }
);
