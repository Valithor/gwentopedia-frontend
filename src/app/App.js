import React from 'react';
import './App.less';
import '../util/fonts/stylesheet.css';
import {Route, withRouter, Switch} from 'react-router-dom';
import { useState, useEffect} from 'react';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import TaskList from '../task/TaskList';
import NewTask from '../task/NewTask';
import TaskView from '../task/TaskView';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AdminPanel from '../user/profile/AdminPanel';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

import { Layout, notification } from 'antd';
const { Content } = Layout;
notification.config({
  placement: 'topRight',
  top: 70,
  duration: 3,
});  

function App (props) {
  const [currentUser, setCurrenUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadCurrentUser = () => {
    setIsLoading(true);
    getCurrentUser()
    .then(response => {
      setCurrenUser(response.data);
      setIsAuthenticated(true);
      setIsLoading(false);
      console.log(response);
  
         
    }).catch(error => {
      setIsLoading(false)
    });
  }

  useEffect(() => {  
    loadCurrentUser();     
      }, []);  

  const handleLogout = (redirectTo="/", notificationType="success", description="You're successfully logged out.") => {
    localStorage.removeItem(ACCESS_TOKEN);
    setCurrenUser(null);
    setIsAuthenticated(false);

    props.history.push(redirectTo);
    window.location.reload();
    
    notification[notificationType]({
      message: 'Gwentopedia',
      description: description,
    });
  }

  const handleLogin = ()=> {
    notification.success({
      message: 'Gwentopedia',
      description: "You're successfully logged in.",
    });
    loadCurrentUser();

    props.history.push("/");
    window.location.reload();

  }

    if(isLoading) {
      return <LoadingIndicator />
    }
    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={isAuthenticated} 
            currentUser={currentUser} 
            onLogout={handleLogout} />

          <Content className="app-content">
            <div className="bg">
            <div className="container">
              <Switch>      
                <Route exact path="/" 
                  render={(props) => <TaskList isAuthenticated={isAuthenticated} type="allTasks"
                      currentUser={currentUser} handleLogout={handleLogout} {...props} />}>
                </Route>
                <Route path="/login" 
                  render={(props) => <Login onLogin={handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username" 
                  render={(props) => <Profile isAuthenticated={isAuthenticated} currentUser={currentUser} {...props}  />}>
                </Route>
                <PrivateRoute authenticated={isAuthenticated} path="/task/new" currentUser={currentUser} component={NewTask} handleLogout={handleLogout}></PrivateRoute>
                <Route path="/task/:id" render={(props)=><TaskView isAuthenticated={isAuthenticated} currentUser={currentUser} {...props}/>}></Route>
                <Route path ="/admin" render={(props)=> <AdminPanel isAuthenticated={isAuthenticated} currentUser={currentUser} {...props}/>}></Route>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
            </div>
          </Content>
        </Layout>
    );
  
}

export default withRouter(App);
