import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { SIDES} from '../constants';
import DND from './game/DND'
import { useState, useEffect} from 'react'  
import LoadingIndicator  from '../common/LoadingIndicator';
import { getTaskById, saveAnswer } from '../util/APIUtils';
import { notification} from 'antd';
import { Modal } from 'antd';
import NotFound from '../common/NotFound';
import useIsMountedRef from '../hooks/useIsMountedRef'
import './Task.css';  

  const makeArray = (count, elems, offset)=>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `${k + offset}`,
    content: elems[k]
}));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
  
  function TaskView(props) {  
    const [task, setTask]=useState([]);
    const [answer, setAnswer]=useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [mapCards, setMapCards] = useState({});
    const [good, setGood] = useState();
    const isMountedRef = useIsMountedRef();


    useEffect(() => { 
        getTaskById(props.match.params.id).then((res)=>{
            if(!props.currentUser && res.data.taskType.name != 'Tutorial'){
              notification.error({
                message: 'Gwentopedia',
                description: 'Login/signup in order to access more tasks'
            });    
            props.history.push('/login');
            }
            if(isMountedRef.current)
            setTask(res.data);
            console.log(res.data)
            let arr =[];
            let count=0;
            SIDES.forEach((side)=>{
              let value = [...res.data.taskCards.filter(card => card.side == side.name)];
              arr={...arr, [side.name.replace(/\s/g, "")]: value?makeArray(value.length, value,count):[]};
              count+=value.length;             
            })      
            if(isMountedRef.current)
            setMapCards(arr);   
            setIsLoading(false);
        }).catch(e=>{
          setTask('Error');
        })
     
          }, []);      

          const handleCancel = event => {
            props.history.push('/');
          };

     const chooseCard =(good) => {
       setGood(good);
       const answerData={good: good};
       if(task.correct==null && task.taskType.name != 'Tutorial')
       if(task.createdBy.username!=props.currentUser.username)
       saveAnswer(props.match.params.id, answerData)
       .then(response => {
        }).catch(error => {
            if(error.status === 401) {
                props.handleLogout('/login', 'error', 'You have been logged out. Please login create task.');    
            } else {
                notification.error({
                    message: 'Gwentopedia',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
             setIsVisible(true);             
     }
         
   
    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination || source.droppableId != 'PlayerHand') {
          return;
        }
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                mapCards[source.droppableId],
                source.index,
                destination.index
            );
            
            setMapCards({...mapCards, [source.droppableId]: items});
        } else {
          const taskCard = mapCards[source.droppableId][source.index].content;
            const result = move(
                mapCards[source.droppableId],
                mapCards[destination.droppableId],
                source,
                destination
            );
            setAnswer(taskCard.answer);            
            setMapCards({...mapCards, [source.droppableId]:result[source.droppableId], [destination.droppableId]:result[destination.droppableId]}) 
            console.log(taskCard);
            chooseCard(taskCard.correct?taskCard.correct.split(',').includes(destination.droppableId.replace(/([A-Z])/g, ' $1').trim())?1:0:0);           

        }      
      }
      if(task==='Error')
      return <NotFound/>

        return (
            <div>
                <h1>{task.name}</h1>
                {   
                    isLoading ? 
                    <LoadingIndicator />: null                     
                }   
      {!isLoading && task ? ( 
        <DND mapCards={mapCards} onDragEnd={onDragEnd}/>
      ): null
    }
                    <Modal footer={null} title={good?<div><CheckCircleOutlined style={{color: "green"}}/> Congratulations!</div>:<div><CloseCircleOutlined style={{color: "red"}}/> Good luck next time!</div>} visible={isVisible} onCancel={handleCancel}>{answer}</Modal>          
            </div>
        );
    }




export default TaskView;