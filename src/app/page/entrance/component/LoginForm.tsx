import { Button, Form, Icon, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';

import { withTranslation, WithTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { ModalPortal } from '../../../component';
import { ForgotPasswordModal, ForgotPasswordModalProps } from './ForgotPasswordModal';
import './LoginForm.css';

type LoginFormProps = {
    onNext(): void,
    loading: boolean,
    onSubmit: (email: string, password: string) => void
};

type ExtendedLoginFormProps = LoginFormProps & WithTranslation & WrappedFormInternalProps;

interface LoginFormState {
}

class LoginForm extends Component<ExtendedLoginFormProps, LoginFormState> {

    constructor(props: ExtendedLoginFormProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onLogin = this.onLogin.bind(this);
    }

    onLogin(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { email, password } = values;
                this.props.onSubmit(email, password);
            }
        };

        this.props.form.validateFields(callback);
    }

    onNext = (): void => {
        this.props.form.resetFields();
        this.props.onNext();
    };

    onForgotPassword = (): void => {
        ModalPortal.open<ForgotPasswordModalProps>(ForgotPasswordModal, {});
    };

    render(): ReactNode {
        const { t, loading, form } = this.props;
        const { getFieldDecorator } = form;

        const emailInput = getFieldDecorator('email', {
            rules: [
                { required: true, whitespace: true, message: t('input.email.required') },
                { pattern: /^[a-zA-Z0-9_.+-]+@.*(\.edu\.tr)$/, message: t('input.email.invalid') }]
        })(
            <Input prefix={ <Icon type='user' style={ { color: 'rgba(0,0,0,.25)' } }/> } type='text'
                   placeholder={ t('input.email.placeholder') }/>
        );

        const passwordInput = getFieldDecorator('password', {
            rules: [{ required: true, whitespace: true, message: t('input.password.required') }]
        })(
            <Input.Password prefix={ <Icon type='lock' style={ { color: 'rgba(0,0,0,.25)' } }/> } type='password'
                            placeholder={ t('input.password.placeholder') }/>
        );

        const forgotPassword: ReactNode = (
            <div>
                <span className='loginFormForgotPassword' onClick={ this.onForgotPassword }>
                    { t('form.login.forgotPassword') }
                </span>
            </div>
        );

        const submit: ReactNode = (
            // @ts-ignore
            <Button type='primary' htmlType='button' block disabled={ loading } onClick={ this.onLogin }>
                { t('form.login.button') }
            </Button>
        );

        const goToRegister: ReactNode = (
            <div className='loginFormGoToRegisterContainer'>
                <span>{ t('form.login.goToRegisterDescription') }</span>
                <span className='loginFormGoToRegister' onClick={ this.onNext }>
                    { t('form.login.goToRegister') }
                </span>
            </div>
        );

        return (
            <Form className='loginForm'>
                <span className='logo loginFormLogo'>{ t('appName') }</span>
                <Form.Item>
                    { emailInput }
                </Form.Item>
                <Form.Item>
                    { passwordInput }
                </Form.Item>
                { forgotPassword }
                { submit }
                { goToRegister }
            </Form>
        );
    }
}

const WrappedLoginForm = Form.create<ExtendedLoginFormProps>()(LoginForm);

const LoginFormWithTranslation = withTranslation()(WrappedLoginForm);

export { LoginFormWithTranslation as LoginForm };
