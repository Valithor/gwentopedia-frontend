import React from 'react';
import TaskList from '../../task/TaskList';
import { getUserProfile } from '../../util/APIUtils';
import { Tabs } from 'antd';
import { useState, useEffect} from 'react';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';

function Profile(props) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [serverError, setServerError] = useState(false);

    const loadUserProfile = (username) => {
        setIsLoading(true);    

        getUserProfile(username)
        .then(response => {
            setUser(response.data);
            setIsLoading(false);           
        }).catch(error => {
            if(error.status === 404) {
                setNotFound(true);
                setIsLoading(false);        
            } else {
                setServerError(true);
                setIsLoading(false);        
            }
        });        
    }
    useEffect(() => {  
        const username = props.match.params.username;
        loadUserProfile(username);
          }, []);  

        if(isLoading) {
            return <LoadingIndicator />;
        }

        if(notFound) {
            return <NotFound />;
        }

        if(serverError) {
            return <ServerError />;
        }

        return (
            <div className="profile">
                { 
                    user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                        <img className="user-avatar-border" src={user.avatar}/>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{user.username}</div>
                                    <div className="user-joined">
                                        Joined {formatDate(user.joinedAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="user-task-details">    
                                <Tabs defaultActiveKey="1" 
                                    animated={true}
                                    size="large"
                                    className="profile-tabs">
                                    <Tabs.TabPane tab={`Created`} key="1">
                                        { <TaskList username={props.match.params.username} type="created" /> }
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={'Answered'}  key="2">
                                        <TaskList username={props.match.params.username} type="answered" />
                                    </Tabs.TabPane>
                                </Tabs>
                            </div>  
                        </div>  
                    ): null               
                }
            </div>
        );
    
}

export default Profile;