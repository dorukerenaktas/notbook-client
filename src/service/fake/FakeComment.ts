import * as faker from 'faker';
import { Comment } from '../../type';
import { Status } from '../status';
import {
    CommentCreatePath,
    CommentCreateRequestType,
    CommentCreateResponse,
    CommentDeletePath,
    CommentDeleteRequestType,
    CommentDeleteResponse,
    CommentGetAllPath,
    CommentGetAllRequestType,
    CommentGetAllResponse,
    CommentLikePath,
    CommentLikeRequestType,
    CommentLikeResponse,
    CommentReportPath,
    CommentReportRequestType,
    CommentReportResponse,
    CommentUnLikePath,
    CommentUnLikeRequestType,
    CommentUnLikeResponse,
    CommentUpdatePath,
    CommentUpdateRequestType,
    CommentUpdateResponse
} from '../type';
import { fakeRequest } from './FakeRequest';
import { fakeSimpleUser } from './FakeUser';

export function fakeComment(): Comment {
    return {
        id: faker.random.number(),
        content: faker.lorem.sentences(faker.random.number({ min: 1, max: 5 })),
        likeCount: faker.random.number({ max: 10 }),
        isLiked: faker.random.boolean(),
        isEdited: faker.random.boolean(),
        createdAt: faker.date.past().toString(),
        createdBy: fakeSimpleUser()
    };
}

export function fakeComments(count?: number): Comment[] {
    let threshold = count ? count : faker.random.number({ max: 10 });
    let comments: Comment[] = [];
    for (let i = 0; i < threshold; i++) {
        comments.push(fakeComment());
    }
    return comments;
}

fakeRequest<CommentCreateResponse>(
    CommentCreateRequestType,
    CommentCreatePath,
    200,
    {
        statusCode: Status.SUCCESS,
        commentId: faker.random.number()
    }
);

fakeRequest<CommentGetAllResponse>(
    CommentGetAllRequestType,
    CommentGetAllPath,
    200,
    {
        statusCode: Status.SUCCESS,
        comments: fakeComments()
    }
);

fakeRequest<CommentUpdateResponse>(
    CommentUpdateRequestType,
    CommentUpdatePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<CommentDeleteResponse>(
    CommentDeleteRequestType,
    CommentDeletePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<CommentReportResponse>(
    CommentReportRequestType,
    CommentReportPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<CommentLikeResponse>(
    CommentLikeRequestType,
    CommentLikePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<CommentUnLikeResponse>(
    CommentUnLikeRequestType,
    CommentUnLikePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);
