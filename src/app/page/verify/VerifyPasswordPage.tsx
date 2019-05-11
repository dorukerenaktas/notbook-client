import { message, Spin } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import React, { Component } from 'reactn';
import { Status, UserService } from '../../../service';
import { VerifyPasswordForm } from './component';
import './VerifyPasswordPage.css';

type VerifyPasswordPageProps = {}

type ExtendedVerifyPasswordPageProps = VerifyPasswordPageProps & WithTranslation & RouteComponentProps<any>;

interface VerifyPasswordPageState {
    loading: boolean
}

class VerifyPasswordPage extends Component<ExtendedVerifyPasswordPageProps, VerifyPasswordPageState> {

    constructor(props: ExtendedVerifyPasswordPageProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.verify = this.verify.bind(this);
    }

    verify(password: string): void {
        const { t, match: { params: { hash } } } = this.props;
        UserService.verifyPassword({ hash, password })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.verifyPassword.success'));
                this.props.history.push('/');
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.UNKNOWN:
                        message.error(t('response.verifyPassword.unknown'));
                        break;
                }
            })
            .onEnd(() => {
                this.setState({ loading: false });
            }).exec();
    }

    render(): ReactNode {
        const { loading } = this.state;

        return (
            <Spin spinning={ loading }>
                <div className='verifyPassword'>
                    <VerifyPasswordForm loading={ loading } onSubmit={ this.verify }/>
                </div>
            </Spin>
        );
    }
}

const VerifyPasswordPageWithTranslation = withTranslation()(VerifyPasswordPage);

const VerifyPasswordPageWithRouter = withRouter(VerifyPasswordPageWithTranslation);

export { VerifyPasswordPageWithRouter as VerifyPasswordPage };
