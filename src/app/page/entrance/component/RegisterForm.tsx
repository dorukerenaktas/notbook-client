import { Button, Form, Icon, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ChangeEvent, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import './RegisterForm.css';

type RegisterFormProps = {
    onNext(): void,
    loading: boolean,
    onSubmit: (firstName: string, lastName: string, email: string, password: string) => void
}

type ExtendedRegisterFormProps = RegisterFormProps & WithTranslation & WrappedFormInternalProps;

interface RegisterFormState {
}

class RegisterForm extends Component<ExtendedRegisterFormProps, RegisterFormState> {

    constructor(props: ExtendedRegisterFormProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onRegister = this.onRegister.bind(this);
    }

    onRegister(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { firstName, lastName, email, password } = values;
                this.props.onSubmit(firstName, lastName, email, password);
            }
        };

        this.props.form.validateFields(callback);
    }

    onNext = (): void => {
        this.props.form.resetFields();
        this.props.onNext();
    };

    capitalize = (event: ChangeEvent<HTMLInputElement>): void => {
        let result = '';
        let value = event.target.value;
        let words = value.split(' ');
        for (let i = 0; i < words.length; i++) {
            let word = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            result += word;

            if (word.length > 0 && i < words.length - 1) {
                result += ' ';
            }
        }

        event.target.value = result;
    };

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

        const firstNameInput = getFieldDecorator('firstName', {
            rules: [
                { required: true, whitespace: true, message: t('input.firstName.required') },
                { pattern: /^[a-zA-ZığüşöçİĞÜŞÖÇ\s]*$/, message: t('input.firstName.invalid') }]
        })(
            <Input prefix={ <Icon type='user' style={ { color: 'rgba(0,0,0,.25)' } }/> } type='text'
                   placeholder={ t('input.firstName.placeholder') } onChange={ this.capitalize }/>
        );

        const lastNameInput = getFieldDecorator('lastName', {
            rules: [
                { required: true, whitespace: true, message: t('input.lastName.required') },
                { pattern: /^[a-zA-ZığüşöçİĞÜŞÖÇ\s]*$/, message: t('input.lastName.invalid') }]
        })(
            <Input prefix={ <Icon type='user' style={ { color: 'rgba(0,0,0,.25)' } }/> } type='text'
                   placeholder={ t('input.lastName.placeholder') } onChange={ this.capitalize }/>
        );

        const emailInput = getFieldDecorator('email', {
            rules: [
                { required: true, whitespace: true, message: t('input.email.required') },
                { pattern: /^[a-zA-Z0-9_.+-]+@.*(\.edu\.tr)$/, message: t('input.email.invalid') }]
        })(
            <Input prefix={ <Icon type='user' style={ { color: 'rgba(0,0,0,.25)' } }/> } type='text'
                   placeholder={ t('input.email.placeholder') }/>
        );

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
            <Button type='primary' htmlType='button' block disabled={ loading } onClick={ this.onRegister }>
                { t('form.register.button') }
            </Button>
        );

        const goToLogin: ReactNode = (
            <div className='registerFormGoToLoginContainer'>
                <span>{ t('form.register.goToLoginDescription') }</span>
                <span className='registerFormGoToLogin' onClick={ this.onNext }>
                    { t('form.register.goToLogin') }
                </span>
            </div>
        );

        return (
            <Form className='registerForm'>
                <span className='logo registerFormLogo'>{ t('appName') }</span>
                <Form.Item>
                    { firstNameInput }
                </Form.Item>
                <Form.Item>
                    { lastNameInput }
                </Form.Item>
                <Form.Item>
                    { emailInput }
                </Form.Item>
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

const WrappedRegisterForm = Form.create<ExtendedRegisterFormProps>()(RegisterForm);

const RegisterFormWithTranslation = withTranslation()(WrappedRegisterForm);

export { RegisterFormWithTranslation as RegisterForm };
