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
import './AddedNotesPage.css';

type AddedNotesPageProps = {}

type ExtendedAddedNotesPageProps = AddedNotesPageProps & WithTranslation & RouteComponentProps<any>;

interface AddedNotesPageState {
    notes: Note[],
    loading: boolean,
    error: boolean
}

class AddedNotesPage extends Component<ExtendedAddedNotesPageProps, AddedNotesPageState> {

    constructor(props: ExtendedAddedNotesPageProps) {
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

        ContainerPage.menuSelectAddedNotes();
    }

    loadPage(): void {
        NoteService.getAdded({})
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

        if (user.addedNoteCount !== notes.length) {
            user.addedNoteCount = notes.length;
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
                <span className='addedLectureListTitle'>{ t('page.addedNotes.title') }</span>
            </div>
        );

        const content = (
            <ConfigProvider renderEmpty={ renderEmpty }>
                <List className='addedLectureList' header={ header } itemLayout='vertical' dataSource={ notes }
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

const AddedNotesPageWithTranslation = withTranslation()(AddedNotesPage);

const AddedNotesPageWithRouter = withRouter(AddedNotesPageWithTranslation);

export { AddedNotesPageWithRouter as AddedNotesPage };
