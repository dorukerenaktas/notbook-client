import { Carousel, Icon, message, Spin } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import React, { Component } from 'reactn';
import EntranceFirst from '../../../asset/image/entrance-first.gif';
import EntranceSecond from '../../../asset/image/entrance-second.gif';
import EntranceThird from '../../../asset/image/entrance-third.gif';
import { SessionService, Status, UserService } from '../../../service';
import { ModalPortal } from '../../component';
import {
    CarouselPage,
    LoginForm,
    RegisterForm,
    ReSendVerificationModal,
    ReSendVerificationModalProps
} from './component';
import './EntrancePage.css';

type EntrancePageProps = {}

type EntrancePageEntranceProps = EntrancePageProps & WithTranslation & RouteComponentProps<any>;

interface EntrancePageState {
    loading: boolean;
    arrowColor: string;
    arrowVisibility: 'hidden' | 'visible';
}

class EntrancePage extends Component<EntrancePageEntranceProps, EntrancePageState> {

    carousel: Carousel | null = null;

    constructor(props: EntrancePageEntranceProps) {
        super(props);

        this.state = {
            loading: false,
            arrowColor: 'transparent',
            arrowVisibility: 'hidden'
        };

        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onFirstPage = this.onFirstPage.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
        this.onPreviousPage = this.onPreviousPage.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }

    onLogin(email: string, password: string): void {
        const { t } = this.props;
        UserService.login({ email, password })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(response => {
                message.success(t('response.login.success'));

                SessionService.saveUser(response.user);
                SessionService.saveTokens(
                    response.accessToken,
                    response.refreshToken
                );

                this.setGlobal({
                    user: response.user,
                    token: response.accessToken
                }, () => {
                    this.props.history.push('/university/' + response.user.university.id);
                });
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.EMAIL_OR_PASSWORD_WRONG:
                        message.error(t('response.login.emailOrPasswordWrong'));
                        break;
                    case Status.USER_NOT_VERIFIED:
                        ModalPortal.open<ReSendVerificationModalProps>(ReSendVerificationModal, {});
                        break;
                    case Status.UNKNOWN:
                        message.error(t('response.common.unknown'));
                        break;
                }

                this.setState({ loading: false });
            }).exec();
    }

    onRegister(firstName: string, lastName: string, email: string, password: string): void {
        const { t } = this.props;
        UserService.register({ firstName, lastName, email, password })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.register.success'));
                this.onFirstPage();
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.INVALID_STUDENT_MAIL:
                        message.error(t('response.register.invalidStudentMail'));
                        break;
                    case Status.EMAIL_IS_TAKEN:
                        message.error(t('response.register.emailIsTaken'));
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

    onFirstPage(): void {
        if (this.carousel !== null) {
            this.carousel.goTo(0);
        }
    }

    onNextPage(): void {
        if (this.carousel !== null) {
            this.carousel.next();
        }
    }

    onPreviousPage(): void {
        if (this.carousel !== null) {
            this.carousel.prev();
        }
    }

    onPageChange(page: number): void {
        switch (page) {
            case 0:
            case 4:
                this.setState({ arrowColor: 'transparent', arrowVisibility: 'hidden' });
                break;
            case 2:
                this.setState({ arrowColor: '#212121', arrowVisibility: 'visible' });
                break;
            case 1:
            case 3:
                this.setState({ arrowColor: '#FAFAFA', arrowVisibility: 'visible' });
                break;
        }
    }

    render(): ReactNode {
        const { t } = this.props;
        const { loading, arrowColor, arrowVisibility } = this.state;

        return (
            <Spin spinning={ loading }>
                <Icon className='entranceCarouselArrow' type='left'
                      style={ { left: 12, color: arrowColor, visibility: arrowVisibility } }
                      onClick={ this.onPreviousPage }/>
                <Icon className='entranceCarouselArrow' type='right'
                      style={ { right: 12, color: arrowColor, visibility: arrowVisibility } }
                      onClick={ this.onNextPage }/>
                <Carousel className='entranceCarousel'
                          ref={ element => this.carousel = element }
                          afterChange={ this.onPageChange }
                          infinite={ false }
                          dots={ false }>
                    <CarouselPage color='#FFFFFF'>
                        <LoginForm onNext={ this.onNextPage } onSubmit={ this.onLogin } loading={ loading }/>
                    </CarouselPage>
                    <CarouselPage color='#002172'>
                        <img className='entranceImage'
                             src={ EntranceFirst }
                             alt={ 'Study' }
                        />
                        <span className='entranceTitle'
                              style={ { color: '#FAFAFA' } }>
                            { t('page.entrance.title1') }
                        </span>
                        <span className='entranceDescription'
                              style={ { color: 'rgba(255,255,255,0.7)' } }>
                            { t('page.entrance.description1') }
                        </span>
                    </CarouselPage>
                    <CarouselPage color='#FDFDFD'>
                        <img className='entranceImage'
                             src={ EntranceSecond }
                             alt={ 'Chat' }
                        />
                        <span className='entranceTitle'
                              style={ { color: '#212121' } }>
                            { t('page.entrance.title2') }
                        </span>
                        <span className='entranceDescription'
                              style={ { color: 'rgba(0,0,0,0.7)' } }>
                        { t('page.entrance.description2') }
                        </span>
                    </CarouselPage>
                    <CarouselPage color='#171846'>
                        <img
                            className='entranceImage'
                            src={ EntranceThird }
                            alt={ 'Share' }
                        />
                        <span className='entranceTitle'
                              style={ { color: '#FAFAFA' } }>
                            { t('page.entrance.title3') }
                        </span>
                        <span className='entranceDescription'
                              style={ { color: 'rgba(255,255,255,0.7)' } }>
                        { t('page.entrance.description3') }
                        </span>
                    </CarouselPage>
                    <CarouselPage color='#FFFFFF'>
                        <RegisterForm onNext={ this.onFirstPage } onSubmit={ this.onRegister } loading={ loading }/>
                    </CarouselPage>
                </Carousel>
            </Spin>
        );
    }
}

let EntrancePageWithTranslation = withTranslation()(EntrancePage);

let EntrancePageWithRouter = withRouter(EntrancePageWithTranslation);

export { EntrancePageWithRouter as EntrancePage };
