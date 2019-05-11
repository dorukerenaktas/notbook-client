import { Button, Form, Icon, Input, Select, Upload } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { ReactNode } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { Lecture, NoteTag } from '../../../../type';
import './CreateNoteForm.css';

type CreateNoteFormProps = {
    parent: Lecture,
    loading: boolean,
    onSubmit: (name: string, description: string, tag: NoteTag, file: File) => void,
};

type ExtendedCreateNoteFormProps = CreateNoteFormProps & WithTranslation & WrappedFormInternalProps;

interface CreateNoteFormState {
    fileList: UploadFile[]
}

class CreateNoteForm extends Component<ExtendedCreateNoteFormProps, CreateNoteFormState> {

    constructor(props: ExtendedCreateNoteFormProps) {
        super(props);

        this.state = {
            fileList: []
        };

        this.onCreateNote = this.onCreateNote.bind(this);
    }

    onCreateNote(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { name, description, tag, document: { file } } = values;
                this.props.onSubmit(name, description, tag, file);
            }
        };

        this.props.form.validateFields(callback);
    }

    beforeUpload = (): boolean => {
        return false;
    };

    onFileRemove = (): void => {
        this.setState({ fileList: [] });
        this.props.form.setFieldsValue({ ['document']: { file: null, fileList: [] } });
        this.props.form.validateFields(['document']);
    };

    onFileChange = (info: UploadChangeParam): void => {
        this.setState({ fileList: [info.file] });
    };

    uploadValidator = (rule: any, value: UploadChangeParam, callback: any): void => {
        const { t } = this.props;
        if (value && value.file) {
            const { file } = value;
            const extension = file.name.split('.').pop();
            if (extension === 'pdf' ||
                extension === 'doc' ||
                extension === 'docx' ||
                extension === 'ppt' ||
                extension === 'pptx' ||
                extension === 'xls' ||
                extension === 'xlsx') {
                if (file.size / 1024 / 1024 < 100) {
                    callback();
                } else {
                    callback(t('input.noteDocument.invalidSize'));
                }
            } else {
                callback(t('input.noteDocument.invalidType'));
            }
        } else {
            callback(t('input.noteDocument.required'));
        }
    };

    render(): ReactNode {
        const { t, loading, parent: { name }, form } = this.props;
        const { getFieldDecorator } = form;
        const { fileList } = this.state;

        const lectureInput: ReactNode = (
            <Input disabled type='text' value={ name }/>
        );

        const nameInput = getFieldDecorator('name', {
            rules: [
                { required: true, whitespace: true, message: t('input.noteName.required') },
                { pattern: /^[a-zA-ZığüşöçİĞÜŞÖÇ0-9\s]*$/, message: t('input.noteName.invalid') }]
        })(
            <Input type='text' placeholder={ t('input.noteName.placeholder') } autoFocus/>
        );

        const descriptionInput = getFieldDecorator('description', {
            rules: [{ required: true, whitespace: true, message: t('input.noteDescription.required') }]
        })(
            <Input.TextArea className='createNoteFormTextArea' placeholder={ t('input.noteDescription.placeholder') }
                            autosize={ { minRows: 5, maxRows: 6 } }/>
        );

        const tagSelect = getFieldDecorator('tag', {
            rules: [{ required: true, message: t('input.noteTag.required') }]
        })(
            <Select style={ { width: '100%' } } placeholder={ t('input.noteTag.placeholder') }>
                <Select.Option value={ NoteTag.Notebook }>
                    { t('tag.notebook') }
                </Select.Option>
                <Select.Option value={ NoteTag.Slide }>
                    { t('tag.slide') }
                </Select.Option>
                <Select.Option value={ NoteTag.Lab }>
                    { t('tag.lab') }
                </Select.Option>
                <Select.Option value={ NoteTag.Homework }>
                    { t('tag.homework') }
                </Select.Option>
                <Select.Option value={ NoteTag.Project }>
                    { t('tag.project') }
                </Select.Option>
                <Select.Option value={ NoteTag.Quiz }>
                    { t('tag.quiz') }
                </Select.Option>
                <Select.Option value={ NoteTag.Midterm }>
                    { t('tag.midterm') }
                </Select.Option>
                <Select.Option value={ NoteTag.Final }>
                    { t('tag.final') }
                </Select.Option>
            </Select>
        );

        const documentUpload = getFieldDecorator('document', {
            rules: [{ validator: this.uploadValidator }]
        })(
            <Upload.Dragger fileList={ fileList } disabled={ loading } beforeUpload={ this.beforeUpload }
                            onRemove={ this.onFileRemove } onChange={ this.onFileChange }>
                <p className='ant-upload-drag-icon'><Icon type='inbox'/></p>
                <p className='ant-upload-text'>{ t('input.noteDocument.title') }</p>
                <p className='ant-upload-hint'>{ t('input.noteDocument.description') }</p>
            </Upload.Dragger>
        );

        const submit: ReactNode = (
            // @ts-ignore
            <Button type='primary' htmlType='button' disabled={ loading } onClick={ this.onCreateNote } block>
                { t('form.createNote.button') }
            </Button>
        );

        return (
            <Form className='createNoteForm'>
                <Form.Item label={ t('input.lectureName.label') }>
                    { lectureInput }
                </Form.Item>
                <Form.Item label={ t('input.noteName.label') }>
                    { nameInput }
                </Form.Item>
                <Form.Item label={ t('input.noteDescription.label') } required>
                    { descriptionInput }
                </Form.Item>
                <Form.Item label={ t('input.noteTag.label') } required>
                    { tagSelect }
                </Form.Item>
                <Form.Item label={ t('input.noteDocument.label') } required>
                    { documentUpload }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedCreateNoteForm = Form.create<ExtendedCreateNoteFormProps>()(CreateNoteForm);

const CreateNoteFormWithTranslation = withTranslation()(WrappedCreateNoteForm);

export { CreateNoteFormWithTranslation as CreateNoteForm };
