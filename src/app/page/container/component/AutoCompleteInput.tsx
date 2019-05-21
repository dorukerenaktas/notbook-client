import { AutoComplete, Button, Input, message } from 'antd';
import { DataSourceItemType } from 'antd/lib/auto-complete';
import { SelectValue } from 'antd/lib/select';
import { ReactElement, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import React, { Component } from 'reactn';
import { SearchService, Status } from '../../../../service';
import { SimpleLecture, University } from '../../../../type';
import { ModalPortal } from '../../../component/modal/common';
import { CreateLectureModal, CreateLectureModalProps } from '../../../component/modal/lecture';
import { loadRoute, Routes } from '../../../component/route';
import './AutoCompleteInput.css';
import { AutoCompleteLectureItem } from './AutoCompleteLectureItem';
import { AutoCompleteUniversityItem } from './AutoCompleteUniversityItem';

type AutoCompleteInputProps = {
    onSelected: () => void
};

type ExtendedAutoCompleteInputProps =
    AutoCompleteInputProps
    & WithTranslation
    & DispatchProp
    & RouteComponentProps<any>;

interface AutoCompleteInputState {
    query: string,
    selected: boolean,
    data: {
        universities: University[],
        lectures: SimpleLecture[]
    }
}

class AutoCompleteInput extends Component<ExtendedAutoCompleteInputProps, AutoCompleteInputState> {

    constructor(props: ExtendedAutoCompleteInputProps) {
        super(props);

        this.state = {
            query: '',
            selected: false,
            data: {
                universities: [],
                lectures: []
            }
        };

        this.onSearch = this.onSearch.bind(this);
        this.onSearchSelect = this.onSearchSelect.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this);
    }

    onSearch(value: string): void {
        const { t } = this.props;
        this.setState({ query: value });
        SearchService.get({ query: value })
            .onSuccess((response) => {
                this.setState({ data: { universities: response.universities, lectures: response.lectures } });
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.UNKNOWN:
                        message.error(t('response.search.unknown'));
                        break;
                }
            }).exec();
    }

    onSearchSelect(value: SelectValue, { props: { children: { props } } }: any): void {
        const { dispatch, history, onSelected } = this.props;
        this.setState({ query: value.toString(), selected: true });

        onSelected();
        if (props.lecture) {
            loadRoute(Routes.Lecture, props.lecture.id, dispatch, history);
        } else if (props.university) {
            loadRoute(Routes.University, props.university.id, dispatch, history);
        }
    }

    onSearchChange(value: SelectValue): void {
        this.setState({ query: value.toString() });
    }

    onSearchFocus(): void {
        if (this.state.selected) {
            this.setState({ query: '', selected: false });
        }
    }

    onCreateLecture = (): void => {
        const self = this;

        function onCreateLectureSuccess(id: number): void {
            self.props.history.push(Routes.Lecture + '/' + id);
        }

        ModalPortal.open<CreateLectureModalProps>(CreateLectureModal,
            { parent: this.global.user.university, onSuccess: onCreateLectureSuccess });
    };

    render(): ReactNode {
        const { t } = this.props;
        const Option = AutoComplete.Option;
        const OptGroup = AutoComplete.OptGroup;

        const { data, query } = this.state;

        const options: DataSourceItemType[] = [];

        let universities: null | ReactElement = null;
        if (data.universities.length > 0) {
            universities = (
                <OptGroup key={ 'university' } label={ t('component.autocomplete.university') }>
                    { data.universities.map(university => (
                        <Option key={ university.id } value={ university.name }>
                            <AutoCompleteUniversityItem query={ query } university={ university }
                                                        highlight={ highlight }/>
                        </Option>
                    )) }
                </OptGroup>
            );

            options.push(universities);
        }

        let lectures: null | ReactElement = null;
        if (data.lectures.length > 0) {
            lectures = (
                <OptGroup key={ 'lecture' } label={ t('component.autocomplete.lecture') }>
                    {
                        data.lectures.map(lecture => (
                            <Option key={ lecture.id } value={ lecture.name }>
                                <AutoCompleteLectureItem query={ query } lecture={ lecture } highlight={ highlight }/>
                            </Option>
                        ))
                    }
                </OptGroup>
            );

            options.push(lectures);
        }

        let extra: null | ReactElement = null;
        if (!universities && !lectures && query === '') {
            extra = (
                <Option className='certainCategorySearchDropdownEmpty'
                        style={ { cursor: 'default' } } key='all' disabled>
                    <span>{ t('component.autocomplete.empty') }</span>
                </Option>
            );

            options.push(extra);
        } else {
            extra = (
                <Option className='certainCategorySearchDropdownNotFind'
                        style={ { cursor: 'default' } } key='all' disabled>
                    <div>
                        <span>{ t('component.autocomplete.notFound') }</span>
                    </div>
                    <div>
                        <Button className='certainCategorySearchDropdownNotFindButton'
                                htmlType='submit' onClick={ this.onCreateLecture }>
                            { t('component.autocomplete.notFoundButton') }
                        </Button>
                    </div>
                </Option>
            );

            options.push(extra);
        }

        return (
            <AutoComplete className='certainCategorySearch' dropdownClassName='certainCategorySearchDropdown'
                          placeholder={ t('component.autocomplete.placeholder') } onSearch={ this.onSearch }
                          onSelect={ this.onSearchSelect } onChange={ this.onSearchChange } value={ this.state.query }
                          dataSource={ options } optionLabelProp='value'>
                <Input.Search onFocus={ this.onSearchFocus } />
            </AutoComplete>
        );
    }
}

export const highlight = (source: string, keyword: string): ReactElement | string => {
    let index = convertToLower(source).indexOf(convertToLower(keyword));
    if (index !== -1) {
        let start = source.slice(0, index);
        let actual = source.slice(index, index + keyword.length);
        let end = source.slice(index + keyword.length, source.length);

        return (
            <span style={ { fontSize: 14 } }>
                { start }
                <span style={ { fontWeight: 'bold', color: '#1890ff' } }>{ actual }</span>
                { end }
            </span>
        );
    } else {
        return source;
    }
};

const convertToLower = function (string: string): string {
    let letters: any = { 'İ': 'i', 'I': 'ı', 'Ş': 'ş', 'Ğ': 'ğ', 'Ü': 'ü', 'Ö': 'ö', 'Ç': 'ç' };
    string = string.replace(/([İIŞĞÜÇÖ])/g, function (letter): string {
        return letters[letter];
    });
    return string.toLowerCase();
};

const AutoCompleteInputWithTranslation = withTranslation()(AutoCompleteInput);

const AutoCompleteInputWithRouter = withRouter(AutoCompleteInputWithTranslation);

const ConnectedAutoCompleteInput = connect()(AutoCompleteInputWithRouter);

export { ConnectedAutoCompleteInput as AutoCompleteInput };
