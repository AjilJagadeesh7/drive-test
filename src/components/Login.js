import React, { useState } from 'react'
import { GoogleLogin,GoogleLogout } from 'react-google-login'

const clientId = '541384357321-8g5qqjuomn4f7rt0fiebfuf1qg3448e6.apps.googleusercontent.com'
export const Login = ({isLoggedIn,setIsLoggedIn}) => {
    
    const onSuccess = (response) => {
        setIsLoggedIn(true)
        console.log('Login Successful', response.profileObj)
    }
    const onFailure = (response) => {
        console.log('Login Failed', response)
    }
    
    return (
        <div>
            {
                isLoggedIn ? 
                <GoogleLogout
                    clientId={clientId}
                    buttonText="Logout"
                    onLogoutSuccess={() => {
                        console.log('Logout Successful')
                        setIsLoggedIn(false)}
                    }
                />
                :<GoogleLogin 
                    clientId={clientId} 
                    buttonText="Login" 
                    onSuccess={onSuccess} 
                    onFailure={onFailure} 
                    cookiePolicy='single_host_origin' 
                    isSignedIn={true}
                />
            }
            
        </div>
    )
}
