import { ConfigProvider, Empty, List } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import React, { Component } from 'reactn';
import { ContainerPage } from '../';
import { NoteService, SessionService, Status } from '../../../service';
import { Note } from '../../../type';
import { NoteListItem } from '../../component';
import { Page } from '../Page';
import './FavoriteNotesPage.css';

type FavoriteNotesPageProps = {}

type ExtendedFavoriteNotesPageProps = FavoriteNotesPageProps & WithTranslation & RouteComponentProps<any>;

interface FavoriteNotesPageState {
    notes: Note[],
    loading: boolean,
    error: boolean
}

class FavoriteNotesPage extends Component<ExtendedFavoriteNotesPageProps, FavoriteNotesPageState> {

    constructor(props: ExtendedFavoriteNotesPageProps) {
        super(props);

        this.state = {
            notes: props.location.state ? props.location.state.data : undefined,
            loading: false,
            error: false
        };

        this.loadPage = this.loadPage.bind(this);
    }

    componentDidMount(): void {
        const { notes } = this.state;
        if (!notes) {
            this.loadPage();
        } else {
            this.saveNoteCount();
        }

        ContainerPage.menuSelectFavoriteNotes();
    }

    loadPage(): void {
        NoteService.getFav({})
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                this.setState({ notes: response.data });
                this.saveNoteCount();
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

    saveNoteCount = () => {
        const { notes } = this.state;
        let user = this.global.user;

        if (user.favNoteCount !== notes.length) {
            user.favNoteCount = notes.length;
            this.setGlobal({ user });
            SessionService.saveUser(user);
        }
    };

    render(): ReactNode {
        const { t } = this.props;
        const { notes, loading, error } = this.state;

        const renderEmpty = () => <Empty description={ t('list.note.empty') }/>;

        const renderItem = (data: Note) => (
            <NoteListItem data={ data }/>
        );

        const header = (
            <div>
                <span className='attendedLectureListTitle'>{ t('page.favoriteNotes.title') }</span>
            </div>
        );

        const content = (
            <ConfigProvider renderEmpty={ renderEmpty }>
                <List className='attendedLectureList' header={ header } itemLayout='vertical' dataSource={ notes }
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

const FavoriteNotesPageWithTranslation = withTranslation()(FavoriteNotesPage);

const FavoriteNotesPageWithRouter = withRouter(FavoriteNotesPageWithTranslation);

export { FavoriteNotesPageWithRouter as FavoriteNotesPage };
