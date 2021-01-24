import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import BoardSpace from './BoardSpace'
import { SIDES} from '../../constants';


function DND(props) {  
    return(
    <DragDropContext onDragEnd={props.onDragEnd}>
    {SIDES.slice(0).reverse().map(side=>{
        return <BoardSpace side={side.name.replace(/\s/g, "")} array={props.mapCards[side.name.replace(/\s/g, "")]}/>
        })}
    </DragDropContext>
)

}

export default DND;