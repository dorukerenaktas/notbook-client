import { message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { Status, UserService } from '../../../../service';
import { BaseModal } from '../../../component';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import './ForgotPasswordModal.css';

export type ForgotPasswordModalProps = {}

type ExtendedForgotPasswordModalProps = ForgotPasswordModalProps & WithTranslation;

interface ForgotPasswordModalState {
    loading: boolean
}

class ForgotPasswordModal extends Component<ExtendedForgotPasswordModalProps, ForgotPasswordModalState> {

    constructor(props: ExtendedForgotPasswordModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onForgotPassword = this.onForgotPassword.bind(this);
    }

    onForgotPassword(email: string): void {
        const { t } = this.props;
        UserService.forgotPassword({ email })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.forgotPassword.success'));
                (this.refs.modal as BaseModal).close(true);
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.USER_NOT_EXISTS:
                        message.error(t('response.forgotPassword.userNotExist'));
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
            <BaseModal ref='modal' className='forgotPasswordModal' loading={ loading }>
                <h3>{ t('modal.forgotPassword.title') }</h3>
                <p>{ t('modal.forgotPassword.paragraph') }</p>
                <ForgotPasswordForm loading={ loading } onSubmit={ this.onForgotPassword }/>
            </BaseModal>
        );
    }
}

const ForgotPasswordModalWithTranslation = withTranslation()(ForgotPasswordModal);

export { ForgotPasswordModalWithTranslation as ForgotPasswordModal };
