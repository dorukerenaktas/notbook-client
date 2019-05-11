import { Icon, message, Tag } from 'antd';
import { CSSProperties, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { CommentService, NoteService, SessionService, Status } from '../../../../service';
import { Comment, CommentType, Note, NoteTag } from '../../../../type';
import {
    CreateCommentModal,
    CreateCommentModalProps,
    EditNoteModal,
    EditNoteModalProps,
    ModalPortal,
    RateNoteModal,
    RateNoteModalProps,
    ReportNoteModal,
    ReportNoteModalProps
} from '../../modal';
import { RouteLink, Routes } from '../../route';

import {
    ListItemActionComment,
    ListItemActionFav,
    ListItemActionMore,
    ListItemActionMoreItem,
    ListItemActionRate,
    ListItemActionReply,
    ListItemActions,
    ListItemContent,
    ListItemHeader
} from './common';
import { ListItemComments } from './ListItemComments';
import './NoteListItem.css';

type NoteListItemProps = {
    data: Note,
    parentUniversity?: boolean
}

type ExtendedNoteListItemProps = NoteListItemProps & WithTranslation;

interface NoteListItemState {
    loading: { fav: boolean, comment: boolean }
    note: Note,
    open: boolean,
    comments: Comment[],
    commentedCount: number
    deleted: boolean
}

class NoteListItem extends Component<ExtendedNoteListItemProps, NoteListItemState> {

    constructor(props: ExtendedNoteListItemProps) {
        super(props);

        this.state = {
            loading: { fav: false, comment: false },
            note: props.data,
            open: false,
            comments: [],
            commentedCount: 0,
            deleted: false
        };

        this.onFav = this.onFav.bind(this);
        this.onReply = this.onReply.bind(this);
        this.onRate = this.onRate.bind(this);
        this.onComment = this.onComment.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onReport = this.onReport.bind(this);
    }

    onFav(): void {
        const { t } = this.props;
        const { loading, note } = this.state;
        const { id, isFav, favCount } = note;

        if (loading.fav) {
            return;
        }

        if (isFav) {
            NoteService.unFav({ noteId: id })
                .onStart(() => {
                    this.setState({ loading: { ...loading, fav: true } });
                })
                .onSuccess(() => {
                    this.saveNoteCount(false);
                    this.setState({ note: { ...note, isFav: false, favCount: favCount - 1 } });
                })
                .onFailure((status) => {
                    switch (status) {
                        case Status.UNKNOWN:
                            message.error(t('response.common.unknown'));
                            break;
                    }
                })
                .onEnd(() => {
                    this.setState({ loading: { ...loading, fav: false } });
                }).exec();
        } else {
            NoteService.fav({ noteId: id })
                .onStart(() => {
                    this.setState({ loading: { ...loading, fav: true } });
                })
                .onSuccess(() => {
                    this.saveNoteCount(true);
                    this.setState({ note: { ...note, isFav: true, favCount: favCount + 1 } });
                })
                .onFailure((status) => {
                    switch (status) {
                        case Status.UNKNOWN:
                            message.error(t('response.common.unknown'));
                            break;
                    }
                })
                .onEnd(() => {
                    this.setState({ loading: { ...loading, fav: false } });
                }).exec();
        }
    }

    onReply(): void {
        const { note } = this.state;

        ModalPortal.open<CreateCommentModalProps>(CreateCommentModal,
            { header: this.render(true), parent: note, type: CommentType.Note, onSuccess: this.onCommentAdded });
    }

    onRate(): void {
        const self = this;
        const { note } = self.state;

        function onRateSuccess(rate: number): void {
            self.setState({ note: { ...note, rate } });
        }

        ModalPortal.open<RateNoteModalProps>(RateNoteModal, { parent: note, onSuccess: onRateSuccess });
    }

    onComment(): void {
        const { t } = this.props;
        const { open, loading, note: { id } } = this.state;

        if (open) {
            this.setState({ open: false, loading: { ...loading, comment: false } });
        } else {
            CommentService.getAll({ parentId: id, type: CommentType.Note })
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
        const { note } = self.state;

        function onEditSuccess(name: string, description: string, tag: NoteTag): void {
            self.setState({ note: { ...note, name, description, tag, isEdited: true } });
        }

        ModalPortal.open<EditNoteModalProps>(EditNoteModal,
            { header: this.render(true), note, onSuccess: onEditSuccess });
    }

    onReport(): void {
        const { note } = this.state;

        ModalPortal.open<ReportNoteModalProps>(ReportNoteModal,
            { header: this.render(true), note });
    }

    saveNoteCount = (increased: boolean) => {
        let user = this.global.user;

        user.favNoteCount = user.favNoteCount + ((increased) ? 1 : -1);
        this.setGlobal({ user });
        SessionService.saveUser(user);
    };

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
            let note = this.state.note;
            note.commentCount += 1;

            this.setState({ note, comments });
        }
    };

    onCommentRemoved = (): void => {
        // Decrease comment count
        let note = this.state.note;
        note.commentCount -= 1;

        this.setState({ note });
    };

    render(withoutActions?: boolean): ReactNode {
        const { t, parentUniversity } = this.props;
        const { comments, open, loading, commentedCount, note, deleted } = this.state;
        const { id, name, description, tag, rate, isFav, isEdited, commentCount, favCount, fileExtension, createdBy, createdAt, lecture } = note;

        const { Title, Subtitle, Time, Rate } = ListItemHeader;

        let subtitle = (
            <RouteLink to={ Routes.Lecture } id={ lecture.id } block>
                <Subtitle value={ lecture.name }/>
            </RouteLink>
        );

        if (parentUniversity) {
            subtitle = (
                <RouteLink to={ Routes.University } id={ lecture.university.id } block>
                    <Subtitle value={ lecture.university.name }/>
                </RouteLink>
            );
        }

        let headerSection = (
            <ListItemHeader time={ createdAt }>
                <a className='link' href={ NoteService.getDocumentUrl({ noteId: id }) } download>
                    <Title value={ name }/>
                </a>
                { subtitle }
                <Rate value={ rate }/>
                <Time value={ createdBy.firstName + ' ' + createdBy.lastName } time={ createdAt }/>
            </ListItemHeader>
        );

        let contentSection = (
            <ListItemContent content={ description } edited={ isEdited }/>
        );

        const favAction: ListItemActionFav = { isFav, favCount, onClick: this.onFav, loading: loading.fav };

        const commentAction: ListItemActionComment = {
            commentedCount: commentedCount,
            commentCount: commentCount,
            onClick: this.onComment
        };

        const replyAction: ListItemActionReply = { onClick: this.onReply };

        const rateAction: ListItemActionRate = { onClick: this.onRate };

        const moreActionItems: ListItemActionMoreItem[] = [];

        const user = SessionService.getUser();

        if (user && user.id === createdBy.id) {
            const moreActionItemEdit: ListItemActionMoreItem = {
                icon: 'edit',
                value: t('listItem.action.edit'),
                onClick: this.onEdit
            };
            moreActionItems.push(moreActionItemEdit);

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
            <ListItemActions fav={ favAction } comment={ commentAction } reply={ replyAction }
                             rate={ rateAction } more={ moreAction }/>
        );

        let commentList: ReactNode = (
            <ListItemComments parent={ note } type={ CommentType.Note } open={ open }
                              comments={ comments } loading={ loading.comment }
                              onReply={ this.onCommentAdded } onDelete={ this.onCommentRemoved }/>
        );

        let style: CSSProperties = { padding: '12px 0 12px 6px' };

        if (withoutActions) {
            style = {};
            headerSection = (
                <ListItemHeader time={ createdAt }>
                    <Title value={ note.name }/>
                    <Subtitle value={ lecture.name }/>
                    <Rate value={ rate }/>
                    <Time value={ createdBy.firstName + ' ' + createdBy.lastName } time={ createdAt }/>
                </ListItemHeader>
            );
            actionsSection = <span/>;
            commentList = <span/>;
        }

        if (deleted) {
            style = { display: 'none' };
        }

        let tagValue = '';
        switch (tag) {
            case NoteTag.Notebook:
                tagValue = t('tag.notebook');
                break;
            case NoteTag.Slide:
                tagValue = t('tag.slide');
                break;
            case NoteTag.Lab:
                tagValue = t('tag.lab');
                break;
            case NoteTag.Homework:
                tagValue = t('tag.homework');
                break;
            case NoteTag.Project:
                tagValue = t('tag.project');
                break;
            case NoteTag.Quiz:
                tagValue = t('tag.quiz');
                break;
            case NoteTag.Midterm:
                tagValue = t('tag.midterm');
                break;
            case NoteTag.Final:
                tagValue = t('tag.final');
                break;
        }

        return (
            <div style={ style }>
                <div className='noteListItem'>
                    <div className='noteListItemSide'>
                        <Icon className='noteListItemIcon' type='file'/>
                    </div>
                    <div className='noteListItemBody'>
                        { headerSection }
                        { contentSection }
                        <Tag color='blue'>{ tagValue }</Tag>
                        <Tag color='blue'>{ fileExtension.replace('.', '').toUpperCase() }</Tag>
                        { actionsSection }
                    </div>
                </div>
                { commentList }
            </div>
        );
    }
}

const NoteListItemWithTranslation = withTranslation()(NoteListItem);

export { NoteListItemWithTranslation as NoteListItem };
