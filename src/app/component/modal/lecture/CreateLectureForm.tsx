import { Button, Form, Input } from 'antd';
import { ValidateCallback, WrappedFormInternalProps } from 'antd/lib/form/Form';
import { ChangeEvent, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { University } from '../../../../type';
import './CreateLectureForm.css';

type CreateLectureFormProps = {
    parent: University,
    loading: boolean,
    onSubmit: (code: string, name: string) => void
}

type ExtendedCreateLectureFormProps = CreateLectureFormProps & WithTranslation & WrappedFormInternalProps;

interface CreateLectureFormState {
}

class CreateLectureForm extends Component<ExtendedCreateLectureFormProps, CreateLectureFormState> {

    constructor(props: ExtendedCreateLectureFormProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onRegister = this.onRegister.bind(this);
    }

    onRegister(): void {
        const callback: ValidateCallback<any> = (err: any, values: any): void => {
            if (!err) {
                const { code, name } = values;
                this.props.onSubmit(code, name);
            }
        };

        this.props.form.validateFields(callback);
    }

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

    capitalizeAll = (event: ChangeEvent<HTMLInputElement>): void => {
        let value = event.target.value;

        event.target.value = value.toUpperCase();
    };

    render(): ReactNode {
        const { t, parent: { name }, loading } = this.props;
        const { getFieldDecorator } = this.props.form;

        const universityInput: ReactNode = (
            <Input disabled type='text' value={ name }/>
        );

        const lectureCodeInput = getFieldDecorator('code', {
            rules: [
                { required: true, whitespace: true, message: t('input.lectureCode.required') },
                { pattern: /^[a-zA-ZığüşöçİĞÜŞÖÇ0-9\s]*$/, message: t('input.lectureCode.invalid') }]
        })(
            <Input type='text' placeholder={ t('input.lectureCode.placeholder') } onChange={ this.capitalizeAll }/>
        );

        const lectureNameInput = getFieldDecorator('name', {
            rules: [
                { required: true, whitespace: true, message: t('input.lectureName.required') },
                { pattern: /^[a-zA-ZığüşöçİĞÜŞÖÇ0-9\s]*$/, message: t('input.lectureName.invalid') }]
        })(
            <Input type='text' placeholder={ t('input.lectureName.placeholder') } onChange={ this.capitalize }/>
        );

        const submit: ReactNode = (
            // @ts-ignore
            <Button type='primary' htmlType='button' block disabled={ loading } onClick={ this.onRegister }>
                { t('form.createLecture.button') }
            </Button>
        );

        return (
            <Form className='createLectureForm'>
                <Form.Item label={ t('input.universityName.label') }>
                    { universityInput }
                </Form.Item>
                <Form.Item label={ t('input.lectureCode.label') }>
                    { lectureCodeInput }
                </Form.Item>
                <Form.Item label={ t('input.lectureName.label') }>
                    { lectureNameInput }
                </Form.Item>
                { submit }
            </Form>
        );
    }
}

const WrappedCreateLectureForm = Form.create<ExtendedCreateLectureFormProps>()(CreateLectureForm);

const CreateLectureFormWithTranslation = withTranslation()(WrappedCreateLectureForm);

export { CreateLectureFormWithTranslation as CreateLectureForm };
