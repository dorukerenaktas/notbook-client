import { Button, Form, Icon, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import React, { Component } from 'reactn';
import './VerifyPasswordForm.css';

type VerifyPasswordFormProps = {
    loading: boolean,
    onSubmit: (password: string) => void
}

type ExtendedVerifyPasswordFormProps = VerifyPasswordFormProps & WithTranslation & WrappedFormInternalProps;

interface VerifyPasswordFormState {
}

class VerifyPasswordForm extends Component<ExtendedVerifyPasswordFormProps, VerifyPasswordFormState> {

    constructor(props: ExtendedVerifyPasswordFormProps) {
        super(props);

        this.onVerify = this.onVerify.bind(this);
    }

    onVerify(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { password } = values;
                this.props.onSubmit(password);
            }
        };

        this.props.form.validateFields(callback);
    }

    compareToFirstPassword = (rule: any, value: any, callback: any): void => {
        const { t } = this.props;
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback(t('input.rePassword.notMatching'));
        } else {
            callback();
        }
    };

    render(): ReactNode {
        const { t, loading } = this.props;
        const { getFieldDecorator } = this.props.form;

        const passwordInput = getFieldDecorator('password', {
            rules: [
                { required: true, whitespace: true, message: t('input.password.required') },
                { min: 8, message: t('input.password.minLength') },
                { max: 32, message: t('input.password.maxLength') }]
        })(
            <Input.Password prefix={ <Icon type='lock' style={ { color: 'rgba(0,0,0,.25)' } }/> } type='password'
                            placeholder={ t('input.password.placeholder') }/>
        );

        const rePasswordInput = getFieldDecorator('rePassword', {
            rules: [
                { required: true, whitespace: true, message: t('input.rePassword.required') },
                { validator: this.compareToFirstPassword }]
        })(
            <Input.Password prefix={ <Icon type='lock' style={ { color: 'rgba(0,0,0,.25)' } }/> } type='password'
                            placeholder={ t('input.rePassword.placeholder') }/>
        );

        const submit: ReactNode = (
            // @ts-ignore
            <Button type='primary' htmlType='button' block disabled={ loading } onClick={ this.onVerify }>
                { t('form.verifyPassword.button') }
            </Button>
        );

        const goToLogin: ReactNode = (
            <div className='verifyPasswordFormGoToLoginContainer'>
                <span>{ t('form.verifyPassword.goToLoginDescription') }</span>
                <Link to='/'>
                    <span className='verifyPasswordFormGoToLogin'>{ t('form.verifyPassword.goToLogin') }</span>
                </Link>
            </div>
        );

        return (
            <Form className='verifyPasswordForm'>
                <span className='logo verifyPasswordFormLogo'>{ t('appName') }</span>
                <span className='verifyPasswordFormDescription'>{ t('form.verifyPassword.description') }</span>
                <Form.Item>
                    { passwordInput }
                </Form.Item>
                <Form.Item>
                    { rePasswordInput }
                </Form.Item>
                { submit }
                { goToLogin }
            </Form>
        );
    }
}

const WrappedVerifyPasswordForm = Form.create<ExtendedVerifyPasswordFormProps>()(VerifyPasswordForm);

const VerifyPasswordFormWithTranslation = withTranslation()(WrappedVerifyPasswordForm);

export { VerifyPasswordFormWithTranslation as VerifyPasswordForm };
