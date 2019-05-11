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
import './AddedLecturesPage.css';

type AddedLecturesPageProps = {}

type ExtendedAddedLecturesPageProps = AddedLecturesPageProps & WithTranslation & RouteComponentProps<any>;

interface AddedLecturesPageState {
    lectures: SimpleLecture[],
    loading: boolean,
    error: boolean
}

class AddedLecturesPage extends Component<ExtendedAddedLecturesPageProps, AddedLecturesPageState> {

    constructor(props: ExtendedAddedLecturesPageProps) {
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

        ContainerPage.menuSelectAddedLectures();
    }

    loadPage(): void {
        LectureService.getAdded({})
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

        if (user.addedLectureCount !== lectures.length) {
            user.addedLectureCount = lectures.length;
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
                <span className='addedLectureListTitle'>{ t('page.addedLectures.title') }</span>
            </div>
        );

        const content = (
            <ConfigProvider renderEmpty={ renderEmpty }>
                <List className='addedLectureList' header={ header } itemLayout='vertical' dataSource={ lectures }
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

const AddedLecturesPageWithTranslation = withTranslation()(AddedLecturesPage);

const AddedLecturesPageWithRouter = withRouter(AddedLecturesPageWithTranslation);

export { AddedLecturesPageWithRouter as AddedLecturesPage };
