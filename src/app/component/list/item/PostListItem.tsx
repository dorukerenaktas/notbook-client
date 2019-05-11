import { Avatar, message } from 'antd';
import { CSSProperties, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { CommentService, PostService, SessionService, Status, UserService } from '../../../../service';
import { Comment, CommentType, Post, PostType } from '../../../../type';
import {
    CreateCommentModal,
    CreateCommentModalProps,
    DeletePostModal,
    DeletePostModalProps,
    EditPostModal,
    EditPostModalProps,
    ModalPortal,
    ReportPostModal,
    ReportPostModalProps
} from '../../modal';
import {
    ListItemActionComment,
    ListItemActionLike,
    ListItemActionMore,
    ListItemActionMoreItem,
    ListItemActionReply,
    ListItemActions,
    ListItemContent,
    ListItemHeader
} from './common';
import { ListItemComments } from './ListItemComments';
import './PostListItem.css';

type PostListItemProps = {
    data: Post,
    type: PostType,
    onDelete: () => void
}

type ExtendedPostListItemProps = PostListItemProps & WithTranslation;

interface PostListItemState {
    loading: { like: boolean, comment: boolean }
    post: Post,
    open: boolean,
    comments: Comment[],
    commentedCount: number
    deleted: boolean
}

class PostListItem extends Component<ExtendedPostListItemProps, PostListItemState> {

    constructor(props: ExtendedPostListItemProps) {
        super(props);

        this.state = {
            loading: { like: false, comment: false },
            post: props.data,
            open: false,
            comments: [],
            commentedCount: 0,
            deleted: false
        };

        this.onLike = this.onLike.bind(this);
        this.onReply = this.onReply.bind(this);
        this.onComment = this.onComment.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onReport = this.onReport.bind(this);
    }

    onLike(): void {
        const { t } = this.props;
        const { loading, post } = this.state;
        const { id, isLiked, likeCount } = post;

        if (loading.like) {
            return;
        }

        if (isLiked) {
            PostService.unlike({ postId: id })
                .onStart(() => {
                    this.setState({ loading: { ...loading, like: true } });
                })
                .onSuccess(() => {
                    this.setState({ post: { ...post, isLiked: false, likeCount: likeCount - 1 } });
                })
                .onFailure((status) => {
                    switch (status) {
                        case Status.UNKNOWN:
                            message.error(t('response.common.unknown'));
                            break;
                    }
                })
                .onEnd(() => {
                    this.setState({ loading: { ...loading, like: false } });
                }).exec();
        } else {
            PostService.like({ postId: id })
                .onStart(() => {
                    this.setState({ loading: { ...loading, like: true } });
                })
                .onSuccess(() => {
                    this.setState({ post: { ...post, isLiked: true, likeCount: likeCount + 1 } });
                })
                .onFailure((status) => {
                    switch (status) {
                        case Status.UNKNOWN:
                            message.error(t('response.common.unknown'));
                            break;
                    }
                })
                .onEnd(() => {
                    this.setState({ loading: { ...loading, like: false } });
                }).exec();
        }
    }

    onReply(): void {
        const { post } = this.state;

        ModalPortal.open<CreateCommentModalProps>(CreateCommentModal,
            { header: this.render(true), parent: post, type: CommentType.Post, onSuccess: this.onCommentAdded });
    }

    onComment(): void {
        const { t } = this.props;
        const { open, loading, post: { id } } = this.state;

        if (open) {
            this.setState({ open: false, loading: { ...loading, comment: false } });
        } else {
            CommentService.getAll({ parentId: id, type: CommentType.Post })
                .onStart(() => {
                    this.setState({ open: true, loading: { ...loading, comment: true } });
                })
                .onSuccess((response) => {
                    this.setState({ comments: response.comments });
                })
                .onFailure((status) => {
                    switch (status) {
                        case Status.UNKNOWN:
                            message.error(t('response.common.unknown'));
                            break;
                    }
                })
                .onEnd(() => {
                    this.setState({ loading: { ...loading, comment: false } });
                }).exec();
        }
    }

    onEdit(): void {
        const self = this;
        const { type } = this.props;
        const { post } = this.state;

        function onEditSuccess(editedContent: string): void {
            self.setState({ post: { ...post, content: editedContent, isEdited: true } });
        }

        ModalPortal.open<EditPostModalProps>(EditPostModal,
            { header: this.render(true), parent: post, type, onSuccess: onEditSuccess });
    }

    onDelete(): void {
        const self = this;
        const { post } = self.state;

        function onDeleteSuccess(): void {
            self.setState({ deleted: true });
            self.props.onDelete();
        }

        ModalPortal.open<DeletePostModalProps>(DeletePostModal,
            { header: this.render(true), parent: post, onSuccess: onDeleteSuccess });
    }

    onReport(): void {
        const { post } = this.state;
        ModalPortal.open<ReportPostModalProps>(ReportPostModal,
            { header: this.render(true), parent: post });
    }

    onCommentAdded = (id: number, content: string): void => {
        const user = SessionService.getUser();

        if (user) {
            let comment: Comment = {
                id: id,
                content: content,
                likeCount: 0,
                isLiked: false,
                isEdited: false,
                createdAt: new Date().toString(),
                createdBy: user
            };

            // Add comment to list
            let comments = this.state.comments;
            comments.push(comment);

            // Increase comment count
            let post = this.state.post;
            post.commentCount += 1;

            this.setState({ post, comments });
        }
    };

    onCommentRemoved = (): void => {
        // Decrease comment count
        let post = this.state.post;
        post.commentCount -= 1;

        this.setState({ post });
    };

    render(withoutActions?: boolean): ReactNode {
        const { t } = this.props;
        const { comments, open, loading, commentedCount, post, deleted } = this.state;
        const { content, isLiked, isEdited, commentCount, likeCount, createdBy, createdAt } = post;
        const { updated } = this.global;

        const { Title } = ListItemHeader;
        let headerSection: ReactNode = (
            <ListItemHeader time={ createdAt }>
                <Title value={ createdBy.firstName + ' ' + createdBy.lastName } time={ createdAt }/>
            </ListItemHeader>
        );

        let contentSection: ReactNode = (
            <ListItemContent content={ content } edited={ isEdited }/>
        );

        const likeAction: ListItemActionLike = { isLiked, likeCount, onClick: this.onLike, loading: loading.like };
        const commentAction: ListItemActionComment = {
            commentedCount: commentedCount,
            commentCount: commentCount,
            onClick: this.onComment
        };
        const replyAction: ListItemActionReply = { onClick: this.onReply };

        const moreActionItems: ListItemActionMoreItem[] = [];
        const user = SessionService.getUser();
        if (user && user.id === createdBy.id) {
            const moreActionItemEdit: ListItemActionMoreItem = {
                icon: 'edit',
                value: t('listItem.action.edit'),
                onClick: this.onEdit
            };
            moreActionItems.push(moreActionItemEdit);

            const moreActionItemDelete: ListItemActionMoreItem = {
                icon: 'delete',
                value: t('listItem.action.delete'),
                onClick: this.onDelete
            };
            moreActionItems.push(moreActionItemDelete);
        } else {
            const moreActionItemReport: ListItemActionMoreItem = {
                icon: 'exclamation',
                value: t('listItem.action.report'),
                onClick: this.onReport
            };
            moreActionItems.push(moreActionItemReport);
        }

        const moreAction: ListItemActionMore = { items: moreActionItems };

        let actionsSection: ReactNode = (
            <ListItemActions like={ likeAction } comment={ commentAction } reply={ replyAction } more={ moreAction }/>
        );

        let commentList: ReactNode = (
            <ListItemComments parent={ post } type={ CommentType.Post } open={ open }
                              comments={ comments } loading={ loading.comment }
                              onReply={ this.onCommentAdded } onDelete={ this.onCommentRemoved }/>
        );

        let style: CSSProperties = { padding: '12px 0 12px 0' };

        if (withoutActions) {
            style = {};
            actionsSection = <span/>;
            commentList = <span/>;
        }

        if (deleted) {
            style = { display: 'none' };
        }

        return (
            <div>
                <div className='postListItem' style={ style }>
                    <div className='postListItemSide'>
                        <Avatar icon='user' src={ UserService.getImageUrl({ userId: createdBy.id, updated }) }/>
                    </div>
                    <div className='postListItemBody'>
                        { headerSection }
                        { contentSection }
                        { actionsSection }
                    </div>
                </div>
                { commentList }
            </div>
        );
    }
}

const PostListItemWithTranslation = withTranslation()(PostListItem);

export { PostListItemWithTranslation as PostListItem };
