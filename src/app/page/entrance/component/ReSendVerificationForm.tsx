import { Button, Form, Icon, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import './ReSendVerificationForm.css';

type ReSendVerificationFormProps = {
    loading: boolean,
    onSubmit: (email: string) => void
};

type ExtendedReSendVerificationFormProps = ReSendVerificationFormProps & WithTranslation & WrappedFormInternalProps;

interface ReSendVerificationFormState {

}

class ReSendVerificationForm extends Component<ExtendedReSendVerificationFormProps, ReSendVerificationFormState> {

    constructor(props: ExtendedReSendVerificationFormProps) {
        super(props);

        this.onReSendVerification = this.onReSendVerification.bind(this);
    }

    onReSendVerification(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { email } = values;
                this.props.onSubmit(email);
            }
        };

        this.props.form.validateFields(callback);
    }

    render(): ReactNode {
        const { getFieldDecorator } = this.props.form;
        const { t, loading } = this.props;

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
            <Button type='primary' htmlType='button' block disabled={ loading } onClick={ this.onReSendVerification }>
                { t('form.resendVerification.button') }
            </Button>
        );

        return (
            <Form className='reSendVerificationForm'>
                <Form.Item>
                    { emailInput }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedReSendVerificationForm = Form.create<ExtendedReSendVerificationFormProps>()(ReSendVerificationForm);

const ReSendVerificationFormWithTranslation = withTranslation()(WrappedReSendVerificationForm);

export { ReSendVerificationFormWithTranslation as ReSendVerificationForm };
