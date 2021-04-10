import React from "react";
import {Input} from "@chakra-ui/react";

const EditableCell = ({
  value: initialValue,
  row: {index},
  column: {id},
  updateMyData,
  isReadOnly,
  inputId
  // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
  }

  // const makeEditable = (event) => {
  //   event.preventDefault()
  //   setReadOnly(false)
  // }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <Input
      id={inputId}
      backgroundColor={isReadOnly ? "none" : "blue.100"}
      isReadOnly={isReadOnly}
      // onDoubleClick={makeEditable}
      // onTouchStart={makeEditable}
      value={value}
      border={"none"}
      onChange={onChange}
      onBlur={onBlur}/>
}

export default EditableCell