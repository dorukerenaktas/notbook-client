import { Button, Form, Icon, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import './ForgotPasswordForm.css';

type ForgotPasswordFormProps = WithTranslation & {
    loading: boolean,
    onSubmit: (email: string) => void
};

type ExtendedForgotPasswordFormProps = ForgotPasswordFormProps & WithTranslation & WrappedFormInternalProps;

interface ForgotPasswordFormState {

}

class ForgotPasswordForm extends Component<ExtendedForgotPasswordFormProps, ForgotPasswordFormState> {

    constructor(props: ExtendedForgotPasswordFormProps) {
        super(props);

        this.onForgotPassword = this.onForgotPassword.bind(this);
    }

    onForgotPassword(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { email } = values;
                this.props.onSubmit(email);
            }
        };

        this.props.form.validateFields(callback);
    }

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

        const submit: ReactNode = (
            // @ts-ignore
            <Button type='primary' htmlType='button' block disabled={ loading } onClick={ this.onForgotPassword }>
                { t('form.forgotPassword.button') }
            </Button>
        );

        return (
            <Form className='forgotPasswordForm'>
                <Form.Item>
                    { emailInput }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedForgotPasswordForm = Form.create<ExtendedForgotPasswordFormProps>()(ForgotPasswordForm);

const ForgotPasswordFormWithTranslation = withTranslation()(WrappedForgotPasswordForm);

export { ForgotPasswordFormWithTranslation as ForgotPasswordForm };
