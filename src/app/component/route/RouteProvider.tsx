import { Children, isValidElement, ReactElement, ReactNode } from 'react';
import { Route, RouteProps, Switch } from 'react-router';
import React, { Component } from 'reactn';
import { ContainerPage } from '../../page';

type RouteProviderProps = {}

interface RouteProviderState {
}

class RouteProvider extends Component<RouteProviderProps, RouteProviderState> {

    static PublicRoute = class PublicRoute extends Component<RouteProps> {

        render(): ReactNode {
            return (
                <Route { ...this.props }/>
            );
        }
    };

    static PrivateRoute = class PrivateRoute extends Component<RouteProps> {

        render(): ReactNode {
            return (
                <Route { ...this.props }/>
            );
        }
    };

    static OpenRoute = class PrivateRoute extends Component<RouteProps> {

        render(): ReactNode {
            return (
                <Route { ...this.props }/>
            );
        }
    };

    render(): ReactNode {
        const { children } = this.props;
        const { token } = this.global;

        const openRoutes = Children.map(children, child => {
            if (isValidElement<RouteProps>(child)) {
                let element: React.ReactElement<RouteProps> = child;
                if (element.type === RouteProvider.OpenRoute) {
                    return element;
                }
            } else return null;
        });

        let routes: ReactElement;
        if (token) {
            routes = (
                <ContainerPage>
                    <Switch>
                        {
                            Children.map(children, child => {
                                if (isValidElement<RouteProps>(child)) {
                                    let element: React.ReactElement<RouteProps> = child;
                                    if (element.type === RouteProvider.PrivateRoute) {
                                        return element;
                                    }
                                } else return null;
                            })
                        }
                        { openRoutes }
                    </Switch>
                </ContainerPage>
            );
        } else {
            routes = (
                <Switch>
                    {
                        Children.map(children, child => {
                            if (isValidElement<RouteProps>(child)) {
                                let element: React.ReactElement<RouteProps> = child;
                                if (element.type === RouteProvider.PublicRoute) {
                                    return element;
                                }
                            } else return null;
                        })
                    }
                    { openRoutes }
                </Switch>
            );
        }

        return (
            <div>
                { routes }
            </div>
        );
    }
}

export { RouteProvider };
