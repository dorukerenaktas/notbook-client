import { Button, message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { PostService, Status } from '../../../../service';
import { Post } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import './DeletePostModal.css';

export type DeletePostModalProps = {
    header: ReactNode,
    parent: Post,
    onSuccess: () => void
}

type ExtendedDeletePostModalProps = DeletePostModalProps & WithTranslation;

interface DeletePostModalState {
    loading: boolean
}

class DeletePostModal extends Component<ExtendedDeletePostModalProps, DeletePostModalState> {

    constructor(props: ExtendedDeletePostModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onDeletePost = this.onDeletePost.bind(this);
    }

    onDeletePost(): void {
        const { t, parent: { id } } = this.props;
        PostService.remove({ postId: id })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.deletePost.success'));
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

        const submit: ReactNode = (
            // @ts-ignore
            <Button className='deletePostModalButton' type='danger' htmlType='submit' onClick={ this.onDeletePost }
                    disabled={ loading } block>
                { t('modal.deletePost.button') }
            </Button>
        );

        return (
            <BaseModal ref='modal' className='deletePostModal' loading={ loading }>
                <div className='deletePostModalContent'>
                    <ModalHeader header={ header }/>
                    <div className='deletePostModalDescription'>
                        <span>{ t('modal.deletePost.description') }</span>
                    </div>
                    { submit }
                </div>
            </BaseModal>
        );
    }
}

const DeletePostModalWithTranslation = withTranslation()(DeletePostModal);

export { DeletePostModalWithTranslation as DeletePostModal };
