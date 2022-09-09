import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from 'formik';
import {useAppDispatch} from "../app/hooks";
import {loginTC} from "../state/auth-reducer";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import { Navigate } from 'react-router-dom';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn=useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    
    const formik = useFormik({
        initialValues: {
            email: 'free@samuraijs.com',
            password: 'free',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length <= 3) {
                errors.password = 'Length min 4 symbol'
            }
            return errors
        },
        onSubmit: values => {
            formik.resetForm(); // сбрасывает значения на инициализационные
            dispatch(loginTC({email:values.email, password: values.password, rememberMe: values.rememberMe, captcha:true}))
        },
    })
    
    if (isLoggedIn) {return <Navigate to={"/"} />}
    
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email" margin="normal"
                                   {...formik.getFieldProps('email')}
                            // заменяет следующие поля:
                            
                            // name={"email"}
                            // onChange={formik.handleChange}
                            // value={formik.values.email}
                            // onBlur={formik.handleBlur}
                        />
                        {formik.errors.email && formik.touched.email ?
                            <div style={{color: "red"}}>{formik.errors.email}</div> : null}
                        <TextField type="password" label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps('password')}
                        
                        />
                        {formik.errors.password && formik.touched.password ?
                            <div style={{color: "red"}}>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox {...formik.getFieldProps('rememberMe')} />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}