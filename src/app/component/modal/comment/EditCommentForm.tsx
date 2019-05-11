import { Button, Form, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { Comment } from '../../../../type';
import './EditCommentForm.css';

type EditCommentFormProps = {
    comment: Comment
    loading: boolean,
    onSubmit: (content: string) => void
};

type ExtendedEditCommentFormProps = EditCommentFormProps & WithTranslation & WrappedFormInternalProps;

interface EditCommentFormState {
}

class EditCommentForm extends Component<ExtendedEditCommentFormProps, EditCommentFormState> {

    constructor(props: ExtendedEditCommentFormProps) {
        super(props);

        this.onEditComment = this.onEditComment.bind(this);
    }

    onEditComment(): void {
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
        const { t, loading, comment: { content } } = this.props;

        const contentInput = getFieldDecorator('content', {
            initialValue: content,
            rules: [{ required: true, whitespace: true, message: t('input.commentContent.required') }]
        })(
            <Input.TextArea className='editCommentFormTextArea' placeholder={ t('input.commentContent.placeholder') }
                            autosize={ { minRows: 5, maxRows: 6 } } autoFocus={ true }/>
        );

        const submit = (
            // @ts-ignore
            <Button type='primary' htmlType='button' disabled={ loading } onClick={ this.onEditComment } block>
                { t('form.editComment.button') }
            </Button>
        );

        return (
            <Form className='editCommentForm'>
                <Form.Item>
                    { contentInput }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedEditCommentForm = Form.create<ExtendedEditCommentFormProps>()(EditCommentForm);

const EditCommentFormWithTranslation = withTranslation()(WrappedEditCommentForm);

export { EditCommentFormWithTranslation as EditCommentForm };
