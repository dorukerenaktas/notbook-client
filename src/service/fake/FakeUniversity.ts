import * as faker from 'faker';
import { ExtendedUniversity, University } from '../../type';
import { Status } from '../status';
import { UniversityGetPath, UniversityGetRequestType, UniversityGetResponse } from '../type';
import { fakeRequest } from './FakeRequest';

export function fakeUniversity(id?: number): University {
    return {
        id: (id) ? id : faker.random.number(),
        abbr: faker.lorem.words(1),
        imageUrl: faker.image.avatar(),
        name: faker.company.companyName()
    };
}

export function fakeExtendedUniversity(id?: number): ExtendedUniversity {
    return {
        ...fakeUniversity(id),
        location: faker.random.number({ max: 81 }),
        studentCount: faker.random.number({ max: 10 }),
        commentCount: faker.random.number({ max: 10 }),
        lectureCount: faker.random.number({ max: 10 })
    };
}

export function fakeUniversities(count?: number): University[] {
    let threshold = count ? count : faker.random.number({ max: 10 });
    let universities: University[] = [];
    for (let i = 0; i < threshold; i++) {
        universities.push(fakeUniversity());
    }
    return universities;
}

fakeRequest<UniversityGetResponse>(
    UniversityGetRequestType,
    UniversityGetPath,
    200,
    {
        statusCode: Status.SUCCESS,
        data: fakeExtendedUniversity()
    }
);
