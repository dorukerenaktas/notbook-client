import { Button, Form, Input, Select } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { Note, NoteTag } from '../../../../type';
import './EditNoteForm.css';

type EditNoteFormProps = {
    note: Note,
    loading: boolean,
    onSubmit: (name: string, description: string, tag: NoteTag) => void
};

type ExtendedEditNoteFormProps = EditNoteFormProps & WithTranslation & WrappedFormInternalProps;

interface EditNoteFormState {
}

class EditNoteForm extends Component<ExtendedEditNoteFormProps, EditNoteFormState> {

    constructor(props: ExtendedEditNoteFormProps) {
        super(props);

        this.onEditNote = this.onEditNote.bind(this);
    }

    onEditNote(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { name, description, tag } = values;
                this.props.onSubmit(name, description, tag);
            }
        };

        this.props.form.validateFields(callback);
    }

    render(): ReactNode {
        const { getFieldDecorator } = this.props.form;
        const { t, loading, note: { name, description, tag } } = this.props;

        const nameInput = getFieldDecorator('name', {
            initialValue: name,
            rules: [
                { required: true, whitespace: true, message: t('input.noteName.required') },
                { pattern: /^[a-zA-ZığüşöçİĞÜŞÖÇ0-9\s]*$/, message: t('input.noteName.invalid') }]
        })(
            <Input type='text' placeholder={ t('input.noteName.placeholder') } autoFocus/>
        );

        const descriptionInput = getFieldDecorator('description', {
            initialValue: description,
            rules: [{ required: true, whitespace: true, message: t('input.noteDescription.required') }]
        })(
            <Input.TextArea className='editNoteFormTextArea' placeholder={ t('input.noteDescription.placeholder') }
                            autosize={ { minRows: 5, maxRows: 6 } } autoFocus={ true }/>
        );

        const tagSelect = getFieldDecorator('tag', {
            initialValue: tag,
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

        const submit: ReactNode = (
            // @ts-ignore
            <Button className='editNoteFormButton' type='primary' htmlType='button' disabled={ loading }
                    onClick={ this.onEditNote } block>
                { t('form.editNote.button') }
            </Button>
        );

        return (
            <Form className='editNoteForm'>
                <Form.Item className='editNoteFormItem' label={ t('input.noteName.label') }>
                    { nameInput }
                </Form.Item>
                <Form.Item className='editNoteFormItem' label={ t('input.noteDescription.label') }>
                    { descriptionInput }
                </Form.Item>
                <Form.Item className='editNoteFormItem' label={ t('input.noteTag.label') }>
                    { tagSelect }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedEditNoteForm = Form.create<ExtendedEditNoteFormProps>()(EditNoteForm);

const EditNoteFormWithTranslation = withTranslation()(WrappedEditNoteForm);

export { EditNoteFormWithTranslation as EditNoteForm };
