import { University } from './University';

export interface SimpleLecture {
    id: number,
    code: string,
    name: string,
    university: University
}

export interface Lecture extends SimpleLecture {
    attendCount: number,
    postCount: number,
    noteCount: number,
    isAttended: boolean
}
