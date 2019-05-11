import { Avatar, Col, Row } from 'antd';
import { ReactElement, ReactNode } from 'react';
import React from 'reactn';
import { University } from '../../../../type';
import './AutoCompleteUniversityItem.css';

type AutoCompleteUniversityItemProps = {
    query: string,
    university: University,
    highlight: (source: string, keyword: string) => ReactElement | string
};

type AutoCompleteUniversityItemState = {};

class AutoCompleteUniversityItem extends React.Component<AutoCompleteUniversityItemProps, AutoCompleteUniversityItemState> {

    render(): ReactNode {
        const { query, university, highlight } = this.props;

        return (
            <Row type='flex' align='middle'>
                <Col>
                    <Avatar className='autoCompleteUniversityAvatar' src={ university.imageUrl }/>
                </Col>
                <Col>
                    <Row className='autoCompleteUniversityName'>
                        { highlight(university.name, query) }
                    </Row>
                    <Row className='autoCompleteUniversityAbbr'>
                        { highlight(university.abbr, query) }
                    </Row>
                </Col>
            </Row>
        );
    }
}

export { AutoCompleteUniversityItem };
