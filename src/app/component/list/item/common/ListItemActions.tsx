import { Dropdown, Icon, Menu, Row } from 'antd';
import { IconProps } from 'antd/lib/icon';
import { ReactElement, ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import './ListItemActions.css';

export interface ListItemActionLike {
    isLiked: boolean,
    likeCount: number,
    onClick: () => void,
    loading: boolean
}

export interface ListItemActionFav {
    isFav: boolean,
    favCount: number,
    onClick: () => void,
    loading: boolean
}

export interface ListItemActionComment {
    commentedCount: number,
    commentCount: number,
    onClick: () => void
}

export interface ListItemActionReply {
    onClick: () => void
}

export interface ListItemActionRate {
    onClick: () => void
}

export interface ListItemActionMoreItem {
    icon: string,
    value: string,
    onClick: () => void
}

export interface ListItemActionMore {
    items: ListItemActionMoreItem[]
}

type ListItemActionsProps = {
    like?: ListItemActionLike,
    fav?: ListItemActionFav,
    comment?: ListItemActionComment,
    reply?: ListItemActionReply,
    rate?: ListItemActionRate,
    more?: ListItemActionMore
}

type ExtendedListItemActionsProps = ListItemActionsProps & WithTranslation;

interface ListItemActionsState {
}

class ListItemActions extends Component<ExtendedListItemActionsProps, ListItemActionsState> {

    render(): ReactNode {
        const { t, like, fav, comment, rate, reply, more } = this.props;

        const elements: ReactElement[] = [];

        if (like) {
            const { isLiked, likeCount, onClick, loading } = like;

            let iconProps: IconProps = { type: 'heart', theme: 'outlined' };


            if (isLiked) {
                if (!loading) {
                    iconProps.twoToneColor = '#eb2f96';
                    iconProps.theme = 'twoTone';
                }
            }

            if (loading) {
                iconProps.type = 'loading';
            }

            const likeActionItem = (
                <div key={ 0 } className='listItemActionItem' onClick={ onClick }>
                    <Icon className='listItemActionItemIcon' { ...iconProps }/>
                    <span className='listItemActionItemValue'>{ likeCount }</span>
                </div>
            );

            elements.push(likeActionItem);
        }

        if (fav) {
            const { isFav, favCount, onClick, loading } = fav;

            let iconProps: IconProps = { type: 'star', theme: 'outlined' };

            if (isFav) {

                if (!loading) {
                    iconProps.twoToneColor = '#FDD835';
                    iconProps.theme = 'twoTone';
                }
            }

            if (loading) {
                iconProps.type = 'loading';
            }

            const favActionItem = (
                <div key={ 0 } className='listItemActionItem' onClick={ onClick }>
                    <Icon className='listItemActionItemIcon' { ...iconProps }/>
                    <span className='listItemActionItemValue'>{ favCount }</span>
                </div>
            );

            elements.push(favActionItem);
        }

        if (comment) {
            const { commentedCount, commentCount, onClick } = comment;

            let iconProps: IconProps = { type: 'message', theme: 'outlined' };

            const commentActionItem = (
                <div key={ 1 } className='listItemActionItem' onClick={ onClick }>
                    <Icon className='listItemActionItemIcon' { ...iconProps }/>
                    <span className='listItemActionItemValue'>{ commentedCount + commentCount }</span>
                </div>
            );

            elements.push(commentActionItem);
        }

        if (reply) {
            const { onClick } = reply;

            const replyActionItem = (
                <div key={ 2 } className='listItemActionItem' onClick={ onClick }>
                    <span className='listItemActionItemValue'>{ t('listItem.action.reply') }</span>
                </div>
            );

            elements.push(replyActionItem);
        }

        if (rate) {
            const { onClick } = rate;

            const rateActionItem = (
                <div key={ 3 } className='listItemActionItem' onClick={ onClick }>
                    <span className='listItemActionItemValue'>{ t('listItem.action.rate') }</span>
                </div>
            );

            elements.push(rateActionItem);
        }

        if (more) {
            const { items } = more;

            let iconProps: IconProps = { type: 'ellipsis', theme: 'outlined' };

            let menuItems: ReactElement[] = [];

            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                const menuItem = (
                    <Menu.Item key={ i } onClick={ item.onClick }>
                        <Icon type={ item.icon }/>
                        <span>{ item.value }</span>
                    </Menu.Item>
                );

                menuItems.push(menuItem);
            }

            const menu = (
                <Menu>
                    { menuItems }
                </Menu>
            );

            const moreActionItem = (
                <div key={ 4 } className='listItemActionItem'>
                    <Dropdown overlay={ menu } trigger={ ['click'] } placement='bottomCenter'>
                        <Icon className='listItemActionItemIcon' { ...iconProps }/>
                    </Dropdown>
                </div>
            );

            elements.push(moreActionItem);
        }

        return (
            <Row className='listItemActions'>
                { elements }
            </Row>
        );
    }
}

const ListItemActionsWithTranslation = withTranslation()(ListItemActions);

export { ListItemActionsWithTranslation as ListItemActions };
