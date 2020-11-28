import React, { Component } from 'react';
import '../../css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from '../containers/Tabs'
import TabAccepted from '../containers/TabAccepted';
import TabSuggested from '../containers/TabSuggested';
import TabRejected from '../containers/TabRejected';
import TabAddPublication from '../containers/TabAddPublication';
import SideNav from "../ui/SideNav";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Identity from "../ui/Identity";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './Login'
//import jsonData from './sample-data.json';
import {isEmpty} from 'lodash';
import  Error from './Error';

class App extends Component {

    state = {
        tabActive: "Suggested",
        identityData: {

        }
    }

    constructor(props) {
        super(props)

        // bind elements
        this.tabClickHandler = this.tabClickHandler.bind(this)
        this.refreshHandler = this.refreshHandler.bind(this)
    }

    componentDidMount() {
        this.props.onLoad(this.props.match.params.uid, false)
        if (!this.props.auth.isLoggedIn) {
            //return this.props.history.push('/login')
        }
        //this.props.getIdentity(this.props.auth.username)
        this.props.getIdentity(this.props.match.params.uid)
    }

    tabClickHandler(str = 'Suggested') {
        this.setState({
            tabActive: str
        });
    }

    refreshHandler(event) {
        event.preventDefault()
        this.props.onLoad(this.props.match.params.uid, true)
    }

    render() {
        
        const thisObject = this;

        if (this.props.reciterFetching) {
            return (
                <div className="tab-container">
                    <div className="h6fnhWdeg-app-loader"> </div>
                </div>
            );
        } else {
            var tabActiveContent = (
                <TabSuggested tabClickHandler={this.tabClickHandler} />
            );
            switch (this.state.tabActive) {
                case "Accepted":
                    tabActiveContent = (
                        <TabAccepted tabClickHandler={this.tabClickHandler} />
                    );
                    break;
                case "Suggested":
                    tabActiveContent = (
                        <TabSuggested tabClickHandler={this.tabClickHandler} />
                    );
                    break;
                case "Rejected":
                    tabActiveContent = (
                        <TabRejected tabClickHandler={this.tabClickHandler} />
                    );
                    break;
                case "Add Publication":
                    tabActiveContent = (<TabAddPublication tabClickHandler={this.tabClickHandler} />);
                    break;
                default:
                    tabActiveContent = (
                        <TabSuggested
                            getData={this.getData}
                            tabClickHandler={this.tabClickHandler}
                        />
                    );
            }
            
            return (
                <div className="reviewSuggestions_mainContainer main-container">
                    <div className="header-position">
                        <Header username={this.props.username} />
                    </div>
                    <div className="side-nav-position">
                        <SideNav uid={this.props.match.params.uid} history={this.props.history} />
                    </div>
                    
                        {isEmpty(this.props.errors) ? (
                            <div className="publications-content">
                            <div className="identity-container">
                                <Identity
                                    identityData={this.props.identityData}
                                    identityFetching={this.props.identityFetching}
                                    history={this.props.history}
                                    uid={this.props.match.params.uid}
                                    buttonName='Manage Profile'
                                    errors={this.props.errors}
                                />
                            </div>
                            <div className="tab-container px-0">
                                {thisObject.props.reciterData.reciterPending && thisObject.props.reciterData.reciterPending.length > 0 ? (
                                  <a id="refreshBar" href="#" onClick={thisObject.refreshHandler}>
                                    <div className="h6fnhWdeg-reciter-pending-banner">
                                        <span>You have provided feedback on </span>
                                        <strong>{`${
                                            thisObject.props.reciterData.reciterPending.length
                                            } record(s). `}</strong>
                                            Refresh
                                        <span> to get new suggestions.</span>
                                    </div>
                                 </a>
                                ) : null}
                                <Tabs
                                    tabActive={this.state.tabActive}
                                    tabClickHandler={this.tabClickHandler}
                                />
                                <div className="h6fnhWdeg-tab-content h6fnhWdeg-tabs-container">
                                    <div className="Tabs_body_container h6fnhWdeg-tabs-content">{tabActiveContent}</div>
                                </div>
                            </div>
                            </div> 
                        ) : (<Error errorMessage={this.props.errors.join(",")}></Error>) }
                    <div className="footer-position">
                        <Footer />
                    </div>
                </div>
            );
        }
    }
}

export default App;
