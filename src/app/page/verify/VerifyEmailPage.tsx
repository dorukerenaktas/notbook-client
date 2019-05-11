import { Spin } from 'antd';
import { CSSProperties, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import React, { Component } from 'reactn';
import ErrorImage from '../../../asset/image/mail-error.png';
import SuccessImage from '../../../asset/image/mail-success.gif';
import { Status, UserService } from '../../../service';
import './VerifyEmailPage.css';

type VerifyEmailPageProps = {}

type ExtendedVerifyEmailPageProps = VerifyEmailPageProps & WithTranslation & RouteComponentProps<any>;

interface VerifyEmailPageState {
    loading: boolean,
    error: boolean
}

class VerifyEmailPage extends Component<ExtendedVerifyEmailPageProps, VerifyEmailPageState> {

    constructor(props: ExtendedVerifyEmailPageProps) {
        super(props);

        this.state = {
            loading: false,
            error: false
        };

        this.verify = this.verify.bind(this);
    }

    componentDidMount(): void {
        this.verify();
    }

    verify(): void {
        const { match: { params: { hash } } } = this.props;
        UserService.verifyEmail({ hash })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                this.setState({ error: false });
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

    render(): ReactNode {
        const { t } = this.props;
        const { loading, error } = this.state;

        let image, title, message;
        if (error) {
            image = ErrorImage;
            title = t('page.verifyEmail.errorTitle');
            message = t('page.verifyEmail.errorMessage');
        } else {
            image = SuccessImage;
            title = t('page.verifyEmail.successTitle');
            message = t('page.verifyEmail.successMessage');
        }

        let style: CSSProperties = { visibility: (loading) ? 'hidden' : 'visible' };

        return (
            <Spin spinning={ loading } tip={ t('page.verifyEmail.loading') }>
                <div className='verifyEmail' style={ style }>
                    <img className='verifyEmailImage' src={ image } alt=''/>
                    <span className='verifyEmailTitle'>{ title }</span>
                    <span className='verifyEmailMessage'>{ message }</span>
                    <Link className='link verifyEmailLink' to='/'>{ t('page.verifyEmail.button') }</Link>
                </div>
            </Spin>
        );
    }
}

const VerifyEmailPageWithTranslation = withTranslation()(VerifyEmailPage);

const VerifyEmailPageWithRouter = withRouter(VerifyEmailPageWithTranslation);

export { VerifyEmailPageWithRouter as VerifyEmailPage };
