import {Button, Form, Input, Typography} from "antd";
import Title from "antd/es/typography/Title";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../store";
import {register as registerThunk} from "../store/slices/authSlice";


function Register() {

    const {isAuthError, isAuthorize, isAuthLoading} = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const [form] = Form.useForm<{ login: string; password: string }>();

    const [passwordVisible, setPasswordVisible] = useState(false);


    const loginValue = Form.useWatch('login', form);
    const passwordValue = Form.useWatch('password', form);
    const navigate = useNavigate()

    const register = () => {
        dispatch(registerThunk({login: loginValue, password: passwordValue}))
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
            <Title className="h1">Register</Title>
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
                    <Button onClick={() => navigate('/login')} style={{margin: 5}} size="large">To login</Button>
                    <Button onClick={register} loading={isAuthLoading} style={{margin: 5}} size="large">Sign in</Button>
                </div>
            </>
        </div>
    )
}

export default Register