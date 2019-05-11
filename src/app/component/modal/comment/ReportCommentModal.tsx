import { Button, message } from 'antd';
import { ReactNode } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { CommentService, Status } from '../../../../service';
import { Comment } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import './ReportCommentModal.css';

export type ReportCommentModalProps = {
    header: ReactNode,
    comment: Comment
}

type ExtendedReportCommentModalProps = ReportCommentModalProps & WithTranslation;

interface ReportCommentModalState {
    loading: boolean
}

class ReportCommentModal extends Component<ExtendedReportCommentModalProps, ReportCommentModalState> {

    constructor(props: ExtendedReportCommentModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onReportComment = this.onReportComment.bind(this);
    }

    onReportComment(): void {
        const { t, comment: { id } } = this.props;
        CommentService.report({ commentId: id })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.reportComment.success'));
                (this.refs.modal as BaseModal).close(true);
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.COMMENT_ALREADY_REPORTED:
                        message.error(t('response.reportComment.alreadyReported'));
                        break;
                    case Status.COMMENT_IS_VERIFIED:
                        message.error(t('response.reportComment.verified'));
                        break;
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
            <Button className='reportCommentModalButton' type='danger' htmlType='submit'
                    onClick={ this.onReportComment }
                    disabled={ loading } block>
                { t('modal.reportComment.button') }
            </Button>
        );

        return (
            <BaseModal ref='modal' className='reportCommentModal' loading={ loading }>
                <div className='reportCommentModalContent'>
                    <ModalHeader header={ header }/>
                    <div className='reportCommentModalDescription'>
                        <span>{ t('modal.reportComment.description') }</span>
                    </div>
                    { submit }
                </div>
            </BaseModal>
        );
    }
}

const ReportCommentModalWithTranslation = withTranslation()(ReportCommentModal);

export { ReportCommentModalWithTranslation as ReportCommentModal };
