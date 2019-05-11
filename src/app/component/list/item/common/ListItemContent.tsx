import { Row } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import './ListItemContent.css';

type ListItemContentProps = {
    content: string,
    edited: boolean
}

type ExtendedListItemContentProps = ListItemContentProps & WithTranslation;

interface ListItemContentState {
}

class ListItemContent extends Component<ExtendedListItemContentProps, ListItemContentState> {

    render(): ReactNode {
        const { t, content, edited } = this.props;

        let editedValue = '';
        if (edited) {
            editedValue = '(' + t('listItem.content.edited') + ')';
        }

        return (
            <Row className='listItemContent'>
                <span className='listItemContentText'>
                    { content }
                    <span className='listItemContentEdited'>{ editedValue }</span>
                </span>
            </Row>
        );
    }
}

const ListItemContentWithTranslation = withTranslation()(ListItemContent);

export { ListItemContentWithTranslation as ListItemContent };
