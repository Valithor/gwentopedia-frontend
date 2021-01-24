import React from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { useForm, Controller } from "react-hook-form";
import { Link } from 'react-router-dom';
import { inputField} from "../../util/Inputs";
import { ACCESS_TOKEN } from '../../constants';
import './Login.css'

import { Form, Button, notification } from 'antd';

function LoginForm (props) {
    const {handleSubmit, control, errors } = useForm();

    const onSubmit=(data)=> {
                login(data)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
                    props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {
                        notification.error({
                            message: 'Gwentopedia App',
                            description: 'Your Username or Password is incorrect. Please try again!'
                        });                    
                    } else {
                        notification.error({
                            message: 'Gwentopedia App',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });                                            
                    }
                });                   
    }    
        return (
            <Form onFinish={handleSubmit(onSubmit)} className="login-form">
                <Form.Item style={{color: "black"}}>
				        <Controller
					    as={inputField("Username or Email")}
				    	name='usernameOrEmail'
                        control={control}
                        size="large"
				    	defaultValue=''
                        rules={{ required: 'Please input your username or email!',
                        }}/>
                        </Form.Item> 
                        {errors.usernameOrEmail && (<span className='error'>{errors.usernameOrEmail.message}</span>)}
                <Form.Item style={{color: "black"}}>
				        <Controller
					    as={inputField("Password")}
                        name='password'
                        size="large"
                        type="password" 
				    	control={control}
				    	defaultValue=''
                        rules={{ required: 'Please input your Password!',
                        }}/>
                        </Form.Item> 
                        {errors.password && (<span className='error'>{errors.password.message}</span>)}                
                <Form.Item style={{color: "black"}}>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    Or <Link className="link" to="/signup">register now!</Link>
                </Form.Item>
            </Form>
        );
    
}

export default LoginForm;