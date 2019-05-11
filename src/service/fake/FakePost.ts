import * as faker from 'faker';
import { Post } from '../../type';
import { Status } from '../status';
import {
    PostCreatePath,
    PostCreateRequestType,
    PostCreateResponse,
    PostDeletePath,
    PostDeleteRequestType,
    PostDeleteResponse,
    PostGetAllPath,
    PostGetAllRequestType,
    PostGetAllResponse,
    PostLikePath,
    PostLikeRequestType,
    PostLikeResponse,
    PostReportPath,
    PostReportRequestType,
    PostReportResponse,
    PostUnLikePath,
    PostUnLikeRequestType,
    PostUnLikeResponse,
    PostUpdatePath,
    PostUpdateRequestType,
    PostUpdateResponse
} from '../type';
import { fakeRequest } from './FakeRequest';
import { fakeSimpleUser } from './FakeUser';

export function fakePost(): Post {
    return {
        id: faker.random.number(),
        content: faker.lorem.sentences(faker.random.number({ min: 1, max: 5 })),
        likeCount: faker.random.number({ max: 10 }),
        commentCount: faker.random.number({ max: 10 }),
        isLiked: faker.random.boolean(),
        isEdited: faker.random.boolean(),
        createdAt: faker.date.past().toString(),
        createdBy: fakeSimpleUser()
    };
}

export function fakePosts(count?: number): Post[] {
    let threshold = count ? count : faker.random.number({ max: 10 });
    let posts: Post[] = [];
    for (let i = 0; i < threshold; i++) {
        posts.push(fakePost());
    }
    return posts;
}

fakeRequest<PostCreateResponse>(
    PostCreateRequestType,
    PostCreatePath,
    200,
    {
        statusCode: Status.SUCCESS,
        postId: faker.random.number()
    }
);

fakeRequest<PostGetAllResponse>(
    PostGetAllRequestType,
    PostGetAllPath,
    200,
    {
        statusCode: Status.SUCCESS,
        posts: fakePosts()
    }
);

fakeRequest<PostUpdateResponse>(
    PostUpdateRequestType,
    PostUpdatePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<PostDeleteResponse>(
    PostDeleteRequestType,
    PostDeletePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<PostReportResponse>(
    PostReportRequestType,
    PostReportPath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<PostLikeResponse>(
    PostLikeRequestType,
    PostLikePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);

fakeRequest<PostUnLikeResponse>(
    PostUnLikeRequestType,
    PostUnLikePath,
    200,
    {
        statusCode: Status.SUCCESS
    }
);
