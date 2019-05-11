import { Spin } from 'antd';
import { ReactElement, ReactNode } from 'react';
import React, { Component } from 'reactn';
import { CommentListItem } from '.';
import { Comment, CommentType, Note, Post } from '../../../../type';
import './ListItemComments.css';

type ListItemCommentsProps = {
    parent: Post | Note,
    type: CommentType,
    loading: boolean,
    open: boolean,
    comments: Comment[],
    onReply: (id: number, content: string) => void,
    onDelete: () => void
}

interface ListItemCommentsState {
}

class ListItemComments extends Component<ListItemCommentsProps, ListItemCommentsState> {

    render(): ReactNode {
        const { parent, type, loading, open, comments, onReply, onDelete } = this.props;

        let elements: ReactElement[] = [];
        for (let i = 0; i < comments.length; i++) {
            let comment = (
                <CommentListItem key={ i } parent={ parent } type={ type } data={ comments[i] }
                                 onReply={ onReply } onDelete={ onDelete }/>
            );
            elements.push(comment);
        }

        let style = { display: 'block' };

        if (!open) {
            style = { display: 'none' };
        }

        return (
            <div className='commentList' style={ style }>
                <Spin spinning={ loading }>
                    { elements }
                </Spin>
            </div>
        );
    }
}

export { ListItemComments };
