import { SimpleLecture } from './Lecture';
import { SimpleUser } from './User';

export interface Note {
    id: number,
    name: string,
    description: string,
    tag: NoteTag,
    rate: number,
    favCount: number,
    commentCount: number,
    isFav: boolean,
    isEdited: boolean,
    fileExtension: string,
    createdAt: string,
    lecture: SimpleLecture,
    createdBy: SimpleUser
}

export enum NoteTag {
    Notebook = 0,
    Slide = 1,
    Lab = 2,
    Homework = 3,
    Project = 4,
    Quiz = 5,
    Midterm = 6,
    Final = 7
}
