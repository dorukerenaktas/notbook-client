import { Avatar, message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { CommentService, Status, UserService } from '../../../../service';
import { CommentType, Note, Post } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import { CreateCommentForm } from './CreateCommentForm';
import './CreateCommentModal.css';

export type CreateCommentModalProps = {
    header: ReactNode,
    parent: Post | Note,
    type: CommentType,
    onSuccess: (id: number, content: string) => void
}

type ExtendedCreateCommentModalProps = CreateCommentModalProps & WithTranslation;

interface CreateCommentModalState {
    loading: boolean
}

class CreateCommentModal extends Component<ExtendedCreateCommentModalProps, CreateCommentModalState> {

    constructor(props: ExtendedCreateCommentModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onCreateComment = this.onCreateComment.bind(this);
    }

    onCreateComment(content: string): void {
        const { t, parent: { id }, type } = this.props;
        CommentService.create({ parentId: id, type, content })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                message.success(t('response.createComment.success'));
                this.props.onSuccess(response.commentId, content);
                (this.refs.modal as BaseModal).close(true);
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.UNKNOWN:
                        message.error(t('response.common.unknown'));
                        break;
                }

            })
            .onEnd(() => {
                this.setState({ loading: false });
            }).exec();
    }

    render(): ReactNode {
        const { header } = this.props;
        const { loading } = this.state;
        const { user, updated } = this.global;

        return (
            <BaseModal ref='modal' className='createCommentModal' loading={ loading }>
                <div className='createCommentModalContent'>
                    <ModalHeader header={ header }/>
                    <div className='createCommentModalHeader'>
                        <Avatar icon='user' src={ UserService.getImageUrl({ userId: user.id, updated }) }/>
                        <span className='createCommentModalName'>{ user.firstName + ' ' + user.lastName }</span>
                    </div>
                    <CreateCommentForm loading={ loading } onSubmit={ this.onCreateComment }/>
                </div>
            </BaseModal>
        );
    }
}

const CreateCommentModalWithTranslation = withTranslation()(CreateCommentModal);

export { CreateCommentModalWithTranslation as CreateCommentModal };
