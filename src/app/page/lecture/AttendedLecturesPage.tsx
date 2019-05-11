import { ConfigProvider, Empty, List } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import React, { Component } from 'reactn';
import { ContainerPage } from '../';
import { LectureService, SessionService, Status } from '../../../service';
import { Note, SimpleLecture } from '../../../type';
import { LectureListItem } from '../../component';
import { Page } from '../Page';
import './AttendedLecturesPage.css';

type AttendedLecturesPageProps = {}

type ExtendedAttendedLecturesPageProps = AttendedLecturesPageProps & WithTranslation & RouteComponentProps<any>;

interface AttendedLecturesPageState {
    lectures: SimpleLecture[],
    loading: boolean,
    error: boolean
}

class AttendedLecturesPage extends Component<ExtendedAttendedLecturesPageProps, AttendedLecturesPageState> {

    constructor(props: ExtendedAttendedLecturesPageProps) {
        super(props);

        this.state = {
            lectures: props.location.state ? props.location.state.data : undefined,
            loading: false,
            error: false
        };

        this.loadPage = this.loadPage.bind(this);
    }

    componentDidMount(): void {
        const { lectures } = this.state;
        if (!lectures) {
            this.loadPage();
        } else {
            this.saveLectureCount();
        }

        ContainerPage.menuSelectAttendedLectures();
    }

    loadPage(): void {
        LectureService.getAttended({})
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                this.setState({ lectures: response.data });
                this.saveLectureCount();
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.UNKNOWN:
                        this.setState({ error: true });
                        break;
                }
            })
            .onEnd(() => {
                this.setState({ loading: false });
            }).exec();
    }

    saveLectureCount = () => {
        const { lectures } = this.state;
        let user = this.global.user;

        if (user.attendedLectureCount !== lectures.length) {
            user.attendedLectureCount = lectures.length;
            this.setGlobal({ user });
            SessionService.saveUser(user);
        }
    };

    render(): ReactNode {
        const { t } = this.props;
        const { lectures, loading, error } = this.state;

        const renderEmpty = () => <Empty description={ t('list.lecture.empty') }/>;

        const renderItem = (data: SimpleLecture) => (
            <LectureListItem data={ data }/>
        );

        const header = (
            <div>
                <span className='attendedLectureListTitle'>{ t('page.attendedLectures.title') }</span>
            </div>
        );

        const content = (
            <ConfigProvider renderEmpty={ renderEmpty }>
                <List className='attendedLectureList' header={ header } itemLayout='vertical' dataSource={ lectures }
                      loading={ loading } rowKey={ (note: Note) => note.id } renderItem={ renderItem }/>
            </ConfigProvider>
        );

        return (
            <Page loading={ loading } error={ error }>
                { content }
            </Page>
        );
    }
}

const AttendedLecturesPageWithTranslation = withTranslation()(AttendedLecturesPage);

const AttendedLecturesPageWithRouter = withRouter(AttendedLecturesPageWithTranslation);

export { AttendedLecturesPageWithRouter as AttendedLecturesPage };
