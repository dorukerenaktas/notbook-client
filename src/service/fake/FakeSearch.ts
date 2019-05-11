import { Status } from '../status';
import { SearchGetPath, SearchGetRequestType, SearchGetResponse } from '../type';
import { fakeSimpleLectures } from './FakeLecture';
import { fakeRequest } from './FakeRequest';
import { fakeUniversities } from './FakeUniversity';

fakeRequest<SearchGetResponse>(
    SearchGetRequestType,
    SearchGetPath,
    200,
    {
        statusCode: Status.SUCCESS,
        universities: fakeUniversities(),
        lectures: fakeSimpleLectures()
    }
);
