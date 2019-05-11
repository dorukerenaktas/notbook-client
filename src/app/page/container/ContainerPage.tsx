import { ReactNode } from 'react';
import React, { Component } from 'reactn';
import { baseEmitter } from '../../../event';
import { SessionService } from '../../../service';
import { User } from '../../../type';
import { MenuDrawer, Toolbar } from './component';
import './ContainerPage.css';

const EVENT_CLEAR_SELECTED = 'EVENT_CLEAR_SELECTED';
const EVENT_SELECT_USER_UNIVERSITY = 'EVENT_SELECT_USER_UNIVERSITY';
const EVENT_SELECT_ATTENDED_LECTURES = 'EVENT_SELECT_ATTENDED_LECTURES';
const EVENT_SELECT_ADDED_LECTURES = 'EVENT_SELECT_ADDED_LECTURES';
const EVENT_SELECT_FAVORITE_NOTES = 'EVENT_SELECT_FAVORITE_NOTES';
const EVENT_SELECT_ADDED_NOTES = 'EVENT_SELECT_ADDED_NOTES';

interface ContainerPageProps {

}

interface ContainerPageState {
    user: User | null,
    drawerVisible: boolean,
    drawerSelectedKey: string,
    drawerOpenKey: string,
}

class ContainerPage extends Component<ContainerPageProps, ContainerPageState> {

    constructor(props: ContainerPageProps) {
        super(props);

        this.state = {
            user: SessionService.getUser(),
            drawerVisible: false,
            drawerSelectedKey: '',
            drawerOpenKey: ''
        };

        this.showDrawer = this.showDrawer.bind(this);
        this.hideDrawer = this.hideDrawer.bind(this);
        this.menuKeyListener = this.menuKeyListener.bind(this);
    }

    static menuClearSelection(): void {
        baseEmitter.emit(EVENT_CLEAR_SELECTED, { selectedKey: '', openKey: '' });
    }

    static menuSelectUserUniversity(): void {
        baseEmitter.emit(EVENT_SELECT_USER_UNIVERSITY, { selectedKey: 'userUniversity', openKey: 'university' });
    }

    static menuSelectAttendedLectures(): void {
        baseEmitter.emit(EVENT_SELECT_ATTENDED_LECTURES, { selectedKey: 'attendedLectures', openKey: 'lecture' });
    }

    static menuSelectAddedLectures(): void {
        baseEmitter.emit(EVENT_SELECT_ADDED_LECTURES, { selectedKey: 'addedLectures', openKey: 'lecture' });
    }

    static menuSelectFavoriteNotes(): void {
        baseEmitter.emit(EVENT_SELECT_FAVORITE_NOTES, { selectedKey: 'favoriteNotes', openKey: 'note' });
    }

    static menuSelectAddedNotes(): void {
        baseEmitter.emit(EVENT_SELECT_ADDED_NOTES, { selectedKey: 'addedNotes', openKey: 'note' });
    }

    menuKeyListener(data: { selectedKey: string, openKey: string }): void {
        this.setState({ drawerVisible: false, drawerSelectedKey: data.selectedKey, drawerOpenKey: data.openKey });
    }

    componentDidMount(): void {
        baseEmitter.on(EVENT_CLEAR_SELECTED, this.menuKeyListener);
        baseEmitter.on(EVENT_SELECT_USER_UNIVERSITY, this.menuKeyListener);
        baseEmitter.on(EVENT_SELECT_ATTENDED_LECTURES, this.menuKeyListener);
        baseEmitter.on(EVENT_SELECT_ADDED_LECTURES, this.menuKeyListener);
        baseEmitter.on(EVENT_SELECT_FAVORITE_NOTES, this.menuKeyListener);
        baseEmitter.on(EVENT_SELECT_ADDED_NOTES, this.menuKeyListener);
    }

    componentWillUnmount(): void {
        baseEmitter.on(EVENT_CLEAR_SELECTED, this.menuKeyListener);
        baseEmitter.removeEventListener(EVENT_SELECT_USER_UNIVERSITY, this.menuKeyListener);
        baseEmitter.removeEventListener(EVENT_SELECT_ATTENDED_LECTURES, this.menuKeyListener);
        baseEmitter.removeEventListener(EVENT_SELECT_ADDED_LECTURES, this.menuKeyListener);
        baseEmitter.removeEventListener(EVENT_SELECT_FAVORITE_NOTES, this.menuKeyListener);
        baseEmitter.removeEventListener(EVENT_SELECT_ADDED_NOTES, this.menuKeyListener);
    }

    showDrawer(): void {
        this.setState({ drawerVisible: true });
    }

    hideDrawer(): void {
        this.setState({ drawerVisible: false });
    }

    render(): ReactNode {
        const { children } = this.props;
        const { drawerVisible, drawerSelectedKey, drawerOpenKey } = this.state;
        return (
            <div className='mainContainer'>
                <Toolbar onLogoClick={ this.showDrawer }/>
                <div className='mainContent'>
                    { children }
                </div>
                <MenuDrawer visible={ drawerVisible } selectedKey={ drawerSelectedKey }
                            openKey={ drawerOpenKey } onClose={ this.hideDrawer }/>
            </div>
        );
    }
}

export { ContainerPage };
