import { Spin } from 'antd';
import { ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import './Page.css';

type PageProps = {
    loading?: boolean,
    error?: boolean,
    notFound?: boolean
}

type ExtendedPageProps = PageProps & WithTranslation;

interface PageState {
}

class Page extends Component<ExtendedPageProps, PageState> {

    render(): ReactNode {
        const { t, loading, error, notFound, children } = this.props;

        let spinning = loading;

        let content: ReactNode;
        if (error) {
            spinning = false;
            content = (
                <div className='pageError'>
                    <div className='pageErrorText'>
                        <span>{ '500' }</span>
                    </div>
                    <div className='pageErrorTitle'>
                        <span>{ t('page.common.error') }</span>
                    </div>
                    <div className='pageErrorDescription'>
                        <span>{ t('page.common.errorDescription') }</span>
                    </div>
                </div>
            );
        } else if (notFound) {
            spinning = false;
            content = (
                <div className='pageError'>
                    <div className='pageErrorText'>
                        <span>{ '400' }</span>
                    </div>
                    <div className='pageErrorTitle'>
                        <span>{ t('page.common.notFound') }</span>
                    </div>
                    <div className='pageErrorDescription'>
                        <span>{ t('page.common.notFoundDescription') }</span>
                    </div>
                </div>
            );
        } else {
            content = children;
        }

        return (
            <Spin className='page' spinning={ spinning }>
                { content }
            </Spin>
        );
    }
}

const PageWithTranslation = withTranslation()(Page);

export { PageWithTranslation as Page };
