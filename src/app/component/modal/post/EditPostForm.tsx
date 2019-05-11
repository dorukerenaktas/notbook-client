import { Button, Form, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { Post, PostType } from '../../../../type';
import './EditPostForm.css';

type EditPostFormProps = {
    parent: Post,
    type: PostType,
    loading: boolean,
    onSubmit: (content: string) => void,
};

type ExtendedEditPostFormProps = EditPostFormProps & WithTranslation & WrappedFormInternalProps;

interface EditPostFormState {

}

class EditPostForm extends Component<ExtendedEditPostFormProps, EditPostFormState> {

    constructor(props: ExtendedEditPostFormProps) {
        super(props);

        this.onEditPost = this.onEditPost.bind(this);
    }

    onEditPost(): void {
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
        const { t, loading, type, parent: { content } } = this.props;

        let placeholder = '';
        let required = '';

        switch (type) {
            case PostType.Announcement:
                placeholder = t('input.postContent.announcementPlaceholder');
                required = t('input.postContent.announcementRequired');
                break;
            case PostType.Suggestion:
                placeholder = t('input.postContent.suggestionPlaceholder');
                required = t('input.postContent.suggestionRequired');
                break;
            case PostType.University:
                placeholder = t('input.postContent.universityPlaceholder');
                required = t('input.postContent.universityRequired');
                break;
        }

        const contentInput = getFieldDecorator('content', {
            initialValue: content,
            rules: [{ required: true, whitespace: true, message: required }]
        })(
            <Input.TextArea className='editPostFormTextArea' placeholder={ placeholder }
                            autosize={ { minRows: 5, maxRows: 6 } } autoFocus={ true }/>
        );

        const submit: ReactNode = (
            // @ts-ignore
            <Button type='primary' htmlType='button' disabled={ loading } onClick={ this.onEditPost } block>
                { t('form.editPost.button') }
            </Button>
        );

        return (
            <Form className='editPostForm'>
                <Form.Item>
                    { contentInput }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedEditPostForm = Form.create<ExtendedEditPostFormProps>()(EditPostForm);

const EditPostFormWithTranslation = withTranslation()(WrappedEditPostForm);

export { EditPostFormWithTranslation as EditPostForm };
