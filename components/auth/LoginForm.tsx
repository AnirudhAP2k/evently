import React from 'react'
import { CardWrapper } from './card-wrapper'

const LoginForm = () => {
  return (
    <>
        <CardWrapper
            headerLabel="Welcome back"
            backButonLabel="Don't have an account"
            backButonHref="/auth/signup"
            showSocial
        >
            Login Form
      </CardWrapper>
    </>
  )
}

export default LoginForm
