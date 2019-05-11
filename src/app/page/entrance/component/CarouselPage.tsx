import { ReactNode } from 'react';
import React, { Component } from 'reactn';
import './CarouselPage.css';

interface CarouselPageProps {
    color: string
}

interface CarouselPageState {

}

class CarouselPage extends Component<CarouselPageProps, CarouselPageState> {

    render(): ReactNode {
        const { children, color } = this.props;

        return (
            <div className='carouselPageContainer' style={ { backgroundColor: color } }>
                { children }
            </div>
        );
    }
}

export { CarouselPage };
