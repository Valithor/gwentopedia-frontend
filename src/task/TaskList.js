import React, { useState, useEffect, useRef, useCallback} from 'react';
import SearchBar from './SearchBar'
import { getAllTasks, getUserCreatedTasks, getUserAnsweredTasks } from '../util/APIUtils';
import Task from './Task';
import { Link } from 'react-router-dom';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Row } from 'antd';
import { TASK_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import useCardSearch from '../hooks/useCardSearch'
import useIsMountedRef from '../hooks/useIsMountedRef'
import './TaskList.css'

function TaskList (props) {
    
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const {elems, hasMore, loading, filterType} = useCardSearch(pageNumber, 2, props.type, props.username, searchData);
    const observer = useRef();
    const isMountedRef = useIsMountedRef();


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

   

    const loadTaskList =(page = 0, size = TASK_LIST_SIZE)=> {
        let promise;
        if(props.type=='created')         
            promise = getUserCreatedTasks(props.username, page, size); 
        else if(props.type=='answered')
            promise = getUserAnsweredTasks(props.username, page, size);               
        else {
            const {difficulty, leaderPl, leaderOpp} = searchData;
            promise = getAllTasks(page, size, difficulty, leaderPl, leaderOpp);
        }
        if(!promise) 
            return;        
        promise           
        .then(response => {
            if(isMountedRef.current)
            setTasks(response.data.content);
        }).catch(error => {
            if(isMountedRef.current)
            setIsLoading(false);
        });
        if(isMountedRef.current)
        setIsLoading(false);
    }
    useEffect(() => {    
        if(isMountedRef.current)
        setPageNumber(0);     
        loadTaskList(); 
        console.log(elems) 
     }, [searchData]);  
   
     
 
        return (
            <div className="tasks-container">  
            {props.type==="allTasks"?<SearchBar setSearchData={setSearchData}></SearchBar>:null}
            <Row>

            {!isLoading && elems.length !== 0  && props.type!='answered'? (
                                elems.map((task,index) =>  {
                                    if (elems.length === index + 1) {
                                        return <div key={index} className="task-data" ref={lastTaskElementRef}><Task parentMethod={filterType} task={task} username={props.username?props.username:null} /></div>
                                      } else {
                                        return <div key={index} className="task-data"><Task parentMethod={filterType} task={task} username={props.username?props.username:null}/></div>
                                      }})):null}                            
                {
                    !isLoading && tasks.length !== 0  && props.type=='answered'? (
                        <div className="divTable">
                            <div className="divTableBody">
                            {elems.map((task,index) =>  {
                                if (elems.length === index + 1) {
                            return <div key={index} className={task.correct?'divTableRow-green':'divTableRow-red'} ref={lastTaskElementRef}>
                            <div className="divTableCell">{task.name}</div>
                            <div className="divTableCell">{task.difficulty}</div>
                            <div className="divTableCell">{task.createdBy.username}</div>
                            <div className="divTableCell">{task.taskType.name}</div>
                            <div className="divTableCell"><Link to={`/task/${task.id}`}>Check Task!</Link></div>
                        </div>}     else {
                            return <div key={index} className={task.correct?'divTableRow-green':'divTableRow-red'}>
                            <div className="divTableCell">{task.name}</div>
                            <div className="divTableCell">{task.difficulty}</div>
                            <div className="divTableCell">{task.createdBy.username}</div>
                            <div className="divTableCell">{task.taskType.name}</div>
                            <div className="divTableCell"><Link to={`/task/${task.id}`}>Check Task!</Link></div>
                        </div>}})}
                        </div>
                        </div>                
                    ):null
                }
                </Row>
                {
                    !isLoading && tasks.length === 0 ? (
                        <div className="no-tasks-found">
                            <span>No New Tasks Found.</span>
                        </div>    
                    ): null
                }           
                {
                    isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }

export default withRouter(TaskList);