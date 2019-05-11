import { Button, ConfigProvider, Empty, List } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { NoteService, SessionService, Status } from '../../../service';
import { Lecture, Note, NoteTag } from '../../../type';
import { ModalPortal } from '../modal/common';
import { CreateNoteModal, CreateNoteModalProps } from '../modal/note';
import { NoteListItem } from './item';
import { ListError } from './ListError';
import './NoteList.css';

type NoteListProps = {
    parent: Lecture,
    onNoteAdded: () => void,
    onNoteRemoved: () => void
}

type ExtendedNoteListProps = NoteListProps & WithTranslation;

interface NoteListState {
    notes: Note[],
    loading: boolean,
    error: boolean
}

class NoteList extends Component<ExtendedNoteListProps, NoteListState> {

    constructor(props: ExtendedNoteListProps) {
        super(props);

        this.state = {
            notes: [],
            loading: false,
            error: false
        };

        this.loadItems = this.loadItems.bind(this);
        this.onCreateNote = this.onCreateNote.bind(this);
    }

    componentDidMount(): void {
        this.loadItems();
    }

    componentDidUpdate(prevProps: ExtendedNoteListProps): void {
        if (prevProps.parent.id !== this.props.parent.id) {
            this.loadItems();
        }
    }

    loadItems(): void {
        const { parent: { id } } = this.props;
        NoteService.getAll({ lectureId: id })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                this.setState({ notes: response.notes });
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

    addNoteToList = (id: number, name: string, description: string, tag: NoteTag, fileExtension: string): void => {
        const { parent, onNoteAdded } = this.props;

        const user = SessionService.getUser();

        if (user) {
            let note: Note = {
                id: id,
                name: name,
                description: description,
                tag: tag,
                rate: 0,
                favCount: 0,
                commentCount: 0,
                isFav: false,
                isEdited: false,
                fileExtension: fileExtension,
                createdAt: new Date().toString(),
                createdBy: user,
                lecture: parent
            };

            // Add note to list
            let notes = this.state.notes;
            notes.unshift(note);

            this.setState({ notes });
            onNoteAdded();
        }
    };

    onCreateNote(): void {
        const { parent } = this.props;
        ModalPortal.open<CreateNoteModalProps>(CreateNoteModal, { parent, onSuccess: this.addNoteToList });
    }

    render(): ReactNode {
        const { t } = this.props;
        const { notes, loading, error } = this.state;

        const renderEmpty = () => {
            if (error) {
                return (
                    <ListError message={ t('list.error.message') } button={ t('list.error.button') }
                               onClick={ this.loadItems }/>
                );
            } else {
                return (
                    <Empty description={ t('list.note.empty') }/>
                );
            }
        };

        const renderItem = (data: Note) => (
            <NoteListItem data={ data } parentUniversity/>
        );

        const header = (
            <div>
                <Button htmlType='submit' icon='plus' shape='circle' onClick={ this.onCreateNote }/>
                <span className='noteListAddButtonText'>{ t('list.note.add') }</span>
            </div>
        );

        return (
            <ConfigProvider renderEmpty={ renderEmpty }>
                <List className='noteList' split={ false } header={ header } itemLayout='vertical'
                      dataSource={ notes } loading={ loading } rowKey={ (note: Note) => note.id }
                      renderItem={ renderItem }/>
            </ConfigProvider>
        );
    }
}

const NoteListWithTranslation = withTranslation()(NoteList);

export { NoteListWithTranslation as NoteList };
