import { Col, Row } from 'antd';
import { ReactElement, ReactNode } from 'react';
import React, { Component } from 'reactn';
import { SimpleLecture } from '../../../../type';
import './AutoCompleteLectureItem.css';

type AutoCompleteLectureItemProps = {
    query: string,
    lecture: SimpleLecture,
    highlight: (source: string, keyword: string) => ReactElement | string
};

type AutoCompleteLectureItemState = {};

class AutoCompleteLectureItem extends Component<AutoCompleteLectureItemProps, AutoCompleteLectureItemState> {

    render(): ReactNode {
        const { query, lecture, highlight } = this.props;

        return (
            <Row type='flex' align='middle'>
                <Col className='autoCompleteLectureContainer'>
                    <Row>
                        { highlight(lecture.name, query) }
                    </Row>
                    <Row type='flex' align='middle'>
                        <Col className='autoCompleteLectureUniversityAbbr'>
                            { highlight(lecture.university.abbr, query) }
                        </Col>
                        <Col className='autoCompleteLectureLectureCode'>
                            { highlight(lecture.code, query) }
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export { AutoCompleteLectureItem };
