import { Button, message, Rate } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { NoteService, Status } from '../../../../service';
import { Note } from '../../../../type';
import { BaseModal } from '../common';
import './RateNoteModal.css';

export type RateNoteModalProps = {
    parent: Note,
    onSuccess: (rate: number) => void
}

type ExtendedRateNoteModalProps = RateNoteModalProps & WithTranslation;

interface RateNoteModalState {
    rate: number,
    loading: boolean
}

class RateNoteModal extends Component<ExtendedRateNoteModalProps, RateNoteModalState> {

    constructor(props: ExtendedRateNoteModalProps) {
        super(props);

        this.state = {
            rate: props.parent.rate,
            loading: false
        };

        this.onRateNote = this.onRateNote.bind(this);
    }

    onRateNote(): void {
        const { t, parent: { id } } = this.props;
        const { rate } = this.state;
        NoteService.rate({ noteId: id, rate })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                message.success(t('response.rateNote.success'));
                this.props.onSuccess(response.rate);
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

    onRateChange = (value: number) => {
        this.setState({ rate: value });
    };

    render(): ReactNode {
        const { t } = this.props;
        const { loading, rate } = this.state;

        const submit = (
            // @ts-ignore
            <Button className='rateNoteModalButton' type='primary' htmlType='submit' onClick={ this.onRateNote }
                    disabled={ loading } block>
                { t('modal.rateNote.button') }
            </Button>
        );

        return (
            <BaseModal ref='modal' className='rateNoteModal' loading={ loading }>
                <div className='rateNoteModalContent'>
                    <div className='rateNoteModalDescription'>
                        <span>{ t('modal.rateNote.description') }</span>
                        <Rate className='rateNoteModalRate' onChange={ this.onRateChange } value={ rate } allowHalf/>
                    </div>
                    { submit }
                </div>
            </BaseModal>
        );
    }
}

const RateNoteModalWithTranslation = withTranslation()(RateNoteModal);

export { RateNoteModalWithTranslation as RateNoteModal };
