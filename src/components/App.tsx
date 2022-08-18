import React, {useEffect} from 'react';
import '../App.css';
import {AppRootStateType} from "../state/store";
import {useSelector} from "react-redux";
import {RequestStatusType} from "../state/app-reducer";
import {ErrorSnackbar} from "./ErrorSnackbar/ErrorSnackbar";
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import {Login} from "../features/Login";
import TodolistList from "./TodolistList";
import {useAppDispatch} from "../app/hooks";
import {initializeAppTC, logoutTC} from "../state/auth-reducer";
import LinearProgress from '@mui/material/LinearProgress';
import AppBar from '@material-ui/core/AppBar';
import Menu from '@material-ui/icons/Add';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

function App() {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    
    const onClickLogin = () => {
        navigate("/Login")
    }
    const onClickLogout = () => {
        dispatch(logoutTC())
    }
    
    useEffect(() => {
        dispatch(initializeAppTC())
    }, [dispatch])
    
    // крутилка пока не ясно залогинен или нет ( непроинициализирован)
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <div>
                        {!isLoggedIn ?
                            <Button color="inherit" variant={"outlined"} onClick={onClickLogin}>LogIn</Button>
                            : <Button color="inherit" variant={"outlined"} onClick={onClickLogout}>LogOut</Button>}
                    </div>
                </Toolbar>
            </AppBar>
            { status === "loading" && <LinearProgress color="primary" />}
            <Container fixed>
                <Routes>
                    <Route path="/TodolistList" element={<TodolistList/>}/>
                    <Route path="/" element={<TodolistList/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/404" element={<h1>page not found</h1>}/>
                    <Route path="*" element={<Navigate to="/404"/>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
