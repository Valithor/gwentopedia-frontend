import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Popover } from 'antd';
import './BoardSpace.css';  
import Card from '../Card';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,

  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'rgba(255, 0, 0, 0.2)',
  display: 'flex',
  border: '2px solid black',
  padding: grid,
  height: 160,
  overflow: 'auto',
});
  
  function BoardSpace(props) {  

     const content = (card)=>{
        return  <div className="popover">
                <Card card={card}/><br/>{card.ability}</div>
     }
        return (
            <div>        
        <Droppable droppableId={props.side} direction="horizontal">
          {(provided, snapshot) => (
            <div className='rTableRow'
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {props.array.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <Popover key={item.id} content={content(item.content.card)}><div className="small-card"> <Card card={item.content.card} power={item.content.strength}/></div></Popover>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
            </div>
        );
    }




export default BoardSpace;