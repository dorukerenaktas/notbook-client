import { Button, message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { CommentService, Status } from '../../../../service';
import { Comment } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import './DeleteCommentModal.css';

export type DeleteCommentModalProps = {
    header: ReactNode,
    comment: Comment,
    onSuccess: () => void
}

type ExtendedDeleteCommentModalProps = DeleteCommentModalProps & WithTranslation;

interface DeleteCommentModalState {
    loading: boolean
}

class DeleteCommentModal extends Component<ExtendedDeleteCommentModalProps, DeleteCommentModalState> {

    constructor(props: ExtendedDeleteCommentModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onDeleteComment = this.onDeleteComment.bind(this);
    }

    onDeleteComment(): void {
        const { t, comment: { id } } = this.props;
        CommentService.remove({ commentId: id })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.deleteComment.success'));
                this.props.onSuccess();
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
        const { t, header } = this.props;
        const { loading } = this.state;

        const submit = (
            // @ts-ignore
            <Button className='deleteCommentModalButton' type='danger' htmlType='submit'
                    onClick={ this.onDeleteComment }
                    disabled={ loading } block>
                { t('modal.deleteComment.button') }
            </Button>
        );

        return (
            <BaseModal ref='modal' className='deleteCommentModal' loading={ loading }>
                <div className='deleteCommentModalContent'>
                    <ModalHeader header={ header }/>
                    <div className='deleteCommentModalDescription'>
                        <span>{ t('modal.deleteComment.description') }</span>
                    </div>
                    { submit }
                </div>
            </BaseModal>
        );
    }
}

const DeleteCommentModalWithTranslation = withTranslation()(DeleteCommentModal);

export { DeleteCommentModalWithTranslation as DeleteCommentModal };
