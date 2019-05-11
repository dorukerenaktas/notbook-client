import React, { Component } from 'reactn';
import { SimpleLecture } from '../../../../type';
import { RouteLink, Routes } from '../../route';
import './LectureListItem.css';

type LectureListItemProps = {
    data: SimpleLecture
};

interface LectureListItemState {
}

class LectureListItem extends Component<LectureListItemProps, LectureListItemState> {

    render(): React.ReactNode {
        const { data: { id, code, name, university } } = this.props;

        return (
            <div className='lectureListItem'>
                <RouteLink to={ Routes.Lecture } id={ id }>
                    <div>
                        <span className='lectureListItemCode'>{ code }</span>
                        <span className='lectureListItemName'>{ name }</span>
                    </div>
                    <div>
                        <span className='lectureListItemUniversityName'>{ university.name }</span>
                    </div>
                </RouteLink>
            </div>
        );
    }

}

export { LectureListItem };
