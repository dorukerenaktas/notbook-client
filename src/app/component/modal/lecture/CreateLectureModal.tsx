import { message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { LectureService, SessionService, Status } from '../../../../service';
import { University } from '../../../../type';
import { BaseModal } from '../common';
import { CreateLectureForm } from './CreateLectureForm';
import './CreateLectureModal.css';

export type CreateLectureModalProps = {
    parent: University,
    onSuccess: (id: number, code: string, name: string) => void
}

type ExtendedCreateLectureModalProps = CreateLectureModalProps & WithTranslation;

interface CreateNoteModalState {
    loading: boolean
}

class CreateLectureModal extends Component<ExtendedCreateLectureModalProps, CreateNoteModalState> {

    constructor(props: ExtendedCreateLectureModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onCreateNote = this.onCreateNote.bind(this);
    }

    onCreateNote(code: string, name: string): void {
        const { t } = this.props;
        LectureService.create({ code, name })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                message.success(t('response.createLecture.success'));
                this.saveLectureCount();
                this.props.onSuccess(response.lectureId, code, name);
                (this.refs.modal as BaseModal).close(true);
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.LECTURE_ALREADY_EXIST:
                        message.error(t('response.createLecture.lectureAlreadyExists'));
                        break;
                    case Status.UNKNOWN:
                        message.error(t('response.common.unknown'));
                        break;
                }
            })
            .onEnd(() => {
                this.setState({ loading: false });
            }).exec();
    }

    saveLectureCount = () => {
        let user = this.global.user;

        user.addedLectureCount = user.addedLectureCount + 1;
        this.setGlobal({ user });
        SessionService.saveUser(user);
    };

    render(): ReactNode {
        const { parent } = this.props;
        const { loading } = this.state;

        return (
            <BaseModal ref='modal' className='createLectureModal' loading={ loading }>
                <div className='createLectureModalContent'>
                    <CreateLectureForm parent={ parent } loading={ loading } onSubmit={ this.onCreateNote }/>
                </div>
            </BaseModal>
        );
    }
}

const CreateLectureModalWithTranslation = withTranslation()(CreateLectureModal);

export { CreateLectureModalWithTranslation as CreateLectureModal };
