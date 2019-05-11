import { University } from './University';

export interface SimpleUser {
    id: number,
    firstName: string,
    lastName: string
}

export interface User extends SimpleUser {
    attendedLectureCount: number,
    addedLectureCount: number,
    favNoteCount: number,
    addedNoteCount: number,
    university: University
}
