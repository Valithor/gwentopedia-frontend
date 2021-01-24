import React from 'react';
import { signup, checkUsernameAvailability, checkEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { inputField} from "../../util/Inputs";
import { useForm, Controller } from "react-hook-form";
import { Link } from 'react-router-dom';
import {NAME_MIN_LENGTH, NAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, EMAIL_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH} from '../../constants';

import { Form, Button, notification } from 'antd';

function Signup (props) {
    const {handleSubmit, control, errors } = useForm({mode: 'onBlur',
});
 
    const onSubmit = (data) => {
        signup(data)
        .then(response => {
            notification.success({
                message: 'Gwentopedia',
                description: "Thank you! You're successfully registered. Please Login to continue!",
            });          
            props.history.push("/login");
        }).catch(error => {
            notification.error({
                message: 'Gwentopedia',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

     const isFormInvalid =() =>{   
        return errors.gogName||errors.username||errors.email||errors.password;
     }
  
        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>
                <div className="signup-content">
                <Form onFinish={handleSubmit(onSubmit)} className="signup-form">
                        <Form.Item>
                        <h3 className="label">Gog Name</h3>
				        <Controller
					    as={inputField("Your Gog name")}
				    	name='name'
				    	control={control}
				    	defaultValue=''
                        rules={{ required: 'Gog name is required',
                        maxLength: {value: NAME_MAX_LENGTH,  message: `GOG name is too long (Minimum ${NAME_MAX_LENGTH} characters needed)`},
                        minLength: {value: NAME_MIN_LENGTH, message: `GOG name is too short (Maximum ${NAME_MIN_LENGTH} characters allowed)`}}}/>
				        {errors.name && (<span className='error'>{errors.name.message}</span>)}
                        </Form.Item> 
                        <Form.Item>
                        <h3 className="label">Username</h3>
				        <Controller
					    as={inputField("A unique username")}
				    	name='username'
				    	control={control}
				    	defaultValue=''
                        rules={{ required: 'Username is required', 
                        maxLength: {value: USERNAME_MAX_LENGTH,  message: `Username is too long (Minimum ${USERNAME_MAX_LENGTH} characters needed)`},
                        minLength: {value: USERNAME_MIN_LENGTH, message: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed)`},
                        validate: {usernameAvailability: async value => await checkUsernameAvailability(value).then(response=>{
                            return response.data.available || 'This username is already taken'}) }}}/>
				        {errors.username && (<span className='error'>{errors.username.message}</span>)}
                        </Form.Item> 
                        <Form.Item>
                        <h3 className="label">Email</h3>
				        <Controller
					    as={inputField("A unique email")}
				    	name='email'
				    	control={control}
				    	defaultValue=''
                        rules={{ required: 'Email is required', 
                        pattern: {value:/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: 'Email not valid'},
                        maxLength: {value: EMAIL_MAX_LENGTH,  message: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`},
                        validate: {emailAvailability: async value => await checkEmailAvailability(value).then(response=>{
                            return response.data.available || 'This email is already taken'}) }}}/>
				        {errors.email && (<span className='error'>{errors.email.message}</span>)}
                        </Form.Item> 
                        <Form.Item>
                        <h3 className="label">Password</h3>
				        <Controller
					    as={inputField("A password between 6 to 20 characters")}
                        name='password'
                        type="password"
				    	control={control}
				    	defaultValue=''
                        rules={{ required: 'Email is required', 
                        maxLength: {value: PASSWORD_MAX_LENGTH,  message: `Pasword is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed)`},
                        minLength: {value: PASSWORD_MIN_LENGTH, message: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed)`},
                        }}/>
				        {errors.password && (<span className='error'>{errors.password.message}</span>)}
                        </Form.Item>                      
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="signup-form-button"
                                disabled={isFormInvalid()}>Sign up</Button>
                                <div className="label"> Already registed? <Link className="link" to="/login">Login now!</Link></div>
                    </Form>
                </div>
            </div>
        );
    
       // const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
}

export default Signup;