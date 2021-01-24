import React from 'react';
import { Link } from 'react-router-dom';
import {intToRGB, hashCode} from '../util/Helpers'
import { DIFFICULTIES_TO_VALUES } from '../constants';
import { StarFilled  } from '@ant-design/icons';
import { Card, Tag, Col } from 'antd';
import moment from 'moment';
const { Meta } = Card;

function Task(props){ 
  const stars =()=>{
    const starList=[];
    for(let a=DIFFICULTIES_TO_VALUES[props.task.difficulty.replace(/\s/g, "")]; a>0; a--){
      starList.push(<StarFilled style={{color: "gold"}}/>)
    }
    return starList;
  }  
    return(
      <Col key={props.task.id} span={6}>
        <Card
        style={{fontSize: 10, width: 200}}
        hoverable={true}
        cover={
            <div className="vs">
                <img alt="example" className="leaders"
                  src={`/leaders/${props.task.leaderPl.imgurl}.png`}/>
                <img alt="example" className="leaders"
                  src={`/leaders/${props.task.leaderOpp.imgurl}.png`}/>
                  <div className="stars">{stars()}</div>
            </div>
        }
        actions={[
        <Link to={`/task/${props.task.id}`}>Solve it!</Link>,
        ]}
      >
        <Meta
          avatar={  <Link className="creator-link" to={`/users/${props.task.createdBy.username}`}>
          {<img className="user-avatar-nav" src={props.task.createdBy.avatar}style={{marginRight: 0}} />}
                <br/>{props.task.createdBy.username}</Link>}
          description={ <div><h3>{props.task.name.substring(0, 10)}</h3>
          <Tag onClick= {() => props.parentMethod(props.task.taskType.name)} color={intToRGB(hashCode(props.task.taskType.name))} >{props.task.taskType.name}</Tag>
        <br/>
              {moment(props.task.creationDateTime, "YYYY-MM-DDThh:mm:ssZ").fromNow()}</div>}
        />
      </Card>
      </Col>
      );
}
export default Task;