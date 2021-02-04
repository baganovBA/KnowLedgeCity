import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ path, unauthRedirect = '/login', component }) => {

    const [token, setToken] = useState(null)

    useEffect(() => {
        const tmp_token = localStorage.getItem('token')
        checkToken(tmp_token)
    }, path)

    const checkToken = (tmp_token) => {
        fetch('http://localhost:5000/check_token', {
            method: "GET",
            headers: { "Content-type": "application/json", "x-token": tmp_token },
        }).then(async res => {
            if (res.status !== 200) {
                throw await res.json()
            }
            return res.json()
        })
            .then((data) => {
                setToken(true)
            })
            .catch(error => {
                console.log('error', error)
                setToken(false)
            })
    }

    return (
        <>
            {
                token === null ? (<div>loading...</div>) :
                    token ? (<Route path={path} component = {component} />) : (<Redirect from={path} to={unauthRedirect} />)
            }
        </>
    )
}

export default PrivateRoute
