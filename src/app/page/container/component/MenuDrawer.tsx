import { Avatar, Badge, Button, Drawer, Icon, Menu, message, Row, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import { CSSProperties, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'reactn';
import { SessionService, Status, UserService } from '../../../../service';
import { RouteLink, Routes } from '../../../component';
import './MenuDrawer.css';

type MenuDrawerProps = {
    visible: boolean,
    onClose: () => void,
    selectedKey: string,
    openKey: string
};

type ExtendedMenuDrawerProps = MenuDrawerProps & WithTranslation & RouteComponentProps<any>;

interface MenuDrawerState {
    uploading: boolean
}

class MenuDrawer extends React.Component<ExtendedMenuDrawerProps, MenuDrawerState> {

    constructor(props: ExtendedMenuDrawerProps) {
        super(props);
        this.state = {
            uploading: false
        };
    }

    beforeUpload = (file: RcFile): boolean => {
        const { t } = this.props;
        const isImage =
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png';
        if (!isImage) {
            message.error(t('drawer.menu.invalidFileFormat'));
        }
        const size = file.size / 1024 / 1024;
        const isLt5M = size < 5;
        if (!isLt5M) {
            message.error(t('drawer.menu.invalidFileSize').replace('{0}', size.toString()));
        }

        return isImage && isLt5M;
    };

    handleUpload = (file: RcFile): boolean => {
        const { t } = this.props;
        const { user: { id } } = this.global;
        if (this.beforeUpload(file)) {
            UserService.updateImage({ image: file })
                .onStart(() => {
                    this.setState({ uploading: true });
                })
                .onSuccess(() => {
                    this.setGlobal({ updated: new Date().getTime() });
                })
                .onFailure((status) => {
                    switch (status) {
                        case Status.UNKNOWN:
                            message.error(t('response.common.unknown'));
                            break;
                    }
                })
                .onEnd(() => {
                    this.setState({ uploading: false });
                }).exec();
        }

        return false;
    };

    logout = (): void => {
        SessionService.removeSession();
        this.setGlobal({ user: null, token: null }, () => {
            this.props.history.push('/');
        });
    };

    render(): ReactNode {
        const { t, visible, onClose, selectedKey, openKey } = this.props;
        const { uploading } = this.state;
        const { user, updated } = this.global;
        const { id, firstName, lastName, university } = user;

        const badgeIcon = (
            <Button shape='circle' icon={ uploading ? 'loading' : 'edit' } htmlType='submit'/>
        );

        let profile = (
            <Row className='menuDrawerUserSection'>
                <Row type='flex' justify='center'>
                    <Upload beforeUpload={ this.handleUpload } disabled={ uploading } showUploadList={ false }>
                        <Badge offset={ [-18, 106] } count={ badgeIcon }>
                            <Avatar icon='user' size={ 128 } src={ UserService.getImageUrl({ userId: id, updated }) }/>
                        </Badge>
                    </Upload>
                </Row>
                <Row type='flex' justify='center'>
                    <span className='menuDrawerUserName'>
                        { firstName + ' ' + lastName }
                    </span>
                </Row>
                <Row type='flex' justify='center'>
                    <span className='menuDrawerUserUniversityAbbr'>
                        { university.abbr }
                    </span>
                </Row>
            </Row>
        );

        const menuSectionUniversities = (
            <div>
                <Icon type='home'/>
                <span>{ t('drawer.menu.universitySection') }</span>
            </div>
        );

        const menuSectionLectures = (
            <div>
                <Icon type='book'/>
                <span>{ t('drawer.menu.lectureSection') }</span>
            </div>
        );

        const menuSectionNotes = (
            <div>
                <Icon type='file'/>
                <span>{ t('drawer.menu.noteSection') }</span>
            </div>
        );

        let menu = (
            <Menu selectedKeys={ [selectedKey] } defaultOpenKeys={ [openKey] } mode='inline' theme='light'>
                <Menu.SubMenu key='university' title={ menuSectionUniversities }>
                    <Menu.Item key='userUniversity'>
                        <RouteLink to={ Routes.University } id={ university.id }>
                            { university.name }
                        </RouteLink>
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu key='lecture' title={ menuSectionLectures }>
                    <Menu.Item key='attendedLectures'>
                        <RouteLink to={ Routes.AttendedLectures } block>
                            { t('drawer.menu.attendedLectures') }
                            <span className='menuDrawerMenuItemExtra'>{ user.attendedLectureCount }</span>
                        </RouteLink>
                    </Menu.Item>
                    <Menu.Item key='addedLectures'>
                        <RouteLink to={ Routes.AddedLectures } block>
                            { t('drawer.menu.addedLectures') }
                            <span className='menuDrawerMenuItemExtra'>{ user.addedLectureCount }</span>
                        </RouteLink>
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu key='note' title={ menuSectionNotes }>
                    <Menu.Item key='favoriteNotes'>
                        <RouteLink to={ Routes.FavoriteNotes } block>
                            { t('drawer.menu.favoriteNotes') }
                            <span className='menuDrawerMenuItemExtra'>{ user.favNoteCount }</span>
                        </RouteLink>
                    </Menu.Item>
                    <Menu.Item key='addedNotes'>
                        <RouteLink to={ Routes.AddedNotes } block>
                            { t('drawer.menu.addedNotes') }
                            <span className='menuDrawerMenuItemExtra'>{ user.addedNoteCount }</span>
                        </RouteLink>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        );

        const bodyStyle: CSSProperties = {
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        };

        return (
            <Drawer bodyStyle={ bodyStyle } placement='left' closable={ false } visible={ visible } onClose={ onClose }>
                { profile }
                { menu }
                <Button className='menuDrawerLogout' htmlType='submit' icon='logout' onClick={ this.logout }>
                    { t('drawer.menu.logoutButton') }
                </Button>
            </Drawer>
        );
    }
}

const MenuDrawerWithTranslation = withTranslation()(MenuDrawer);

const MenuDrawerWithRouter = withRouter(MenuDrawerWithTranslation);

export { MenuDrawerWithRouter as MenuDrawer };
