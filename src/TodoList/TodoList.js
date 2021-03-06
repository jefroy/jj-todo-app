import React, {useState} from 'react'
import './TodoList.css';
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import db from '../firebase';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from "@material-ui/core/Modal";
import EditIcon from '@material-ui/icons/Edit';
import makeStyles from "@material-ui/core/styles/makeStyles";
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import UndoIcon from '@material-ui/icons/Undo';
import firebase from "firebase";

function TodoList(props) {
    // console.log('props: ', props);

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');

    function handleClose() {
        setOpen(false);
    }
    function handleOpen() {
        setOpen(true);
    }
    function updateToDo(){
        // update task name with new text
        db.collection('todos').doc(props.id).set({
            taskName: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }, {
            merge: true // prevent overriding existing data
        })
        handleClose();
    }
    function completeTodo(){
        // console.log('completeTodo: says hi')
        // mark a task as completed and update the completed date
        db.collection('todos').doc(props.id).set({
            completedDate: firebase.firestore.FieldValue.serverTimestamp()
        }, {
            merge: true // prevent overriding existing data
        })
    }
    function undoComplete(){
        // console.log('completeTodo: says hi')
        // mark a task as completed and update the completed date
        db.collection('todos').doc(props.id).update({
            completedDate: firebase.firestore.FieldValue.delete(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }, {
            merge: true // prevent overriding existing data
        });
    }

    // styles hook https://www.positronx.io/create-react-modal-popup-with-material-ui/
    const useStyles = makeStyles(theme => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            position: 'absolute',
            width: 450,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

    const classes = useStyles();

    function getDateFromProp() {
        // console.log(props);
        if (props.taskCompletedDate){
            return "Completed on: " + props.taskCreatedDate.toDate().toString().substr(0, 15);
        } else if (props.taskCreatedDate){
            return "Created: " + props.taskCreatedDate.toDate().toString().substr(0, 15)
        }
        else{
            return "❌Could not fetch date 😢";
        }
    }

    return (
    <div className="todoList">
        <> {/* <> is a react fragment */}
        <Modal
            className={classes.paper}
            open={open} // state to determine if the modal is open or not
            onClose={handleClose} // function to handle closing the modal
        >
            <div>
                <h1>Edit Task</h1>
                <input
                    type="text"
                    value={input}
                    onChange={event => setInput(event.target.value)}
                    placeholder={props.taskName}
                />
                <Button onClick={event => updateToDo()}>Update Task</Button>
            </div>
        </Modal>

        <List className={"todo__list"}>
            <ListItem>
                <ListItemText
                    className="todoList"
                    primary={props.taskName.substr(0, 20) }
                    secondary={ // use ternary operator to sync with db ;)
                        getDateFromProp()
                    }
                />
            </ListItem>
            <EditIcon type="button" onClick={event => handleOpen()}/>
            <DeleteIcon onClick={event => db.collection('todos').doc(props.id).delete()}/>
            {!props.taskCompletedDate && <DoneOutlineIcon onClick={event => completeTodo()}/>}
            {props.taskCompletedDate && <UndoIcon onClick={event => undoComplete()}/>}
        </List>
        </>

    </div>
  )
}

export default TodoList
