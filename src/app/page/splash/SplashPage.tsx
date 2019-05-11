import { Spin } from 'antd';
import { ReactNode } from 'react';
import React, { Component } from 'reactn';
import './SplashPage.css';

type SplashPageProps = {}

interface SplashPageState {
}

class SplashPage extends Component<SplashPageProps, SplashPageState> {

    render(): ReactNode {
        return (
            <Spin spinning={ true }>
                <div className='splashPage'/>
            </Spin>
        );
    }
}

export { SplashPage };
