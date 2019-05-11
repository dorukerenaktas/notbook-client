import { History, LocationState } from 'history';
import { ReactNode } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { RouteComponentProps, withRouter } from 'react-router';
import React, { Component } from 'reactn';
import { Dispatch } from 'redux';
import { LectureService, NoteService, RequestConfig, Status, UniversityService } from '../../../service';
import './RouteLink.css';

export enum Routes {
    University = '/university',
    Lecture = '/lecture',
    AttendedLectures = '/lecture/attended',
    AddedLectures = '/lecture/added',
    FavoriteNotes = '/note/favorite',
    AddedNotes = '/note/added',
}

type RouteLinkProps = {
    to: Routes,
    id?: number,
    block?: boolean
};

type ExtendedRouteLinkProps = RouteLinkProps & DispatchProp & RouteComponentProps<any>;

interface RouteLinkState {
}

class RouteLink extends Component<ExtendedRouteLinkProps, RouteLinkState> {

    constructor(props: ExtendedRouteLinkProps) {
        super(props);

        this.onLoad = this.onLoad.bind(this);
    }

    onLoad(): void {
        const { to, id, dispatch, history } = this.props;
        loadRoute(to, (id) ? id : -1, dispatch, history);
    }

    render(): ReactNode {
        const { children, block } = this.props;

        let style = {};

        if (block) {
            style = { display: 'block' };
        }

        return (
            <div className='link' onClick={ this.onLoad } style={ style }>
                { children }
            </div>
        );
    }
}

export const loadRoute = (to: Routes, id: number, dispatch: Dispatch, history: History<LocationState>): void => {
    let request: RequestConfig<any> | null = null;
    switch (to) {
        case Routes.University:
            request = UniversityService.get({ universityId: id });
            break;
        case Routes.Lecture:
            request = LectureService.get({ lectureId: id });
            break;
        case Routes.AttendedLectures:
            request = LectureService.getAttended({});
            break;
        case Routes.AddedLectures:
            request = LectureService.getAdded({});
            break;
        case Routes.FavoriteNotes:
            request = NoteService.getFav({});
            break;
        case Routes.AddedNotes:
            request = NoteService.getAdded({});
            break;
    }

    if (request) {
        const url = (id !== -1) ? to + '/' + id : to;

        request
            .onStart(() => {
                dispatch(showLoading('main'));
            })
            .onSuccess((response: any) => {
                history.push(url, { data: response.data });
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.NOT_FOUND:
                        history.push(url, { notFound: true });
                        break;
                    case Status.UNKNOWN:
                        history.push(url, { error: true });
                        break;
                }
            })
            .onEnd(() => {
                dispatch(hideLoading('main'));
            }).exec();
    }
};

const RouteLinkWithRouter = withRouter(RouteLink);

const ConnectedRouteLink = connect()(RouteLinkWithRouter);

export { ConnectedRouteLink as RouteLink };
