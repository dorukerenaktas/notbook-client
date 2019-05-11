import { message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { NoteService, Status } from '../../../../service';
import { Note, NoteTag } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import { EditNoteForm } from './EditNoteForm';
import './EditNoteModal.css';

export type EditNoteModalProps = {
    header: ReactNode,
    note: Note,
    onSuccess: (name: string, description: string, tag: NoteTag) => void
}

type ExtendedEditNoteModalProps = EditNoteModalProps & WithTranslation;

interface EditNoteModalState {
    loading: boolean
}

class EditNoteModal extends Component<ExtendedEditNoteModalProps, EditNoteModalState> {

    constructor(props: ExtendedEditNoteModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onEditNote = this.onEditNote.bind(this);
    }

    onEditNote(name: string, description: string, tag: NoteTag): void {
        const { t, note: { id } } = this.props;
        NoteService.update({ noteId: id, name, description, tag })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.updateNote.success'));
                this.props.onSuccess(name, description, tag);
                (this.refs.modal as BaseModal).close(true);
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.UNKNOWN:
                        message.error(t('response.common.unknown'));
                        break;
                }
            })
            .onEnd(() => {
                this.setState({ loading: false });
            }).exec();
    }

    render(): any {
        const { header, note } = this.props;
        const { loading } = this.state;

        return (
            <BaseModal ref='modal' className='editNoteModal' loading={ loading }>
                <div className='editNoteModalContent'>
                    <ModalHeader header={ header }/>
                    <EditNoteForm note={ note } loading={ loading } onSubmit={ this.onEditNote }/>
                </div>
            </BaseModal>
        );
    }
}

const EditNoteModalWithTranslation = withTranslation()(EditNoteModal);

export { EditNoteModalWithTranslation as EditNoteModal };
