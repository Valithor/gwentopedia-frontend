import React from 'react';
import DataTable from './DataTable';
import { postTaskType, getRawCards, createCard } from '../../util/APIUtils';
import { inputField} from "../../util/Inputs";
import { Tabs, Button, Row, Modal, Form, notification} from 'antd';
import { useForm, Controller } from "react-hook-form";
import { useState} from 'react';
import NotFound from '../../common/NotFound';
import './Profile.css';

function AdminPanel(props) {
    const [isVisible, setIsVisible] = useState(false);
    const { handleSubmit, control, errors} = useForm();
    const handleAddCards=()=>{
        if (window.confirm('Click this only after balance changes! Heavy process'))
        getRawCards().then((res)=>{    
        for (const card of Object.keys(res.data)) {
          const{id, ...data}=res.data[card];
          if(data.category!=="Leader")
          createCard(data);
          }    
          console.log("Cards have been added");
        })
      }

      const onSubmit =(data) => {
          postTaskType(data).then(res=>{
            setIsVisible(!isVisible);
            notification.success({
                message: 'Gwentopedia',
                description: 'Task type has been added.'
            }); 
          }).catch(error => {                
            notification.error({
                message: 'Gwentopedia',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });              
            });
    }
    if(!props.currentUser)
        return <NotFound/>
    if(!props.currentUser.authorities.some(a=> a.authority==="ROLE_ADMIN"))
        return <NotFound/>

        return (
            <div className="profile"> <Row>    
                            <Button type='primary' className="buttons" onClick={()=>setIsVisible(!isVisible)}>Add Task Type</Button>
                            <Button type='primary' className="buttons" onClick={()=>handleAddCards()}>Add Cards</Button>                                                             
                            </Row>
                            <div className="admin-panel-details">    
                                <Tabs defaultActiveKey="1" 
                                    animated={true}
                                    size="large"
                                    className="profile-tabs">
                                    <Tabs.TabPane tab={`Tasks`} key="1">
                                        { <DataTable username={props.match.params.username} type="tasks" /> }
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={'Users'}  key="2">
                                        <DataTable username={props.match.params.username} type="users" />
                                    </Tabs.TabPane>
                                </Tabs>
                            </div>   
                            <Modal title="Adding Task type" onOk={handleSubmit(onSubmit)}
                            visible={isVisible} onCancel={()=>setIsVisible(!isVisible)}>
                            <Form className="create-task-form">                      
                     
						<Form.Item className="task-form-row">
                        <Controller
					    as={inputField("Name")}
				    	name='name'
				    	control={control}
                        defaultValue=''
                        rules={{ required: true }}
				        />
                        {errors.name && (
					    <span className='error'>This field is required</span>)}

                        </Form.Item>						
            </Form>
                                </Modal>                                      
            </div>
        );
    
}

export default AdminPanel;