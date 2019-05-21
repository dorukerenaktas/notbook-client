import { Icon, Tabs, Tooltip } from 'antd';
import { CSSProperties, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import React, { Component } from 'reactn';
import { ContainerPage } from '../';
import { Status, UniversityService } from '../../../service';
import { ExtendedUniversity, PostType, UniversityLocation } from '../../../type';
import { LectureList, PostList } from '../../component';
import { Page } from '../Page';
import './UniversityPage.css';

export const TAB_KEY_WALL = 'wall';
export const TAB_KEY_LECTURES = 'lectures';

type UniversityPageProps = {};

type ExtendedUniversityPageProps = UniversityPageProps & WithTranslation & RouteComponentProps<any>;

interface UniversityPageState {
    university: ExtendedUniversity,
    activeTab: string,
    loading: boolean,
    error: boolean,
    notFound: boolean
}

class UniversityPage extends Component<ExtendedUniversityPageProps, UniversityPageState> {

    constructor(props: ExtendedUniversityPageProps) {
        super(props);

        this.state = {
            university: props.location.state ? props.location.state.data : undefined,
            activeTab: this.extractTabParams(props.match.params.tab),
            loading: false,
            error: props.location.state ? props.location.state.error : false,
            notFound: props.location.state ? props.location.state.notFound : false
        };

        this.loadPage = this.loadPage.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
    }

    componentDidMount(): void {
        const { university, error, notFound } = this.state;

        if (!university && !error && !notFound) {
            this.loadPage();
        }

        ContainerPage.menuSelectUserUniversity();
    }

    componentDidUpdate(prevProps: ExtendedUniversityPageProps): void {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({ university: this.props.location.state.data });
        }

        if (this.props.match.params.tab !== this.state.activeTab) {
            this.setState({ activeTab: prevProps.match.params.tab });
        }
    }

    loadPage(): void {
        const { match: { params: { id } } } = this.props;
        UniversityService.get({ universityId: id })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                this.setState({ university: response.data });
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
                this.setState({ loading: false });
            }).exec();
    }

    onTabChange(activeKey: string): void {
        this.props.history.push('/university/' + this.props.match.params.id + '/' + activeKey);
        this.setState({ activeTab: activeKey });
    }

    extractTabParams(tab: string): string {
        if (tab !== TAB_KEY_WALL && tab !== TAB_KEY_LECTURES) {
            this.props.history.replace('/university/' + this.props.match.params.id + '/' + TAB_KEY_WALL);

            return TAB_KEY_WALL;
        }

        return tab;
    }

    onPostAdded = (): void => {
        const { university } = this.state;

        this.setState({ university: { ...university, commentCount: university.commentCount + 1 } });
    };

    onPostRemoved = (): void => {
        const { university } = this.state;

        this.setState({ university: { ...university, commentCount: university.commentCount - 1 } });
    };

    onLectureAdded = (): void => {
        const { university } = this.state;

        this.setState({ university: { ...university, lectureCount: university.lectureCount + 1 } });
    };

    onLectureRemoved = (): void => {
        const { university } = this.state;

        this.setState({ university: { ...university, lectureCount: university.lectureCount - 1 } });
    };

    render(): ReactNode {
        const { t } = this.props;
        const { university, activeTab, loading, error, notFound } = this.state;

        let header: ReactNode;
        let content: ReactNode;

        if (university) {
            header = (
                <div className='universityPageHeader'>
                    <img className='universityPageHeaderLogo' src={ university.imageUrl } alt='University Logo'/>
                    <div className='universityPageHeaderTitleContainer'>
                        <div>
                            <span className='universityPageHeaderTitle'>
                                { university.name }
                            </span>
                        </div>
                        <div>
                            <span className='universityPageHeaderLocation'>
                                { UniversityLocation[university.location] }
                            </span>
                        </div>
                    </div>
                    <div className='universityPageHeaderAttributes'>
                        <Tooltip placement='bottom' title={ t('tooltip.studentCount') }>
                            <Icon className='universityPageHeaderAttributeIcon' type='user'/>
                            <span className='universityPageHeaderAttributeText'>
                                { university.studentCount }
                            </span>
                        </Tooltip>
                        <Tooltip placement='bottom' title={ t('tooltip.postCount') }>
                            <Icon className='universityPageHeaderAttributeIcon' type='message'/>
                            <span className='universityPageHeaderAttributeText'>
                                { university.commentCount }
                            </span>
                        </Tooltip>
                        <Tooltip placement='bottom' title={ t('tooltip.lectureCount') }>
                            <Icon className='universityPageHeaderAttributeIcon' type='book'/>
                            <span className='universityPageHeaderAttributeText'>
                                { university.lectureCount }
                            </span>
                        </Tooltip>
                    </div>
                </div>
            );

            const tabBarStyle: CSSProperties = {
                display: 'flex', justifyContent: 'center'
            };

            content = (
                <div className='universityPage'>
                    <Tabs tabBarStyle={ tabBarStyle } activeKey={ activeTab } onChange={ this.onTabChange }>
                        <Tabs.TabPane tab={ t('tab.wall') } key={ TAB_KEY_WALL }>
                            <PostList parent={ university } type={ PostType.University }
                                      onPostAdded={ this.onPostAdded } onPostRemoved={ this.onPostRemoved }/>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={ t('tab.lectures') } key={ TAB_KEY_LECTURES }>
                            <LectureList parent={ university }
                                         onLectureAdded={ this.onLectureAdded }
                                         onLectureRemoved={ this.onLectureRemoved }/>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            );
        }

        return (
            <Page loading={ loading } error={ error } notFound={ notFound }>
                { header }
                { content }
            </Page>
        );
    }
}

const UniversityPageWithTranslation = withTranslation()(UniversityPage);

const UniversityPageWithRouter = withRouter(UniversityPageWithTranslation);

export { UniversityPageWithRouter as UniversityPage };
