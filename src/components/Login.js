import React, { useState } from 'react'
import { GoogleLogin,GoogleLogout } from 'react-google-login'

const clientId = process.env.REACT_APP_CLIENT_ID
export const Login = ({isLoggedIn,setIsLoggedIn,setDocuments,listFiles}) => {
    
    const onSuccess = (response) => {
        setIsLoggedIn(true)
        listFiles()
        console.log('Login Successful', response.profileObj)
    }
    const onFailure = (response) => {
        console.log('Login Failed', response)
    }
    
    return (
        <div className={!isLoggedIn?'flex justify-center items-center h-screen':'flex justify-end'}>
            {
                isLoggedIn ? 
                <GoogleLogout
                    clientId={clientId}
                    buttonText="Logout"
                    onLogoutSuccess={() => {
                        setIsLoggedIn(false)
                        setDocuments([])
                    }
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
