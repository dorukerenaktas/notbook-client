import { message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { Status, UserService } from '../../../../service';
import { BaseModal } from '../../../component';
import { ReSendVerificationForm } from './ReSendVerificationForm';
import './ReSendVerificationModal.css';

export type ReSendVerificationModalProps = {}

type ExtendedReSendVerificationModalProps = ReSendVerificationModalProps & WithTranslation;

interface ReSendVerificationModalState {
    loading: boolean
}

class ReSendVerificationModal extends Component<ExtendedReSendVerificationModalProps, ReSendVerificationModalState> {

    constructor(props: ExtendedReSendVerificationModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onReSendVerification = this.onReSendVerification.bind(this);
    }

    onReSendVerification(email: string): void {
        const { t } = this.props;
        UserService.resendVerification({ email })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.resendVerification.success'));
                (this.refs.modal as BaseModal).close(true);
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.USER_NOT_EXISTS:
                        message.error(t('response.resendVerification.userNotExist'));
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
        const { t } = this.props;
        const { loading } = this.state;

        return (
            <BaseModal ref='modal' className='reSendVerificationModal' loading={ loading }>
                <h3>{ t('modal.resendVerification.title') }</h3>
                <p>{ t('modal.resendVerification.paragraph1') }</p>
                <p>{ t('modal.resendVerification.paragraph2') }</p>
                <ReSendVerificationForm loading={ loading } onSubmit={ this.onReSendVerification }/>
                <p className='reSendVerificationModalDescription'>
                    { t('modal.resendVerification.description') }
                </p>
            </BaseModal>
        );
    }
}

const ReSendVerificationModalWithTranslation = withTranslation()(ReSendVerificationModal);

export { ReSendVerificationModalWithTranslation as ReSendVerificationModal };
