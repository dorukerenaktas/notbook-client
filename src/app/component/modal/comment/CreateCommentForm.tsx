import { Button, Form, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import './CreateCommentForm.css';

type CreateCommentFormProps = {
    loading: boolean,
    onSubmit: (content: string) => void
};

type ExtendedCreateCommentFormProps = CreateCommentFormProps & WithTranslation & WrappedFormInternalProps;

interface CreateCommentFormState {
}

class CreateCommentForm extends Component<ExtendedCreateCommentFormProps, CreateCommentFormState> {

    constructor(props: ExtendedCreateCommentFormProps) {
        super(props);

        this.onCreateComment = this.onCreateComment.bind(this);
    }

    onCreateComment(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { content } = values;
                this.props.onSubmit(content);
            }
        };

        this.props.form.validateFields(callback);
    }

    render(): ReactNode {
        const { getFieldDecorator } = this.props.form;
        const { t, loading } = this.props;

        const contentInput = getFieldDecorator('content', {
            rules: [{ required: true, whitespace: true, message: t('input.commentContent.required') }]
        })(
            <Input.TextArea className='createCommentFormTextArea' placeholder={ t('input.commentContent.placeholder') }
                            autosize={ { minRows: 5, maxRows: 6 } } autoFocus={ true }/>
        );

        const submit: ReactNode = (
            // @ts-ignore
            <Button type='primary' htmlType='button' disabled={ loading } onClick={ this.onCreateComment } block>
                { t('form.createComment.button') }
            </Button>
        );

        return (
            <Form className='createCommentForm'>
                <Form.Item>
                    { contentInput }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedCreateCommentForm = Form.create<ExtendedCreateCommentFormProps>()(CreateCommentForm);

const CreateCommentFormWithTranslation = withTranslation()(WrappedCreateCommentForm);

export { CreateCommentFormWithTranslation as CreateCommentForm };
