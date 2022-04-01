import { useState } from "react";
import NoteContext from "./notecontext";

const NoteState = (props) => {
    //const host = "http://localhost:5000";
    const host = process.env.REACT_APP_HOST_URL;
    const initialNotes = [];

    const [notes, setNotes] = useState(initialNotes);
    const [alert, setAlert] = useState(null);

    //Get all note
    const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "authToken": localStorage.getItem("authToken")
            }
        });
        const data = await response.json();
        setNotes(data.notes);
    }

    //Add note
    const addNote = async (title, description, tag) => {
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "authToken": localStorage.getItem("authToken")
            },
            body: JSON.stringify({ title, description, tag })
        });

        const data = await response.json();
        setNotes(notes.concat(data.notes));
    }

    //Delete Note
    const deleteNote = async (id) => {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "authToken": localStorage.getItem("authToken")
            }
        });

        getNotes();
    }

    //Edit Note
    const editNote = async (id, title, description, tag) => {
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "authToken": localStorage.getItem("authToken")
            },
            body: JSON.stringify({ title, description, tag })
        });
        getNotes();
    }

    const showAlert = (text, type) => {
        setAlert({
            message: text,
            type: type
        })

        setTimeout(() => {
            setAlert(null)
        }, 2000);
        //showAlert("Dark mode enabled", "success")
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes, showAlert, alert }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;