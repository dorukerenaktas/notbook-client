import { Button, ConfigProvider, Empty, List } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { PostService, SessionService, Status } from '../../../service';
import { Post, PostType, SimpleLecture, University } from '../../../type';
import { CreatePostModal, CreatePostModalProps, ModalPortal } from '../modal';
import { PostListItem } from './item';
import { ListError } from './ListError';
import './PostList.css';

type PostListProps = {
    parent: University | SimpleLecture,
    type: PostType,
    onPostAdded: () => void,
    onPostRemoved: () => void
}

type ExtendedPostListProps = PostListProps & WithTranslation;

interface PostListState {
    posts: Post[],
    loading: boolean,
    error: boolean
}

class PostList extends Component<ExtendedPostListProps, PostListState> {

    constructor(props: ExtendedPostListProps) {
        super(props);

        this.state = {
            posts: [],
            loading: false,
            error: false
        };

        this.loadItems = this.loadItems.bind(this);
        this.onCreatePost = this.onCreatePost.bind(this);
    }

    componentDidMount(): void {
        this.loadItems();
    }

    componentDidUpdate(prevProps: ExtendedPostListProps): void {
        if (prevProps.parent.id !== this.props.parent.id) {
            this.loadItems();
        }
    }

    loadItems(): void {
        const { parent: { id }, type } = this.props;
        PostService.getAll({ parentId: id, type })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess((response) => {
                this.setState({ posts: response.posts });
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.UNKNOWN:
                        this.setState({ error: true });
                        break;
                }
            })
            .onEnd(() => {
                this.setState({ loading: false });
            }).exec();
    }

    addPostToList = (id: number, content: string): void => {
        const { onPostAdded } = this.props;
        const user = SessionService.getUser();

        if (user) {
            let post: Post = {
                id: id,
                content: content,
                isLiked: false,
                likeCount: 0,
                commentCount: 0,
                isEdited: false,
                createdAt: new Date().toString(),
                createdBy: user
            };

            // Add post to list
            let posts = this.state.posts;
            posts.unshift(post);

            this.setState({ posts });
            onPostAdded();
        }
    };

    onCreatePost(): void {
        const { parent, type } = this.props;
        ModalPortal.open<CreatePostModalProps>(CreatePostModal, { parent, type, onSuccess: this.addPostToList });
    }

    render(): ReactNode {
        const { t, type, onPostRemoved } = this.props;
        const { posts, loading, error } = this.state;

        let empty = '';
        let addPost = '';

        switch (type) {
            case PostType.Announcement:
                addPost = t('list.post.addAnnouncement');
                empty = t('list.post.emptyAnnouncement');
                break;
            case PostType.Suggestion:
                addPost = t('list.post.addSuggestion');
                empty = t('list.post.emptySuggestion');
                break;
            case PostType.University:
                addPost = t('list.post.addUniversity');
                empty = t('list.post.emptyUniversity');
                break;
        }

        const renderEmpty = () => {
            if (error) {
                return (
                    <ListError message={ t('list.error.message') } button={ t('list.error.button') }
                               onClick={ this.loadItems }/>
                );
            } else {
                return (
                    <Empty description={ empty }/>
                );
            }
        };

        const renderItem = (data: Post): ReactNode => (
            <PostListItem data={ data } type={ type } onDelete={ onPostRemoved }/>
        );

        const header: ReactNode = (
            <div>
                <Button htmlType='submit' icon='plus' shape='circle' onClick={ this.onCreatePost }/>
                <span className='postListAddButtonText'>{ addPost }</span>
            </div>
        );

        return (
            <ConfigProvider renderEmpty={ renderEmpty }>
                <List className='postList' split={ false } header={ header } itemLayout='vertical'
                      dataSource={ posts } loading={ loading } rowKey={ (post: Post) => post.id }
                      renderItem={ renderItem }/>
            </ConfigProvider>
        );
    }
}

const PostListWithTranslation = withTranslation()(PostList);

export { PostListWithTranslation as PostList };
