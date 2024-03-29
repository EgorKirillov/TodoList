import React from 'react'

import {Navigate} from 'react-router-dom';
import {FormikHelpers, useFormik} from 'formik';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {loginTC} from "../state/auth-reducer";

import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';

type FormikValuesType = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  
  const formik = useFormik({
    initialValues: {
      email: 'free@samuraijs.com',
      password: 'free',
      rememberMe: false
    },
    validate: (values) => {
      const errors: FormikValuesType = {} as FormikValuesType
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
    onSubmit: async (values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) => {
      // formik.resetForm(); // сбрасывает значения на инициализационные
      const action = await dispatch(loginTC({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
        captcha: true
      }))
      if (loginTC.rejected.match(action)) {
        if (action.payload && action.payload.fieldsErrors) {
          formikHelpers.setFieldError(action.payload.fieldsErrors[0].field, action.payload.fieldsErrors[0].error)
        }
      }
    },
  })
  
  if (isLoggedIn) {
    return <Navigate to={"/"}/>
  }
  
  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel>
            <p>To log in get registered
              <a href={'https://social-network.samuraijs.com/'}
                 target={'_blank'} rel="noreferrer"> here </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          
          <FormGroup>
            <TextField label="Email" margin="normal"
                       {...formik.getFieldProps('email')}
              // заменяет следующие поля: name={"email"};  onChange={formik.handleChange}; value={formik.values.email}; onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && <div style={{color: "red"}}>{formik.errors.email}</div>}
            <TextField type="password" label="Password"
                       margin="normal"
                       {...formik.getFieldProps('password')}
            />
            {formik.errors.password && formik.touched.password ?
              <div style={{color: "red"}}>{formik.errors.password}</div> : null}
            
            <FormControlLabel label={'Remember me'}
                              control={<Checkbox {...formik.getFieldProps('rememberMe')} />}
            />
            
            <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
            
          </FormGroup>
          
        </FormControl>
      </form>
    </Grid>
  </Grid>
}