import { Divider, Icon } from 'antd';
import { ReactNode } from 'react';
import React, { Component } from 'reactn';
import './ModalHeader.css';

type ModalHeaderProps = {
    header: ReactNode
}

interface ModalHeaderState {
}

class ModalHeader extends Component<ModalHeaderProps, ModalHeaderState> {

    render(): ReactNode {
        const { header } = this.props;

        let divider = <span/>;

        if (header) {
            divider = (
                <Divider><Icon type='down' className='modalHeaderDividerIcon'/></Divider>
            );
        }

        return (
            <div className='modalHeader'>
                { header }
                { divider }
            </div>
        );
    }
}

export { ModalHeader };
