import * as faker from 'faker';
import { Note } from '../../type';
import { Status } from '../status';
import {
    NoteCreatePath,
    NoteCreateRequestType,
    NoteCreateResponse,
    NoteFavPath,
    NoteFavRequestType,
    NoteFavResponse,
    NoteGetAddedPath,
    NoteGetAddedRequestType,
    NoteGetAddedResponse,
    NoteGetAllPath,
    NoteGetAllRequestType,
    NoteGetAllResponse,
    NoteGetFavoritePath,
    NoteGetFavoriteRequestType,
    NoteGetFavoriteResponse,
    NoteRatePath,
    NoteRateRequestType,
    NoteRateResponse,
    NoteReportPath,
    NoteReportRequestType,
    NoteReportResponse,
    NoteUnFavPath,
    NoteUnFavRequestType,
    NoteUnFavResponse,
    NoteUpdatePath,
    NoteUpdateRequestType,
    NoteUpdateResponse
} from '../type';
import { fakeSimpleLecture } from './FakeLecture';
import { fakeRequest } from './FakeRequest';
import { fakeSimpleUser } from './FakeUser';

export function fakeNote(): Note {
    return {
        id: faker.random.number(),
        name: faker.lorem.sentences(faker.random.number({ min: 1, max: 3 })),
        description: faker.lorem.sentences(faker.random.number({ min: 1, max: 5 })),
        tag: faker.random.number({ min: 0, max: 7 }),
        rate: faker.random.number({ min: 0, max: 5 }),
        favCount: faker.random.number({ max: 10 }),
        commentCount: faker.random.number({ max: 10 }),
        isFav: faker.random.boolean(),
        isEdited: faker.random.boolean(),
        fileExtension: faker.lorem.word(),
        createdAt: faker.date.past().toString(),
        createdBy: fakeSimpleUser(1),
        lecture: fakeSimpleLecture()
    };
}

export function fakeNotes(count?: number): Note[] {
    let threshold = count ? count : faker.random.number({ max: 10 });
    let notes: Note[] = [];
    for (let i = 0; i < threshold; i++) {
        notes.push(fakeNote());
    }
    return notes;
}

fakeRequest<NoteCreateResponse>(
    NoteCreateRequestType,
    NoteCreatePath,
    200,
    {
        statusCode: Status.SUCCESS,
        noteId: faker.random.number()
    }
);

fakeRequest<NoteGetAllResponse>(
    NoteGetAllRequestType,
    NoteGetAllPath,
    200,
    {
        statusCode: Status.SUCCESS,
        notes: fakeNotes()
    }
);

fakeRequest<NoteGetFavoriteResponse>(
    NoteGetFavoriteRequestType,
    NoteGetFavoritePath,
    200,
    {
        statusCode: Status.SUCCESS,
        data: fakeNotes()
    }
);

fakeRequest<NoteGetAddedResponse>(
    NoteGetAddedRequestType,
    NoteGetAddedPath,
    200,
    {
        statusCode: Status.SUCCESS,
        data: fakeNotes()
    }
);

fakeRequest<NoteUpdateResponse>(
    NoteUpdateRequestType,
    NoteUpdatePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<NoteReportResponse>(
    NoteReportRequestType,
    NoteReportPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<NoteFavResponse>(
    NoteFavRequestType,
    NoteFavPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<NoteUnFavResponse>(
    NoteUnFavRequestType,
    NoteUnFavPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<NoteRateResponse>(
    NoteRateRequestType,
    NoteRatePath,
    200,
    {
        statusCode: Status.SUCCESS,
        rate: faker.random.number({ max: 5, min: 0 })
    }
);
