import { ComponentType, createElement, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import React, { Component } from 'reactn';
import { baseEmitter } from '../../../../event';

const EVENT_OPEN_MODAL = 'EVENT_OPEN_MODAL';
const EVENT_CLOSE_MODAL = 'EVENT_OPEN_MODAL';

type ModalPortalProps = {}

interface ModalPortalState {
    /**
     * Currently active modal.
     */
    modal: ReactElement | null
}

/**
 * Modal container can have only one modal. Do not support opening multiple modals at same time.
 */
class ModalPortal extends Component<ModalPortalProps, ModalPortalState> {

    constructor(props: ModalPortalProps) {
        super(props);

        this.state = {
            modal: null
        };

        this.modalListener = this.modalListener.bind(this);
    }

    static open<T>(modal: ComponentType<any>, props: T): void {
        setRootOverflow(false);
        baseEmitter.emit(EVENT_OPEN_MODAL, createElement(modal, props));
    }

    static close(): void {
        setRootOverflow(true);
        baseEmitter.emit(EVENT_CLOSE_MODAL, null);
    }

    modalListener(modal: ReactElement): void {
        this.setState({ modal });
    }

    componentDidMount(): void {
        baseEmitter.on(EVENT_OPEN_MODAL, this.modalListener);
        baseEmitter.on(EVENT_CLOSE_MODAL, this.modalListener);
    }

    componentWillUnmount(): void {
        baseEmitter.removeEventListener(EVENT_OPEN_MODAL, this.modalListener);
        baseEmitter.removeEventListener(EVENT_CLOSE_MODAL, this.modalListener);
    }

    render(): ReactNode {
        const { modal } = this.state;

        const portal = document.getElementById('modal');

        let element = null;

        if (portal) {
            element = createPortal(modal, portal);
        }

        return (
            <div>
                { element }
            </div>
        );
    }
}

function setRootOverflow(enabled: boolean): void {
    const root = document.getElementById('root');
    if (root) {
        if (enabled) {
            root.style.overflowY = 'scroll';
        } else {
            root.style.overflowY = 'hidden';
        }
    }
}

export { ModalPortal };
