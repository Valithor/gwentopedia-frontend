import React, {useState} from "react";
import { Form, Col, Input, Select, Switch, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import '../task/NewTask.css';  
const { Option } = Select;
const FormItem = Form.Item;

export const inputField = (placeholder, blur=null) => {
	return <Input onBlur={blur} placeholder={placeholder} />;
};

export const SelectImgField = (defaultValue, datas, mode, allowClear) => {
	return (
		<Select showSearch defaultValue={defaultValue} mode={mode} allowClear={allowClear} style={{ width: 200 }}>
			{datas.map((data, index) => {
				return (
					<Option value={data.name} key={index}>
						<img alt={data.name} className='select-leader' src={`/leaders/${data.imgurl}.png`} /> {data.name}
					</Option>
				);
			})}
		</Select>
	);
};

export const SelectField = (defaultValue, values, mode, allowClear) => {
	return (
		<Select defaultValue={defaultValue} mode={mode} allowClear={allowClear} style={{ width: 200 }}>
			{values.map((value, index) => {
				return (
					<Option value={value.name} key={index}>
						{value.name}
					</Option>
				);
			})}
		</Select>
	);
};

export const MultiSelectField = (values, mode, allowClear) => {
	return (
		<Select mode={mode} allowClear={allowClear} style={{ width: 200 }}>
			{values.map((value, index) => {
				return (
					<Option value={value.name} key={index}>
						{value.name}
					</Option>
				);
			})}
		</Select>
	);
};
export const MultiSelectImgField = (datas, mode, allowClear) => {
	return (
		<Select mode={mode} allowClear={allowClear} style={{ width: 200 }}>
			{datas.map((data, index) => {
				return (
					<Option value={data.name} key={index}>
						<img alt={data.name} className='select-leader' src={`/leaders/${data.imgurl}.png`} /> {data.name}
					</Option>
				);
			})}
		</Select>
	);
};

export const SwitchField = () => {
	return <Switch defaultChecked style={{maxWidth:50}}/>;
};

export const TaskCardForm = (props)=>{
	const { handleSubmit, control} = useForm();
	const [isVisible, setIsVisible] = useState(true);
	const sides = [{name: "Player Hand"}, {name: "Player Ranged"}, {name: "Player Melee"}, {name: "Opp Melee"}, {name: "Opp Ranged"}];

	const cancel = () => {
		setIsVisible(false);
		props.handleCancel();
	}	
	const onSubmit =(data) => {
		props.addTaskCard(data);
	}

	return (
		<div className="new-task-content">                                     
        <Modal
          title={props.card.name}
          visible={isVisible}
          onOk={handleSubmit(onSubmit)}
          onCancel={cancel}
        >
          <Form className="create-task-form">                      
                        <FormItem className="task-form-row-white">
                        <Col xs={24} sm={4}>
                                Display: 
                        </Col>
                        <Controller
					    as={SelectField(sides[0].name, sides)}
					    name='side'
					    control={control}
                        defaultValue={sides[0].name}
                        rules={{ required: true }}/>
                        </FormItem>    
                        <FormItem className="task-form-row">
                        <Controller
					    as={inputField("Answer to be displayed when user picks this card")}
				    	name='answer'
				    	control={control}
				    	defaultValue=''
				        />
                        </FormItem>
						<FormItem className="task-form-row">
                        <Controller
					    as={inputField("Strength")}
				    	name='strength'
				    	control={control}
				    	defaultValue=''
				        />
                        </FormItem>
						<Form.Item className="task-form-row-white">
                        <Col xs={24} sm={4}>
                                Correct Answers:
                        </Col>
                        <Controller
					    as={MultiSelectField(sides, 'multiple', true)}
                        name='correct'
                        className="task-form-row"
					    control={control}/>
                        </Form.Item>  
            </Form>
        </Modal>
                </div>
	)
};