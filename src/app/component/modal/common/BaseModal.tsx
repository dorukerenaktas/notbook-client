import { Button, Spin } from 'antd';
import { ReactElement, ReactNode } from 'react';
import React, { Component } from 'reactn';
import './BaseModal.css';
import { ModalHeader } from './ModalHeader';
import { ModalPortal } from './ModalPortal';

type BaseModalProps = {
    className?: string,
    header?: ReactElement,
    loading: boolean,
    progress?: number
}

interface BaseModalState {
    visible: boolean
}

class BaseModal extends Component<BaseModalProps, BaseModalState> {

    constructor(props: BaseModalProps) {
        super(props);

        this.state = ({
            visible: true
        });

        this.close = this.close.bind(this);
    }

    close(force?: boolean): void {
        if (!this.props.loading || force) {
            this.setState({ visible: false }, () => {
                setTimeout(() => {
                    ModalPortal.close();
                }, 400);
            });
        }
    }

    contentClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.stopPropagation();
    };

    render(): ReactNode {
        const { visible } = this.state;
        const { children, className, loading, progress, header } = this.props;

        let modalClassNames = 'baseModal',
            contentClassNames = 'baseModalContent';

        if (className) {
            contentClassNames += ' ' + className;
        }

        if (visible) {
            modalClassNames += ' fadeInBaseModal';
            contentClassNames += ' zoomInBaseModalContent';
        } else {
            modalClassNames += ' fadeOutBaseModal';
            contentClassNames += ' slideOutBaseModalContent ';
        }

        let modalHeader: ReactElement = <span/>;
        if (header) {
            modalHeader = (
                <ModalHeader header={ header }/>
            );
        }

        let loadingText = '';

        if (progress) {
            loadingText = progress + '%';
        }

        return (
            <div className={ modalClassNames } onClick={ () => this.close() }>
                <div className={ contentClassNames } onClick={ this.contentClick }>
                    <Spin spinning={ loading } tip={ loadingText }>
                        { modalHeader }
                        { children }
                    </Spin>
                </div>
                <Button className='baseModalCloseButton' size='large' htmlType='submit' shape='circle' icon='close'
                        disabled={ loading }/>
            </div>
        );
    }
}

export { BaseModal };
