import { Button, Form, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { PostType } from '../../../../type';
import './CreatePostForm.css';

type CreatePostFormProps = {
    type: PostType,
    loading: boolean,
    onSubmit: (content: string) => void
};

type ExtendedCreatePostFormProps = CreatePostFormProps & WithTranslation & WrappedFormInternalProps;

interface CreatePostFormState {
}

class CreatePostForm extends Component<ExtendedCreatePostFormProps, CreatePostFormState> {

    constructor(props: ExtendedCreatePostFormProps) {
        super(props);

        this.onCreatePost = this.onCreatePost.bind(this);
    }

    onCreatePost(): void {
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
        const { t, type, loading } = this.props;

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
            rules: [{ required: true, whitespace: true, message: required }]
        })(
            <Input.TextArea className='createPostFormTextArea' placeholder={ placeholder }
                            autosize={ { minRows: 5, maxRows: 6 } } autoFocus={ true }/>
        );

        const submit: ReactNode = (
            // @ts-ignore
            <Button type='primary' htmlType='button' disabled={ loading } onClick={ this.onCreatePost } block>
                { t('form.createPost.button') }
            </Button>
        );

        return (
            <Form className='createPostForm'>
                <Form.Item>
                    { contentInput }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedCreatePostForm = Form.create<ExtendedCreatePostFormProps>()(CreatePostForm);

const CreatePostFormWithTranslation = withTranslation()(WrappedCreatePostForm);

export { CreatePostFormWithTranslation as CreatePostForm };
