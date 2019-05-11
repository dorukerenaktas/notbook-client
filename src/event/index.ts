import { EventEmitter } from 'events';

class BaseEventEmitter {
    eventEmitter: EventEmitter;

    /**
     * Initiate the event emitter
     */
    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Adds the @listener function to the end of the listeners array
     * for the event named @eventName
     * Will ensure that only one time the listener added for the event
     *
     * @param {string} eventName
     * @param {function} listener
     */
    on(eventName: string, listener: (...args: any[]) => void): void {
        this.eventEmitter.on(eventName, listener);
    }

    /**
     * Will remove the specified @listener from @eventName list
     *
     * @param {string} eventName
     * @param {function} listener
     */
    removeEventListener(eventName: string, listener: (...args: any[]) => void): void {
        this.eventEmitter.removeListener(eventName, listener);
    }

    /**
     * Will emit the event on the event name with the @payload
     * and if its an error set the @error value
     *
     * @param {string} eventName
     * @param {object} payload
     * @param {boolean} error
     */
    emit(eventName: string, payload: any, error = false): void {
        this.eventEmitter.emit(eventName, payload, error);
    }
}

const baseEmitter = new BaseEventEmitter();

export { baseEmitter };
