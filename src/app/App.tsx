import { ReactNode, Suspense } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import React, { Component } from 'reactn';
import { SessionService } from '../service';
import './App.css';
import { ModalPortal, RouteProvider } from './component';
import {
    AddedLecturesPage,
    AddedNotesPage,
    AttendedLecturesPage,
    EntrancePage,
    FavoriteNotesPage,
    LecturePage,
    Page,
    SplashPage, TAB_KEY_ANNOUNCEMENTS, TAB_KEY_LECTURES,
    TAB_KEY_WALL,
    UniversityPage,
    VerifyEmailPage,
    VerifyPasswordPage
} from './page/';

class App extends Component {

    componentWillMount(): void {
        // Initialize global state
        this.setGlobal({
            user: SessionService.getUser(),
            token: SessionService.getAccessToken(),
            updated: 0
        });
    }

    render(): ReactNode {
        const { PublicRoute, PrivateRoute, OpenRoute } = RouteProvider;

        return (
            <Suspense fallback={ <SplashPage/> }>
                <BrowserRouter>
                    <RouteProvider>
                        <PublicRoute exact path='/' component={ EntrancePage }/>
                        <PublicRoute exact path='/verify/:hash' component={ VerifyEmailPage }/>
                        <PublicRoute exact path='/password/:hash' component={ VerifyPasswordPage }/>

                        <PrivateRoute exact path='/university/:id' render={ (props) => {
                            return <Redirect to={'/university/' + props.match.params.id + '/' + TAB_KEY_WALL}/>
                        } }/>

                        <PrivateRoute exact path='/university/:id/:tab' component={ UniversityPage }/>

                        <PrivateRoute exact path='/lecture/attended' component={ AttendedLecturesPage }/>
                        <PrivateRoute exact path='/lecture/added' component={ AddedLecturesPage }/>

                        <PrivateRoute exact path='/lecture/:id' render={ (props) => {
                            return <Redirect to={'/lecture/' + props.match.params.id + '/' + TAB_KEY_ANNOUNCEMENTS}/>
                        } }/>

                        <PrivateRoute exact path='/lecture/:id/:tab' component={ LecturePage }/>

                        <PrivateRoute exact path='/note/favorite' component={ FavoriteNotesPage }/>
                        <PrivateRoute exact path='/note/added' component={ AddedNotesPage }/>

                        <PrivateRoute exact path='/' render={ () => {
                            return <Redirect to={'/university/' + this.global.user.id}/>
                        } }/>

                        <OpenRoute render={ () => <Page notFound/> }/>
                    </RouteProvider>
                </BrowserRouter>
                <ModalPortal/>
            </Suspense>
        );
    }
}

export default App;
