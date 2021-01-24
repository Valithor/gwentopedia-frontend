import React from 'react';
import { useState, useEffect } from 'react'  
import { useForm, Controller } from "react-hook-form";
import { MultiSelectField, MultiSelectImgField} from "../util/Inputs";
import { getLeaders } from '../util/APIUtils';
import { Button, Form, Drawer } from 'antd';
import {  DIFFICULTIES } from '../constants';
import useIsMountedRef from '../hooks/useIsMountedRef'
import './SearchBar.css';

function SearchBar (props) {
    
    const {handleSubmit, control } = useForm();
   // const [taskTypes, setTaskTypes]= useState([]);
    const [leaders, setLeaders] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const isMountedRef = useIsMountedRef();

    useEffect(() => {         
        // getTaskTypes().then(res =>{
        //     setTaskTypes(res.data);
        // })
        getLeaders().then((res)=>{
            if(isMountedRef.current)
            setLeaders(res.data);
            });
      
     }, []);  
     const onSubmit = (data)=>{       
        props.setSearchData(data);
     }
   
 
        return (
        
            <div> 
                <div className="filters-wrap" onClick={()=>setIsVisible(!isVisible)}>
                <img alt='filters' className="filters-img" src="/gallery/filters.png"/>
                <div className="filters-text">FILTERS</div> 
                </div>
                    <Drawer
        title="Filter tasks"
        placement="right"
        closable={false}
        onClose={()=>setIsVisible(!isVisible)}
        visible={isVisible}
        >
            <Form onFinish={handleSubmit(onSubmit)}>
                        <Form.Item className="filter-form-row">
                        Difficulty:                        
                        <Controller
					    as={MultiSelectField(DIFFICULTIES, 'multiple', true)}
                        name='difficulty'
                        className="filter-form-row"
					    control={control}/>
                        </Form.Item>  
                        <Form.Item className="filter-form-row">
                        Player:  <br/>
                        {leaders.length>0?<Controller
					    as={MultiSelectImgField(leaders, 'multiple', true)}
					    name='leaderPl'
					    control={control}/>:null}
                        </Form.Item>                          
                        <Form.Item className="filter-form-row">
                        Opponent: 
                        {leaders.length>0?<Controller
					    as={MultiSelectImgField(leaders, 'multiple', true)}
					    name='leaderOpp'
					    control={control}/>:null}
                        </Form.Item>     
                        <Button type='primary' className="filter-button" htmlType='submit'>Filter Out</Button>                                          
                </Form>
                </Drawer>
            </div>
        );
    }

export default SearchBar;