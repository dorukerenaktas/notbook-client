import { Button, ConfigProvider, Empty, List } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { LectureService, SessionService, Status } from '../../../service';
import { SimpleLecture, University } from '../../../type';
import { CreateLectureModal, CreateLectureModalProps, ModalPortal } from '../modal';
import { LectureListItem } from './item';
import './LectureList.css';
import { ListError } from './ListError';

type LectureListProps = {
    parent: University,
    onLectureAdded: () => void,
    onLectureRemoved: () => void,
}

type ExtendedLectureListProps = LectureListProps & WithTranslation;

interface LectureListState {
    lectures: SimpleLecture[],
    loading: boolean,
    error: boolean
}

class LectureList extends Component<ExtendedLectureListProps, LectureListState> {

    constructor(props: ExtendedLectureListProps) {
        super(props);

        this.state = {
            lectures: [],
            loading: false,
            error: false
        };

        this.loadItems = this.loadItems.bind(this);
        this.onCreateLecture = this.onCreateLecture.bind(this);
    }

    componentDidMount(): void {
        this.loadItems();
    }

    componentDidUpdate(prevProps: ExtendedLectureListProps): void {
        if (prevProps.parent.id !== this.props.parent.id) {
            this.loadItems();
        }
    }

    loadItems(): void {
        const { parent: { id } } = this.props;
        LectureService.getAll({ universityId: id })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                this.setState({ lectures: response.data, error: false });
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.UNKNOWN:
                        this.setState({ error: true });
                        break;
                }
            })
            .onEnd(() => {
                this.setState({ loading: false });
            }).exec();
    }

    addLectureToList = (id: number, code: string, name: string): void => {
        const { parent, onLectureAdded } = this.props;

        const user = SessionService.getUser();

        if (user) {
            let lecture: SimpleLecture = {
                id,
                code,
                name,
                university: parent
            };

            // Add lecture to list
            let lectures = this.state.lectures;
            lectures.unshift(lecture);

            this.setState({ lectures });
            onLectureAdded();
        }
    };

    onCreateLecture(): void {
        const { parent } = this.props;
        ModalPortal.open<CreateLectureModalProps>(CreateLectureModal, { parent, onSuccess: this.addLectureToList });
    }

    render(): ReactNode {
        const { t } = this.props;
        const { lectures, loading, error } = this.state;

        const renderEmpty = () => {
            if (error) {
                return (
                    <ListError message={ t('list.error.message') } button={ t('list.error.button') }
                               onClick={ this.loadItems }/>
                );
            } else {
                return (
                    <Empty description={ t('list.lecture.empty') }/>
                );
            }
        };

        const renderItem = (data: SimpleLecture) => (
            <LectureListItem data={ data }/>
        );

        const header = (
            <div>
                <Button htmlType='submit' icon='plus' shape='circle' onClick={ this.onCreateLecture }/>
                <span className='lectureListAddButtonText'>{ t('list.lecture.add') }</span>
            </div>
        );

        return (
            <ConfigProvider renderEmpty={ renderEmpty }>
                <List className='lectureList' split={ false } header={ header } itemLayout='vertical'
                      dataSource={ lectures } loading={ loading } rowKey={ (lecture: SimpleLecture) => lecture.id }
                      renderItem={ renderItem }/>
            </ConfigProvider>
        );
    }
}

const LectureListWithTranslation = withTranslation()(LectureList);

export { LectureListWithTranslation as LectureList };
