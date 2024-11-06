import React, {useState, useEffect} from 'react';
import { Button, Form, Input, Select} from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from "react-router-dom";
import { IRegister } from '../interfaces/IRegister';
import { useUserStore } from '../stores/user.store';
import AuthorizeApi from "../api/authorizeApi";
import { LockOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';
import { SpecialityMapping } from '../asset/specs';

export const Register: React.FC = () => {

    const navigate = useNavigate();
    const [state, actions] = useUserStore();
    const [chosenRole, setChosenRole] = useState("");
    const [chosenSpec, setChosenSpec] = useState(0);
    let authService = new AuthorizeApi();

    const roles = ['Patient', 'Therapist'];

    useEffect(() => {
        actions.getAllRoles();
    }, []);

    const register = async (values: IRegister) => {
        const regForm : IRegister = {firstname: values.firstname, fathername: values.fathername, lastname: values.lastname,
                                     email: values.email, password: values.password,
                                     confirmPassword: values.confirmPassword, roleName: values.roleName,
                                     specialityId: chosenSpec};
        console.log(regForm);
        authService.register(regForm);
        navigate("../", { replace: true });
    }

    const login = () => {
        navigate("../", { replace: true });
    } 
    
    const handleSelectRole = (value : any) => {
        setChosenRole(value);
    } 

    const handleSelectSpec = (value : any) => {
        var id = getSpecialityValue(value);
        console.log(id);
        console.log(value);
        setChosenSpec(id);
    }

    const getSpecialityValue = (specialityName: string): number => {
        return SpecialityMapping[specialityName];
    }

    return (
        <div> 
        <Form 
          onFinish = {register}>

            <Form.Item>
                <h1 style = {{marginTop: "2%"}}> Register </h1>
            </Form.Item>

            <Form.Item
                name="firstname"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: 'Please input your name'
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder={'Name'} 
                                style={{ width: 400 }}/>
            </Form.Item>
            
            <Form.Item
                name="lastname"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: 'Please input your surname'
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder={'Surname'} 
                                style={{ width: 400 }}/>
            </Form.Item>

            <Form.Item
                name="fathername"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: 'Please input your fathername'
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder={'Fathername'}
                                style={{ width: 400 }}/>
            </Form.Item>


            <Form.Item
                name="email"
                rules={[
                {
                    max: 50,
                    message: 'Email address shoud be lesser than 50 chars'
                },
                {
                    required: true,
                    message: 'Please input your E-mail'
                },
                {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                }
                ]}
                hasFeedback>
                <Input placeholder={'Email'}
                       style={{ width: 400 }}
                       prefix={<MailOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        min: 8,
                        message: 'Password must contain at least 8 chars'
                    },
                    {
                        max: 25,
                        message: 'Password must contain maximum 25 chars'
                    },
                    {
                        required: true,
                        message: 'Please input your Password'
                    },
                    {
                        pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
                        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number'
                    }
                ]}
                hasFeedback>
                <Input.Password placeholder={'Password'}
                                prefix={<LockOutlined className="site-form-item-icon" />} 
                                style={{ width: 400 }}/>
            </Form.Item>


            <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                {
                    max: 30,
                    required: true
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  })
                ]}>
                <Input.Password 
                 prefix={<LockOutlined className="site-form-item-icon" />} 
                 placeholder={'Confirm Password'}
                 style={{ width: 400}}/>
            </Form.Item>

            
            <Form.Item
                name="roleName"
                rules={[
                {
                    max: 20,
                    required: true,
                    message: 'Please select Role!'
                },
                ]}>

                <Select
                    defaultValue={"Role"}
                    style={{ width: 150, marginTop: '25px' }}
                    onChange={handleSelectRole}
                    options={roles.map((role : string) => ({ label: role, value: role }))}
                />
            </Form.Item>


            {(chosenRole == "Therapist") ?  
             <Form.Item
                name="speciality">
                <div>
                    <Select
                        style={{ width: 150 }}
                        options= {state.specs.map((role : string) => ({ label: role, value: role }))}
                        defaultValue = {"Speciality"}
                        onChange={handleSelectSpec}
                    />
                    <br></br>
                </div>
            </Form.Item>
             : <br></br>}
           
            <Form.Item shouldUpdate>
                {() => (
                <Button
                    type="primary"
                    htmlType="submit">
                    Register
                </Button>
                )}
            </Form.Item>

            <Form.Item>
                <Link onClick={login}>Sign in</Link>
            </Form.Item>
     </Form>
    </div>
    );
 };