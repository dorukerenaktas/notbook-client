import { Avatar, message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { CommentService, Status, UserService } from '../../../../service';
import { Comment } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import { EditCommentForm } from './EditCommentForm';
import './EditCommentModal.css';

export type EditCommentModalProps = {
    header: ReactNode,
    comment: Comment,
    onSuccess: (editedContent: string) => void
}

type ExtendedEditCommentModalProps = EditCommentModalProps & WithTranslation;

interface EditCommentModalState {
    loading: boolean
}

class EditCommentModal extends Component<ExtendedEditCommentModalProps, EditCommentModalState> {

    constructor(props: ExtendedEditCommentModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onEditComment = this.onEditComment.bind(this);
    }

    onEditComment(content: string): void {
        const { t, comment: { id } } = this.props;
        CommentService.update({ commentId: id, content })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.updateComment.success'));
                this.props.onSuccess(content);
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
        const { comment, header } = this.props;
        const { loading } = this.state;
        const { user, updated } = this.global;

        return (
            <BaseModal ref='modal' className='editCommentModal' loading={ loading }>
                <div className='editCommentModalContent'>
                    <ModalHeader header={ header }/>
                    <div className='editCommentModalHeader'>
                        <Avatar icon='user' src={ UserService.getImageUrl({ userId: user.id, updated }) }/>
                        <span className='editCommentModalName'>{ user.firstName + ' ' + user.lastName }</span>
                    </div>
                    <EditCommentForm comment={ comment } loading={ loading } onSubmit={ this.onEditComment }/>
                </div>
            </BaseModal>
        );
    }
}

const EditCommentModalWithTranslation = withTranslation()(EditCommentModal);

export { EditCommentModalWithTranslation as EditCommentModal };
