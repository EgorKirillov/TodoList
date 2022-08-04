import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)
    
    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }
    
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) setError(null);
        if (e.charCode === 13) {
            addItem();
        }
    }
    const iconColor = props.disabled ? "disabled" :"inherit"
    const buttonColor = props.disabled ? "grey" :"deeppink"
    
    return <div>
        <TextField size={"small"}
                   color={"primary"}
                   placeholder={"enter name"}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? "error" : ""}
                   error={!!error}
                   helperText={error && "Title required"}
                   disabled={props.disabled}
        />
        <Button onClick={addItem} disabled={props.disabled} style={{color: buttonColor}}><AddIcon fontSize={"small"} color={iconColor} />add</Button>
        
        {/*{error && <div className="error-message">{error}</div>}*/}
    </div>
})
