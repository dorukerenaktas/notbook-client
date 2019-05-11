import { message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { NoteService, SessionService, Status } from '../../../../service';
import { Lecture, NoteTag } from '../../../../type';
import { BaseModal } from '../common';
import { CreateNoteForm } from './CreateNoteForm';
import './CreateNoteModal.css';

export type CreateNoteModalProps = {
    parent: Lecture,
    onSuccess: (id: number, name: string, description: string, tag: NoteTag, fileExtension: string) => void
}

type ExtendedCreateNoteModalProps = CreateNoteModalProps & WithTranslation;

interface CreateNoteModalState {
    loading: boolean,
    progress: number
}

class CreateNoteModal extends Component<ExtendedCreateNoteModalProps, CreateNoteModalState> {

    constructor(props: ExtendedCreateNoteModalProps) {
        super(props);

        this.state = {
            loading: false,
            progress: 0
        };

        this.onCreateNote = this.onCreateNote.bind(this);
    }

    onCreateNote(name: string, description: string, tag: NoteTag, file: File): void {
        const self = this;
        const extension = file.name.split('.').pop();

        function onUploadProgress(progressEvent: ProgressEvent): void {
            let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            self.setState({ progress });
        }

        const { t, parent: { id } } = this.props;
        NoteService.create({ lectureId: id, name, description, tag, document: file }, onUploadProgress)
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                message.success(t('response.createNote.success'));
                this.props.onSuccess(response.noteId, name, description, tag, (extension ? extension : ''));
                this.saveNoteCount();
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

    saveNoteCount = () => {
        let user = this.global.user;

        user.addedNoteCount = user.addedNoteCount + 1;
        this.setGlobal({ user });
        SessionService.saveUser(user);
    };

    render(): ReactNode {
        const { parent } = this.props;
        const { loading, progress } = this.state;

        return (
            <BaseModal ref='modal' className='createNoteModal' loading={ loading } progress={ progress }>
                <div className='createNoteModalContent'>
                    <CreateNoteForm parent={ parent } loading={ loading } onSubmit={ this.onCreateNote }/>
                </div>
            </BaseModal>
        );
    }
}

const CreateNoteModalWithTranslation = withTranslation()(CreateNoteModal);

export { CreateNoteModalWithTranslation as CreateNoteModal };
