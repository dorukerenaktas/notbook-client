import { Avatar, message } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React from 'reactn';
import { PostService, Status, UserService } from '../../../../service';
import { PostType, SimpleLecture, University } from '../../../../type';
import { BaseModal } from '../common';
import { CreatePostForm } from './CreatePostForm';
import './CreatePostModal.css';

export type CreatePostModalProps = {
    parent: University | SimpleLecture,
    type: PostType,
    onSuccess: (id: number, content: string) => void
}

type ExtendedCreatePostModalProps = CreatePostModalProps & WithTranslation;

interface CreatePostModalState {
    loading: boolean
}

class CreatePostModal extends React.Component<ExtendedCreatePostModalProps, CreatePostModalState> {

    constructor(props: ExtendedCreatePostModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onCreatePost = this.onCreatePost.bind(this);
    }

    onCreatePost(content: string): void {
        const { t, parent: { id }, type } = this.props;
        PostService.create({ parentId: id, type, content })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                message.success(t('response.createPost.success'));
                this.props.onSuccess(response.postId, content);
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
        const { type } = this.props;
        const { loading } = this.state;
        const { user, updated } = this.global;

        return (
            <BaseModal ref='modal' className='createPostModal' loading={ loading }>
                <div className='createPostModalContent'>
                    <div className='createPostModalHeader'>
                        <Avatar icon='user' src={ UserService.getImageUrl({ userId: user.id, updated }) }/>
                        <span className='createPostModalName'>{ user.firstName + ' ' + user.lastName }</span>
                    </div>
                    <CreatePostForm type={ type } loading={ loading } onSubmit={ this.onCreatePost }/>
                </div>
            </BaseModal>
        );
    }
}

const CreatePostModalWithTranslation = withTranslation()(CreatePostModal);

export { CreatePostModalWithTranslation as CreatePostModal };
