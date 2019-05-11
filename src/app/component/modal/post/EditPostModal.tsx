import { Avatar, message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { PostService, Status, UserService } from '../../../../service';
import { Post, PostType } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import { EditPostForm } from './EditPostForm';
import './EditPostModal.css';

export type EditPostModalProps = {
    header: ReactNode,
    parent: Post,
    type: PostType,
    onSuccess: (editedContent: string) => void
}

type ExtendedEditPostModalProps = EditPostModalProps & WithTranslation;

interface EditPostModalState {
    loading: boolean
}

class EditPostModal extends Component<ExtendedEditPostModalProps, EditPostModalState> {

    constructor(props: ExtendedEditPostModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onEditPost = this.onEditPost.bind(this);
    }

    onEditPost(content: string): void {
        const { t, parent: { id } } = this.props;
        PostService.update({ postId: id, content })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.updatePost.success'));
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
        const { header, parent, type } = this.props;
        const { loading } = this.state;
        const { user, updated } = this.global;

        return (
            <BaseModal ref='modal' className='editPostModal' loading={ loading }>
                <div className='editPostModalContent'>
                    <ModalHeader header={ header }/>
                    <div className='editPostModalHeader'>
                        <Avatar icon='user' src={ UserService.getImageUrl({ userId: user.id, updated }) }/>
                        <span className='editPostModalName'>{ user.firstName + ' ' + user.lastName }</span>
                    </div>
                    <EditPostForm parent={ parent } type={ type } loading={ loading } onSubmit={ this.onEditPost }/>
                </div>
            </BaseModal>
        );
    }
}

const EditPostModalWithTranslation = withTranslation()(EditPostModal);

export { EditPostModalWithTranslation as EditPostModal };
