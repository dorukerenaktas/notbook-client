import { Button, Icon } from 'antd';
import { ReactNode } from 'react';
import React, { Component } from 'reactn';
import './ListError.css';

type ListErrorProps = {
    message: string,
    button: string,
    onClick: () => void
}

interface ListErrorState {

}

class ListError extends Component<ListErrorProps, ListErrorState> {

    render(): ReactNode {
        const { message, button, onClick } = this.props;
        return (
            <div className='listError'>
                <div className='listErrorRow'>
                    <Icon className='listErrorIcon' type='warning' theme='filled'/>
                </div>
                <div className='listErrorRow'>
                    <span>{ message }</span>
                </div>
                <div className='listErrorRow'>
                    <Button type='danger' onClick={ onClick } ghost>{ button }</Button>
                </div>
            </div>
        );
    }
}

export { ListError };
