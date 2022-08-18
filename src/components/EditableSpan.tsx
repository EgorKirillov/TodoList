import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    disableEditMode?:boolean
}

export function EditableSpan({value,onChange,disableEditMode=false}: EditableSpanPropsType) {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(value);
    
    const activateEditMode = () => {
        if (!disableEditMode) {
            setEditMode(true);
            setTitle(value);
        }
    }
    const activateViewMode = () => {
        setEditMode(false);
        onChange(title);
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    
    return editMode
        ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode}/>
        : <span onDoubleClick={activateEditMode}>{value}</span>
}
