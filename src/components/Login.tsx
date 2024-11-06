import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import AuthorizeApi from "../api/authorizeApi";
import AuthLocalStorage from "../AuthLocalStorage";
import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { LockOutlined, MailOutlined} from '@ant-design/icons';

export const Login: React.FC = () => {
    const [form] = Form.useForm();
    let authService = new AuthorizeApi();
    let user: any;
    const navigate = useNavigate();

    const register = () => {
        navigate("../register", { replace: true });
    } 

    const login = async (values: any) => {
        await authService.login(values);
        const token = AuthLocalStorage.getToken() as string;
        user = jwtDecode(token);

        if(user){
            navigate("../main", { replace: true });
            window.location.reload();
        } 
    }

    return (
        <div> 
            <h1 style = {{marginBottom: "2%"}}> {"Login"} </h1>
            <div className="create">
            <Form 
             form={form}
             onFinish={login}
            >
                <Form.Item
                    name="email"
                    rules={[
                    {
                        max: 50,
                        required: true,
                        message: 'Please input your email' 
                    },
                    ]}>
                    <Input placeholder = {'Email'}
                           style={{ width: 400 }}
                           prefix={<MailOutlined className="site-form-item-icon" />}/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                    {
                        max: 20,
                        required: true,
                        message: 'Please input your password' 
                    }
                    ]}>
                    <Input.Password placeholder = {'Password'}
                                    style={{ width: 400 }}
                                    prefix={<LockOutlined className="site-form-item-icon" />}/>
                </Form.Item>

                <Form.Item shouldUpdate>
                    {() => (
                    <Button
                        type="primary"
                        style={{ background: "#52c41a", borderColor: "green", marginTop: '15px' }}
                        htmlType="submit">
                        Sign in
                    </Button>
                    )}
                </Form.Item>
         </Form>

         <Link onClick={register}>Sign up</Link>
        </div>
    </div>
    );
 };

