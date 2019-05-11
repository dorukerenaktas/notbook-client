import { Button, message } from 'antd';
import { ReactNode } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { NoteService, Status } from '../../../../service';
import { Note } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import './ReportNoteModal.css';

export type ReportNoteModalProps = {
    header: ReactNode,
    note: Note
}

type ExtendedReportNoteModalProps = ReportNoteModalProps & WithTranslation;

interface ReportNoteModalState {
    loading: boolean
}

class ReportNoteModal extends Component<ExtendedReportNoteModalProps, ReportNoteModalState> {

    constructor(props: ExtendedReportNoteModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onReportNote = this.onReportNote.bind(this);
    }

    onReportNote(): void {
        const { t, note: { id } } = this.props;
        NoteService.report({ noteId: id })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.reportNote.success'));
                (this.refs.modal as BaseModal).close(true);
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.NOTE_ALREADY_REPORTED:
                        message.error(t('response.reportNote.alreadyReported'));
                        break;
                    case Status.NOTE_IS_VERIFIED:
                        message.error(t('response.reportNote.verified'));
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

    render(): ReactNode {
        const { t, header } = this.props;
        const { loading } = this.state;

        const submit = (
            // @ts-ignore
            <Button className='reportNoteModalButton' type='danger' htmlType='submit' onClick={ this.onReportNote }
                    disabled={ loading } block>
                { t('modal.reportNote.button') }
            </Button>
        );

        return (
            <BaseModal ref='modal' className='reportNoteModal' loading={ loading }>
                <div className='reportNoteModalContent'>
                    <ModalHeader header={ header }/>
                    <div className='reportNoteModalDescription'>
                        <span>{ t('modal.reportNote.description') }</span>
                    </div>
                    { submit }
                </div>
            </BaseModal>
        );
    }
}

const ReportNoteModalWithTranslation = withTranslation()(ReportNoteModal);

export { ReportNoteModalWithTranslation as ReportNoteModal };
