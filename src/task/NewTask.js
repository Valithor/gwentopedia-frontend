import React from 'react';
import { useState, useEffect, useRef, useCallback} from 'react';
import { useForm, Controller } from "react-hook-form";
import { inputField, SelectField, SelectImgField, TaskCardForm} from "../util/Inputs";
import LoadingIndicator  from '../common/LoadingIndicator';
import { getTaskTypes, createTask, getLeaders} from '../util/APIUtils';
import './NewTask.css';  
import { DIFFICULTIES, FACTIONS } from '../constants';
import { Form, Button, Col, notification, Row } from 'antd';
import Card from './Card';
import useCardSearch from '../hooks/useCardSearch'
import useIsMountedRef from '../hooks/useIsMountedRef'

const FormItem = Form.Item;
  
  function NewTask(props) {  
    const {handleSubmit, control, errors } = useForm();
    const [isLoading, setIsLoading] = useState(true);
    const [taskCards, setTaskCards] = useState([]);
    const [card, setCard]= useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [faction, setFaction] = useState();
    const [taskTypes, setTaskTypes] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const {elems, hasMore, loading} = useCardSearch(pageNumber, 10, 'cards', faction);
    const observer = useRef();
    const isMountedRef = useIsMountedRef();


    const lastCardElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
          }
        })
        if (node) observer.current.observe(node)
      }, [loading, hasMore])
    
    const changeVisibility = useCallback(
        () => setIsVisible(!isVisible),
        [isVisible, setIsVisible]
      );    
    useEffect(() => { 
        getTaskTypes().then((res)=>{
            if(isMountedRef.current)
            setTaskTypes(res.data);
        getLeaders().then((res)=>{
            if(isMountedRef.current)
            setLeaders(res.data);
            });
        });

        setIsLoading(!isLoading);     
          }, [props.currentUser]);      
    const handleCancel = (event) => {
        changeVisibility();
      };
    const handleCard= useCallback((value)=>{
        setCard(value);
        changeVisibility();
    }, []);

    const addTaskCard = (taskCard) => {    
        const {side,answer,strength, correct} = taskCard;        
        setTaskCards([...taskCards,{answer: answer, side: side, card: card, taskId: props.match.params.id, correct: correct?correct.toString():null, strength: strength}]);
        changeVisibility();
    };

     const removeTaskCard =(taskCardId) => {
         var temp = [...taskCards];
         if(taskCardId !==-1){
             temp.splice(taskCardId,1);
             setTaskCards(temp);
             console.log(temp);
         }         
     }
    const onSubmit =(data) => {
        data={...data, taskCards: taskCards}     
        createTask(data)       
            .then(response => {
            props.history.push("/");                
            }).catch(error => {
                if(error.status === 401) {
                    props.handleLogout('/login', 'error', 'You have been logged out. Please login to create task.');    
                } else {
                    notification.error({
                        message: 'Gwentopedia',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });              
                }
            });
        }        
      const filterFaction=(name)=>{
            elems.splice(0,elems.length)
            setFaction(name);
            setPageNumber(0);
            setTimeout(function() {
                }, 1000);
           }
    const displayCards = (rowNr)=>{        
        return <Row>{taskCards.map((taskCard, index)=>{
            if(rowNr==taskCard.side)
           return  <div className="small-card-create" key={index} onClick={()=>removeTaskCard(index)}><Card card={taskCard.card} power={taskCard.strength} size='small-card'/></div>                
        })}
        </Row> 
    }

        return (
            <div> 
                                {isLoading?<LoadingIndicator />
                                : <div>
                
                        <div className='rtableRow-create'>{displayCards("Opp Ranged")}</div>
                        <div className='rtableRow-create'>{displayCards("Opp Melee")}</div>
                        <div className='rtableRow-create'>{displayCards("Player Melee")}</div>
                        <div className='rtableRow-create'>{displayCards("Player Ranged")}</div>
                        <div className='rtableRow-create'>{displayCards("Player Hand")}</div>
                <div className="new-task-container">
                    {FACTIONS.map((name, index)=>{
                        return <Button className='factions' key={index} shape="circle" ghost={true}><img onClick={() =>filterFaction(name)} src={`https://gwent.one/image/icon/faction/hc/${name}.png`}/></Button>
                    })}
            <div className="card-lib">
                
                    {
                                elems.map((card,index) =>  {
                                    if (elems.length === index + 1) {
                                        return <div className="big-card"  ref={lastCardElementRef} onClick={()=>handleCard(card)} key={index}><Card size="big-card" card={card}/></div>
                                      } else {
                                        return <div className="big-card" onClick={()=>handleCard(card)} key={index}><Card size="big-card" card={card}/></div>
                                      }
                                }
                                   
                                        )                                       
                    } </div><br/>
            <Form onFinish={handleSubmit(onSubmit)} className="create-task-form">
                        <FormItem className="task-form-row">
				        <Controller
					    as={inputField("Name of the task")}
				    	name='name'
				    	control={control}
				    	defaultValue=''
				    	rules={{ required: true }}
				        />
				        {errors.name && (
					    <span className='error'>This field is required</span>)}
                        </FormItem> 
                        
                        <FormItem className="task-form-row">
                        <Col xs={24} sm={4}>
                                Difficulty:
                        </Col>
                        <Controller
					    as={SelectField(DIFFICULTIES[0].name, DIFFICULTIES, '', false)}
					    name='difficulty'
					    control={control}
                        defaultValue={DIFFICULTIES[0].name}
                        rules={{ required: true }}/>
                        </FormItem>           
                        <FormItem className="task-form-row">
                        <Col xs={24} sm={4}>
                                TaskType: 
                        </Col>
                        {taskTypes.length>0?<Controller
					    as={SelectField(taskTypes[0].name, taskTypes, '', false)}
					    name='taskType'
					    control={control}
                        defaultValue={taskTypes[0].name}
                        rules={{ required: true }}/>:null}
                        </FormItem>           
                        <FormItem className="task-form-row">
                        <Col xs={24} sm={4}>
                                Player: 
                        </Col>
                        {leaders.length>0?<Controller
					    as={SelectImgField(leaders[0].name, leaders, '', false)}
					    name='leaderPl'
					    control={control}
                        defaultValue={leaders[0].name}
                        rules={{ required: true }}/>:null}
                        </FormItem>                          
                        <FormItem className="task-form-row">
                        <Col xs={24} sm={4}>
                                Opponent: 
                        </Col>
                        {leaders.length>0?<Controller
					    as={SelectImgField(leaders[0].name, leaders, '', false)}
					    name='leaderOpp'
					    control={control}
                        defaultValue={leaders[0].name}
                        rules={{ required: true }}/>:null}
                        </FormItem> 

                        <Button type='primary' className="create-task-form-button" htmlType='submit'>Create Task</Button>                        
                    </Form>  
                        {isVisible?<TaskCardForm card={card} addTaskCard={addTaskCard} setIsVisible={setIsVisible} handleCancel={handleCancel} />: null }
                
                
                    
                        </div></div>}
            </div>
        );
    }




export default NewTask;