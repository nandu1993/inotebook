import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/notecontext';

const Login = () => {
    let host = process.env.REACT_APP_HOST_URL;
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();
    const context = useContext(noteContext);
    const { showAlert } = context;

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Get all note
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const data = await response.json();
        if (data.success) {
            //set auth token and redirect to home
            localStorage.setItem("authToken", data.authToken);
            showAlert("Logged-in successfully", "success");
            navigate("/");
        } else {
            showAlert("Please enter valid credentials", "danger");
        }
    }

    //on change handler
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    return (
        <>
        <h2>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={credentials.email} name="email" aria-describedby="emailHelp" onChange={onChange} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={credentials.password} name='password' onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </>
    )
}

export default Login
