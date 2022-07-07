import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

type AddItemFormPropsType = {
   addItem: (title: string) => void
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
      />
      <Button onClick={addItem} style={{color: "deeppink"}}><AddIcon fontSize={"small"} color={"inherit"}/></Button>
      
      {/*{error && <div className="error-message">{error}</div>}*/}
   </div>
})
