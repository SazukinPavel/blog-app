import {Button, Form, Input, Typography} from "antd";
import Title from "antd/es/typography/Title";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../store";
import {login as loginThunk} from "../store/slices/authSlice";


function Login() {
    const {isAuthError, isAuthorize, isAuthLoading} = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const [form] = Form.useForm<{ login: string; password: string }>();

    const [passwordVisible, setPasswordVisible] = useState(false);


    const loginValue = Form.useWatch('login', form);
    const passwordValue = Form.useWatch('password', form);
    const navigate = useNavigate()

    const login = () => {
        dispatch(loginThunk({login: loginValue, password: passwordValue}))
    }

    useEffect(() => {
        if (isAuthorize) {
            navigate('/')
        }
    }, [isAuthorize])

    return (
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            flexDirection: 'column'
        }}>
            <Title className="h1">Login</Title>
            {
                isAuthError &&
                <Typography style={{color: 'red'}}>{isAuthError}</Typography>
            }
            <>
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item name="login" label="Login">
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item name="password" label="Password">
                        <Input.Password size="large"
                                        placeholder="input password"
                                        visibilityToggle={{
                                            visible: passwordVisible,
                                            onVisibleChange: setPasswordVisible
                                        }}
                        />
                    </Form.Item>
                </Form>
                <div>
                    <Button onClick={() => navigate('/register')} style={{margin: 5}} size="large">To register</Button>
                    <Button loading={isAuthLoading} onClick={login} style={{margin: 5}} size="large">Login</Button>
                </div>
            </>
        </div>
    )
}

export default Login