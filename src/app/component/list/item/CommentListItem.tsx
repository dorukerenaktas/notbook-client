import { Avatar, message } from 'antd';
import { CSSProperties, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { CommentService, SessionService, Status, UserService } from '../../../../service';
import { Comment, CommentType, Note, Post } from '../../../../type';
import {
    CreateCommentModal,
    CreateCommentModalProps,
    DeleteCommentModal,
    DeleteCommentModalProps,
    EditCommentModal,
    EditCommentModalProps,
    ReportCommentModal,
    ReportCommentModalProps
} from '../../modal/comment';
import { ModalPortal } from '../../modal/common';
import './CommentListItem.css';
import {
    ListItemActionLike,
    ListItemActionMore,
    ListItemActionMoreItem,
    ListItemActionReply,
    ListItemActions,
    ListItemContent,
    ListItemHeader
} from './common';

type CommentListItemProps = {
    parent: Post | Note,
    type: CommentType,
    data: Comment,
    noIndent?: boolean,
    onReply: (id: number, content: string) => void,
    onDelete: () => void
}

type ExtendedCommentListItemProps = CommentListItemProps & WithTranslation;

interface CommentListItemState {
    loading: { like: boolean }
    comment: Comment,
    deleted: boolean
}

class CommentListItem extends Component<ExtendedCommentListItemProps, CommentListItemState> {

    constructor(props: ExtendedCommentListItemProps) {
        super(props);

        this.state = {
            loading: { like: false },
            comment: props.data,
            deleted: false
        };

        this.onLike = this.onLike.bind(this);
        this.onReply = this.onReply.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onReport = this.onReport.bind(this);
    }

    onLike(): void {
        const { t } = this.props;
        const { loading, comment } = this.state;
        const { id, isLiked, likeCount } = comment;

        if (loading.like) {
            return;
        }

        if (isLiked) {
            CommentService.unlike({ commentId: id })
                .onStart(() => {
                    this.setState({ loading: { ...loading, like: true } });
                })
                .onSuccess(() => {
                    this.setState({ comment: { ...comment, isLiked: false, likeCount: likeCount - 1 } });
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
            CommentService.like({ commentId: id })
                .onStart(() => {
                    this.setState({ loading: { ...loading, like: true } });
                })
                .onSuccess(() => {
                    this.setState({ comment: { ...comment, isLiked: true, likeCount: likeCount + 1 } });
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
        const { parent, type, onReply } = this.props;
        ModalPortal.open<CreateCommentModalProps>(CreateCommentModal,
            { header: this.render(true), parent, type, onSuccess: onReply });
    }

    onEdit(): void {
        const self = this;
        const { comment } = self.state;

        function onEditSuccess(editedContent: string): void {
            self.setState({ comment: { ...comment, content: editedContent, isEdited: true } });
        }

        ModalPortal.open<EditCommentModalProps>(EditCommentModal,
            { header: this.render(true), comment, onSuccess: onEditSuccess });
    }

    onDelete(): void {
        const self = this;
        const { onDelete } = self.props;
        const { comment } = self.state;

        function onDeleteSuccess(): void {
            self.setState({ deleted: true });
            onDelete();
        }

        ModalPortal.open<DeleteCommentModalProps>(DeleteCommentModal,
            { header: this.render(true), comment, onSuccess: onDeleteSuccess });
    }

    onReport(): void {
        const { comment } = this.state;
        ModalPortal.open<ReportCommentModalProps>(ReportCommentModal,
            { header: this.render(true), comment });
    }

    render(withoutActions?: boolean): ReactNode {
        const { t, noIndent } = this.props;
        const { loading, comment: { content, isLiked, isEdited, likeCount, createdBy: { id, firstName, lastName }, createdAt }, deleted } = this.state;
        const { updated } = this.global;

        const { Title } = ListItemHeader;
        let headerSection = (
            <ListItemHeader time={ createdAt }>
                <Title value={ firstName + ' ' + lastName } time={ createdAt }/>
            </ListItemHeader>
        );

        let contentSection = (
            <ListItemContent content={ content } edited={ isEdited }/>
        );

        const likeAction: ListItemActionLike = { isLiked, likeCount, onClick: this.onLike, loading: loading.like };
        const replyAction: ListItemActionReply = { onClick: this.onReply };

        const moreActionItems: ListItemActionMoreItem[] = [];
        const user = SessionService.getUser();
        if (user && user.id === id) {
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

        let actionsSection = (
            <ListItemActions like={ likeAction } reply={ replyAction } more={ moreAction }/>
        );

        let style: CSSProperties = { padding: '12px 0 12px 36px' };

        if (withoutActions) {
            style = {};
            actionsSection = <span/>;
        }

        if (noIndent) {
            style = { padding: '12px 0 12px 0' };
        }

        if (deleted) {
            style = { display: 'none' };
        }

        return (
            <div className='commentListItem' style={ style }>
                <div className='commentListItemSide'>
                    <Avatar icon='user' src={ UserService.getImageUrl({ userId: id, updated }) }/>
                </div>
                <div className='commentListItemBody'>
                    { headerSection }
                    { contentSection }
                    { actionsSection }
                </div>
            </div>
        );
    }
}

const CommentListItemWithTranslation = withTranslation()(CommentListItem);

export { CommentListItemWithTranslation as CommentListItem };
