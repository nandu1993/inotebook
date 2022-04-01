import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/notecontext';

const NoteItem = (props) => {
    const { note, updateNote } = props;
    const context = useContext(noteContext);
    const { deleteNote, showAlert } = context;
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="fa-regular fa-trash-can mx-2" onClick={() => { deleteNote(note._id); showAlert("Note deleted successfully", "success"); }} ></i>
                        <i className="fa-regular fa-pen-to-square" onClick={() => { updateNote(note) }} ></i>
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    )
}

export default NoteItem