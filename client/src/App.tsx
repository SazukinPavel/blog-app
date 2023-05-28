import React, {useEffect} from 'react';
import {Outlet, useNavigate} from "react-router";
import {Button, Layout} from "antd";
import {Footer} from "antd/es/layout/layout";
import {useAppDispatch, useAppSelector} from "./store";
import Title from "antd/es/typography/Title";
import {me, signOut as signOutAction} from "./store/slices/authSlice";
import './styles/styles.css'

function App() {

    const {
        isAuthorize,
        user,
        isTryAuthLoading
    } = useAppSelector((state) => state.auth)
    const {Header, Content} = Layout;
    const dispatch = useAppDispatch()


    useEffect(() => {
        dispatch(me())
    }, [dispatch])

    let navigate = useNavigate();

    const signOut = () => {
        dispatch(signOutAction())
    }

    if (isTryAuthLoading) {
        return (<div></div>)
    }

    return (
        <div>
            <Layout>
                <Header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end'
                    }}
                >
                    {
                        isAuthorize ?
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Title style={{color: 'white'}}>{user?.login}</Title>
                                <Button onClick={signOut} size="large" type="link">Sign out</Button>
                            </div>
                            : <div>
                                <Button onClick={() => navigate('/')} size="large" type="link">Posts</Button>
                                <Button onClick={() => navigate('/login')} size="large" type="link">Login</Button>
                                <Button onClick={() => navigate('/register')} size="large" type="link">Sign in</Button>
                            </div>
                    }
                    <div>

                    </div>
                </Header>
                <Content className="site-layout">
                    <Outlet></Outlet>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>

        </div>
    )
}

export default App;
