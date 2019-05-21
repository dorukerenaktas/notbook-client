import { Button, Icon, message, Tabs, Tooltip } from 'antd';
import { CSSProperties } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import React, { Component } from 'reactn';
import { ContainerPage } from '../';
import { LectureService, SessionService, Status } from '../../../service';
import { Lecture, PostType } from '../../../type';
import { NoteList, PostList } from '../../component/list';
import { RouteLink, Routes } from '../../component/route';
import { Page } from '../Page';
import './LecturePage.css';

export const TAB_KEY_ANNOUNCEMENTS = 'announcements';
export const TAB_KEY_SUGGESTIONS = 'suggestions';
export const TAB_KEY_NOTES = 'notes';

type LecturePageProps = {}

type ExtendedLecturePageProps = LecturePageProps & WithTranslation & RouteComponentProps<any>;

interface LecturePageState {
    lecture: Lecture,
    activeTab: string,
    loading: { data: boolean, attend: boolean },
    error: boolean,
    notFound: boolean
}

class LecturePage extends Component<ExtendedLecturePageProps, LecturePageState> {

    constructor(props: ExtendedLecturePageProps) {
        super(props);

        this.state = {
            lecture: props.location.state ? props.location.state.data : undefined,
            activeTab: this.extractTabParams(props.match.params.tab),
            loading: { data: false, attend: false },
            error: props.location.state ? props.location.state.error : false,
            notFound: props.location.state ? props.location.state.notFound : false
        };

        this.loadPage = this.loadPage.bind(this);
        this.onAttend = this.onAttend.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
    }

    componentDidMount(): void {
        const { lecture, error, notFound } = this.state;
        if (!lecture && !error && !notFound) {
            this.loadPage();
        }

        ContainerPage.menuClearSelection();
    }

    componentDidUpdate(prevProps: ExtendedLecturePageProps): void {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({ lecture: this.props.location.state.data });
        }

        if (this.props.match.params.tab !== this.state.activeTab) {
            this.setState({ activeTab: prevProps.match.params.tab });
        }
    }

    loadPage(): void {
        const { loading } = this.state;
        const { match: { params: { id } } } = this.props;
        LectureService.get({ lectureId: id })
            .onStart(() => {
                this.setState({ loading: { ...loading, data: true } });
            })
            .onSuccess((response) => {
                this.setState({ lecture: response.data });
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.NOT_FOUND:
                        this.setState({ notFound: true });
                        break;
                    case Status.UNKNOWN:
                        this.setState({ error: true });
                        break;
                }
            })
            .onEnd(() => {
                this.setState({ loading: { ...loading, data: false } });
            }).exec();
    }

    onAttend(): void {
        const { lecture, loading } = this.state;
        const { t } = this.props;

        if (!loading.attend) {
            if (lecture.isAttended) {
                LectureService.quit({ lectureId: lecture.id })
                    .onStart(() => {
                        this.setState({ loading: { ...loading, attend: true } });
                    })
                    .onSuccess(() => {
                        this.setState({
                            lecture: {
                                ...lecture,
                                isAttended: false,
                                attendCount: lecture.attendCount - 1
                            }
                        });
                        this.saveLectureCount(false);
                    })
                    .onFailure((status) => {
                        switch (status) {
                            case Status.UNKNOWN:
                                message.error(t('response.common.unknown'));
                                break;
                        }
                    })
                    .onEnd(() => {
                        this.setState({ loading: { ...loading, attend: false } });
                    }).exec();
            } else {
                LectureService.attend({ lectureId: lecture.id })
                    .onStart(() => {
                        this.setState({ loading: { ...loading, attend: true } });
                    })
                    .onSuccess(() => {
                        this.setState({
                            lecture: {
                                ...lecture,
                                isAttended: true,
                                attendCount: lecture.attendCount + 1
                            }
                        });
                        this.saveLectureCount(true);
                    })
                    .onFailure((status) => {
                        switch (status) {
                            case Status.UNKNOWN:
                                message.error(t('response.common.unknown'));
                                break;
                        }
                    })
                    .onEnd(() => {
                        this.setState({ loading: { ...loading, attend: false } });
                    }).exec();
            }
        }
    }

    onTabChange(activeKey: string): void {
        this.props.history.push('/lecture/' + this.props.match.params.id + '/' + activeKey);
        this.setState({ activeTab: activeKey });
    }

    extractTabParams(tab: string): string {
        if (tab !== TAB_KEY_ANNOUNCEMENTS && tab !== TAB_KEY_SUGGESTIONS && tab !== TAB_KEY_NOTES) {
            this.props.history.replace('/lecture/' + this.props.match.params.id + '/' + TAB_KEY_ANNOUNCEMENTS);

            return TAB_KEY_ANNOUNCEMENTS;
        }

        return tab;
    }

    saveLectureCount = (increased: boolean) => {
        let user = this.global.user;

        user.attendedLectureCount = user.attendedLectureCount + ((increased) ? 1 : -1);
        this.setGlobal({ user });
        SessionService.saveUser(user);
    };

    onPostAdded = (): void => {
        const { lecture } = this.state;

        this.setState({ lecture: { ...lecture, postCount: lecture.postCount + 1 } });
    };

    onPostRemoved = (): void => {
        const { lecture } = this.state;

        this.setState({ lecture: { ...lecture, postCount: lecture.postCount - 1 } });
    };

    onNoteAdded = (): void => {
        const { lecture } = this.state;

        this.setState({ lecture: { ...lecture, noteCount: lecture.noteCount + 1 } });
    };

    onNoteRemoved = (): void => {
        const { lecture } = this.state;

        this.setState({ lecture: { ...lecture, noteCount: lecture.noteCount - 1 } });
    };

    render(): React.ReactNode {
        const { t } = this.props;
        const { lecture, activeTab, loading, error, notFound } = this.state;

        let header: React.ReactNode;
        let content: React.ReactNode;

        if (lecture) {
            const attend = loading.attend ? <Icon type='loading'/> : lecture.isAttended ? (
                <Icon style={ { color: '#8BC34A' } } type='check'/>) : t('page.lecture.attendButton');

            header = (
                <div className='lecturePageHeader'>
                    <div className='lecturePageHeaderTitleContainer'>
                        <div>
                            <span className='lecturePageHeaderTitleCode'>
                                { lecture.code }
                            </span>
                        </div>
                        <div>
                            <span className='lecturePageHeaderTitleName'>
                                { lecture.name }
                            </span>
                        </div>
                        <div>
                            <RouteLink to={ Routes.University } id={ lecture.university.id }>
                                <span className='lecturePageHeaderTitleUniversity'>
                                    { lecture.university.name }
                                </span>
                            </RouteLink>
                        </div>
                    </div>
                    <div className='lecturePageHeaderAttributes'>
                        <Tooltip placement='bottom' title={ t('tooltip.attendedCount') }>
                            <Icon className='lecturePageHeaderAttributeIcon' type='user'/>
                            <span className='lecturePageHeaderAttributeText'>
                                { lecture.attendCount }
                            </span>
                        </Tooltip>
                        <Tooltip placement='bottom' title={ t('tooltip.postCount') }>
                            <Icon className='lecturePageHeaderAttributeIcon' type='message'/>
                            <span className='lecturePageHeaderAttributeText'>
                                { lecture.postCount }
                            </span>
                        </Tooltip>
                        <Tooltip placement='bottom' title={ t('tooltip.noteCount') }>
                            <Icon className='lecturePageHeaderAttributeIcon' type='file'/>
                            <span className='lecturePageHeaderAttributeText'>
                                { lecture.noteCount }
                            </span>
                        </Tooltip>
                    </div>
                    <Button.Group className='lecturePageHeaderActions'>
                        <Button className='lecturePageHeaderActionsAttend' size='small' htmlType='submit'
                                onClick={ this.onAttend }>
                            { attend }
                        </Button>
                    </Button.Group>
                </div>
            );

            const tabBarStyle: CSSProperties = {
                display: 'flex', justifyContent: 'center'
            };

            content = (
                <div style={ { marginTop: 12 } }>
                    <Tabs tabBarStyle={ tabBarStyle } activeKey={ activeTab } onChange={ this.onTabChange }>
                        <Tabs.TabPane tab={ t('tab.annotations') } key={ TAB_KEY_ANNOUNCEMENTS }>
                            <PostList parent={ lecture } type={ PostType.Announcement }
                                      onPostAdded={ this.onPostAdded } onPostRemoved={ this.onPostRemoved }/>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={ t('tab.suggestions') } key={ TAB_KEY_SUGGESTIONS }>
                            <PostList parent={ lecture } type={ PostType.Suggestion }
                                      onPostAdded={ this.onPostAdded } onPostRemoved={ this.onPostRemoved }/>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={ t('tab.notes') } key={ TAB_KEY_NOTES }>
                            <NoteList parent={ lecture }
                                      onNoteAdded={ this.onNoteAdded } onNoteRemoved={ this.onNoteRemoved }/>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            );
        }

        return (
            <Page loading={ loading.data } error={ error } notFound={ notFound }>
                { header }
                { content }
            </Page>
        );
    }
}

const LecturePageWithTranslation = withTranslation()(LecturePage);

const LecturePageWithRouter = withRouter(LecturePageWithTranslation);

export { LecturePageWithRouter as LecturePage };
