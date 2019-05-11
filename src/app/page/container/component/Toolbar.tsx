import { Col, Row } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import LoadingBar from 'react-redux-loading-bar';
import React, { Component } from 'reactn';
import { AutoCompleteInput } from './AutoCompleteInput';
import './Toolbar.css';

type ToolbarProps = {
    onLogoClick: () => void
}

type ExtendedToolbarProps = ToolbarProps & WithTranslation;

interface ToolbarState {
}

class Toolbar extends Component<ExtendedToolbarProps, ToolbarState> {

    constructor(props: ExtendedToolbarProps) {
        super(props);
    }

    render(): ReactNode {
        const { t, onLogoClick } = this.props;

        return (
            <div className='toolbar'>
                <LoadingBar className='loadingBar' scope='main'/>
                <Row type='flex' justify='center'>
                    <Col span={ 7 } xs={ 24 } sm={ 24 } md={ 6 } lg={ 7 }>
                        <span className='logo' onClick={ onLogoClick }>{ t('appName') }</span>
                    </Col>
                    <Col span={ 10 } xs={ 24 } sm={ 24 } md={ 12 } lg={ 10 }>
                        <AutoCompleteInput/>
                    </Col>
                    <Col span={ 7 } xs={ 0 } sm={ 0 } md={ 6 } lg={ 7 }/>
                </Row>
            </div>
        );
    }
}

const ToolbarWithTranslation = withTranslation()(Toolbar);

export { ToolbarWithTranslation as Toolbar };
