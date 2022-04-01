import React, { useContext } from 'react'
import noteContext from '../context/notes/notecontext';

const Alert = (props) => {
    const context = useContext(noteContext);
    const { alert } = context;
    return (
        <div style={{ height: '65px' }}>
            {alert &&
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    <strong>{alert.message}</strong>
                </div>}
        </div>
    )
}

export default Alert
