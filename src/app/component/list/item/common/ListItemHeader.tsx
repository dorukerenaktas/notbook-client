import { Rate as StarRate, Row } from 'antd';
import { ReactNode } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import React, { Component } from 'reactn';
import './ListItemHeader.css';

type TitleProps = {
    value: string,
    time?: string
}

type ExtendedTitleProps = TitleProps & WithTranslation;

interface TitleState {
}

class Title extends Component<ExtendedTitleProps, TitleState> {

    canUpdate = true;

    componentDidMount(): void {
        const { time } = this.props;
        let self = this;

        function updateTime(): void {
            if (self.canUpdate) {
                self.forceUpdate();
                updateAfter();
            }
        }

        function updateAfter(): void {
            if (time) {
                const milliseconds = new Date().getTime() - new Date(time).getTime();

                if (milliseconds < 3600000) {
                    setTimeout(updateTime, milliseconds % 60000);
                } else if (milliseconds < 87600000) {
                    setTimeout(updateTime, milliseconds % 3600000);
                }
            }
        }

        updateAfter();
    }

    componentWillUnmount(): void {
        this.canUpdate = false;
    }

    render(): ReactNode {
        const { t, value, time } = this.props;

        let timeSection = <span/>;

        if (time) {
            timeSection = (
                <span className='listItemHeaderTime'
                      style={ { marginLeft: 12 } }>{ ListItemHeader.timeSince(time, t) }</span>
            );
        }

        return (
            <div>
                <span className='listItemHeaderTitle'>{ value }</span>
                { timeSection }
            </div>
        );
    }
}

const TitleWithTranslation = withTranslation()(Title);

type SubtitleProps = {
    value: string
}

interface SubtitleState {
}

class Subtitle extends Component<SubtitleProps, SubtitleState> {

    render(): ReactNode {
        const { value } = this.props;
        return (
            <div>
                <span className='listItemHeaderSubtitle'>{ value }</span>
            </div>
        );
    }
}

type TimeProps = WithTranslation & {
    value: string,
    time: string
}

interface TimeState {
}

class Time extends Component<TimeProps, TimeState> {

    canUpdate = true;

    componentDidMount(): void {
        const { time } = this.props;
        let self = this;

        function updateTime(): void {
            if (self.canUpdate) {
                self.forceUpdate();
                updateAfter();
            }
        }

        function updateAfter(): void {
            if (time) {
                const milliseconds = new Date().getTime() - new Date(time).getTime();

                if (milliseconds < 3600000) {
                    setTimeout(updateTime, milliseconds % 60000);
                } else if (milliseconds < 87600000) {
                    setTimeout(updateTime, milliseconds % 3600000);
                }
            }
        }

        updateAfter();
    }

    componentWillUnmount(): void {
        this.canUpdate = false;
    }

    render(): ReactNode {
        const { t, value, time } = this.props;

        let extendedTime = t('listItem.header.extendedTime')
            .replace('{0}', ListItemHeader.timeSince(time, t))
            .replace('{1}', value);

        return (
            <div>
                <span className='listItemHeaderTime'>{ extendedTime }</span>
            </div>
        );
    }
}

const TimeWithTranslation = withTranslation()(Time);

type RateProps = {
    value: number
}

interface RateState {
}

class Rate extends Component<RateProps, RateState> {

    render(): ReactNode {
        const { value } = this.props;
        return (
            <div>
                <StarRate className='listItemHeaderRate' value={ Math.round(value * 2) / 2 }
                          allowClear={ false } allowHalf disabled/>
            </div>
        );
    }
}

type ListItemHeaderProps = {
    time: string
}

interface ListItemHeaderState {
}

class ListItemHeader extends Component<ListItemHeaderProps, ListItemHeaderState> {

    static Title = TitleWithTranslation;

    static Subtitle = Subtitle;

    static Time = TimeWithTranslation;

    static Rate = Rate;

    static timeSince = (time: string, t: any): string => {
        let seconds = Math.floor((new Date().getTime() - new Date(time).getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval + t('listItem.header.yearAgo');
        }

        interval = Math.floor(seconds / 525600);
        if (interval >= 1) {
            return interval + t('listItem.header.monthAgo');
        }

        interval = Math.floor(seconds / 87600);
        if (interval >= 1) {
            return interval + t('listItem.header.dayAgo');
        }

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + t('listItem.header.hourAgo');
        }

        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + t('listItem.header.minuteAgo');
        }

        return t('listItem.header.now');
    };

    render(): ReactNode {
        const { children } = this.props;

        return (
            <Row className='listItemHeader'>
                { children }
            </Row>
        );
    }
}

export { ListItemHeader };
