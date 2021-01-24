import React, { useState, useRef, useCallback} from 'react';
import {  deleteTask, deleteUser, promoteUser} from '../../util/APIUtils';
import { DeleteOutlined, UpCircleOutlined} from '@ant-design/icons';
import { Row, notification, Tooltip } from 'antd';
import { withRouter } from 'react-router-dom';
import useCardSearch from '../../hooks/useCardSearch'
import './AdminPanel.css'

function TaskList (props) {
    
    const [pageNumber, setPageNumber] = useState(0);
    const {elems, hasMore, loading} = useCardSearch(pageNumber, 10, props.type);
    const observer = useRef();

    const deleteElem=(id)=>{
        if(props.type==="tasks")
        deleteTask(id).then( res => {
        elems.length=0; 
        setPageNumber(0);
        });
        if(props.type==="users")
        deleteUser(id).then( res => {
        elems.length=0;
        setPageNumber(0);
        });
        notification.success({
            message: 'Gwentopedia',
            description: 'Record has been deleted.'
        });  
    }
    const promote=(id)=>{
        promoteUser(id, 3)
        .then(response => {
            elems.length=0;
            setPageNumber(0);    
            }).catch(error => {                
            notification.error({
                message: 'Gwentopedia',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });              
            });
    }
    const lastTaskElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
          }
        })
        if (node) observer.current.observe(node)
      }, [loading, hasMore])
     
 
        return (
            <div className="tasks-container">        
            <Row>                          
                {
                    elems.length !== 0 && props.type==="tasks"?(
                        <div className="divTable">
                            <div className="divTableBody">
                            {elems.map((task,index) =>  {
                                if (elems.length === index + 1) {
                            return <div key={index} className="divTableRow" ref={lastTaskElementRef}>
                            <div className="divTableCell">{task.name}</div>
                            <div className="divTableCell">{task.createdBy.username}</div>
                            <div className="divTableCell"><Tooltip title="delete"><DeleteOutlined className="icon" onClick={()=>deleteElem(task.id)} style={{color: "red"}}/></Tooltip></div>
                        </div>}     else {
                            return <div className="divTableRow" key={index}>
                            <div className="divTableCell">{task.name}</div>
                            <div className="divTableCell">{task.createdBy.username}</div>
                            <div className="divTableCell"><Tooltip title="delete"><DeleteOutlined className="icon" onClick={()=>deleteElem(task.id)} style={{color: "red"}}/></Tooltip></div>
                        </div>}})}
                        </div>
                        </div>                
                    ):null
                }
                  {
                    elems.length !== 0 && props.type==="users"? (
                        <div className="divTable">
                            <div className="divTableBody">
                                {console.log(elems)}
                            {elems.map((user,index) =>  {
                                if (elems.length === index + 1) {
                            return <div className="divTableRow" key={index} ref={lastTaskElementRef}>
                            <div className="divTableCell">{user.username}</div>
                            <div className="divTableCell">{user.roles.map((role, index)=><div key={index}> {role.name}</div>)}</div>
                            <div className="divTableCell"><Tooltip title="delete"><DeleteOutlined className="icon" onClick={()=>deleteElem(user.id)} style={{color: "red"}}/></Tooltip>
                            {user.roles.some(role=> role.name==="ROLE_AUTHOR")?null:<Tooltip title="make author"><UpCircleOutlined className="icon" onClick={()=>promote(user.id)} style={{color: "gold"}}/></Tooltip>}
                            </div>
                        </div>}     else {
                            return <div className="divTableRow" key={index}>
                            <div className="divTableCell">{user.username}</div>
                            <div className="divTableCell">{user.roles.map((role, index)=><div key={index}> {role.name}</div>)}</div>
                            <div className="divTableCell"><Tooltip title="delete"><DeleteOutlined className="icon" onClick={()=>deleteElem(user.id)} style={{color: "red"}}/></Tooltip>
                            {user.roles.some(role=> role.name==="ROLE_AUTHOR")?null:<Tooltip title="make author"><UpCircleOutlined className="icon" onClick={()=>promote(user.id)} style={{color: "gold"}}/></Tooltip>}
                            </div>
                        </div>}})}
                        </div>
                        </div>                
                    ):null
                }
                </Row>
                {
                    elems.length === 0 ? (
                        <div className="no-tasks-found">
                            <span>No New Tasks Found.</span>
                        </div>    
                    ): null
                }           
                {/* {
                    isLoading ? 
                    <LoadingIndicator />: null                     
                } */}
            </div>
        );
    }

export default withRouter(TaskList);