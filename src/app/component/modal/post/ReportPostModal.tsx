import { Button, message } from 'antd';
import { ReactNode } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import { PostService, Status } from '../../../../service';
import { Post } from '../../../../type';
import { BaseModal, ModalHeader } from '../common';
import './ReportPostModal.css';

export type ReportPostModalProps = {
    header: ReactNode,
    parent: Post
}

type ExtendedReportPostModalProps = ReportPostModalProps & WithTranslation;

interface ReportPostModalState {
    loading: boolean
}

class ReportPostModal extends Component<ExtendedReportPostModalProps, ReportPostModalState> {

    constructor(props: ExtendedReportPostModalProps) {
        super(props);

        this.state = {
            loading: false
        };

        this.onReportPost = this.onReportPost.bind(this);
    }

    onReportPost(): void {
        const { t, parent: { id } } = this.props;
        PostService.report({ postId: id })
            .onStart(() => {
                this.setState({ loading: true });
            })
            .onSuccess(() => {
                message.success(t('response.reportPost.success'));
                (this.refs.modal as BaseModal).close(true);
            })
            .onFailure((status) => {
                switch (status) {
                    case Status.POST_ALREADY_REPORTED:
                        message.error(t('response.reportPost.alreadyReported'));
                        break;
                    case Status.POST_IS_VERIFIED:
                        message.error(t('response.reportPost.verified'));
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
            <Button className='reportPostModalButton' type='danger' htmlType='submit' onClick={ this.onReportPost }
                    disabled={ loading } block>
                { t('modal.reportPost.button') }
            </Button>
        );

        return (
            <BaseModal ref='modal' className='reportPostModal' loading={ loading }>
                <div className='reportPostModalContent'>
                    <ModalHeader header={ header }/>
                    <div className='reportPostModalDescription'>
                        <span>{ t('modal.reportPost.description') }</span>
                    </div>
                    { submit }
                </div>
            </BaseModal>
        );
    }
}

const ReportPostModalWithTranslation = withTranslation()(ReportPostModal);

export { ReportPostModalWithTranslation as ReportPostModal };
