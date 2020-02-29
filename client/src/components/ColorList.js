import React, { useState, useEffect } from "react";
import axiosWithAuth from '../utils/axiosWithAuth';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Form = styled.form`
  margin: 40px auto;
  

`
const Input = styled.input`
  margin: 5px auto;
`

const Button = styled.button`
  margin: 5px auto;
`


const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  // const { id } = useParams(); 
  // console.log('ColorToEdit Id value: ', colorToEdit.id)

  const [newColor, setNewColor] = useState({
    color: '',
    code: { hex: '' }
  });

  // console.log('Color to Edit: ', colorToEdit);
  // console.log('ID created with useParams :', id);
  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  // useEffect(() => {
  //   if (colorToEdit) {
  //     setColorToEdit(colorToEdit);
  //   }
  // }, [colors, colorToEdit.id])

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    // console.log('this is the id in ColorList: ', id);
    axiosWithAuth()
    .put(`api/colors/${colorToEdit.id}`, colorToEdit)
    .then(res => {
      console.log('SaveEdit response: ', res)
      setColorToEdit(res.data);
      const editedColors = colors.map(col => {
        return col.id === res.data.id ? res.data : col
        
        // if(col.id === res.data.id) {
        //   return res.data;
        // } else {
        //   return col;
        // }
      })
        updateColors(editedColors);
    })
    .catch(err => console.log(err));
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    console.log('color being deleted: ', color);
    console.log('deleting color :(');
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then(res => {
        console.log('delete color response: ', res)
        const updatedColors = colors.filter(col => col.id !== color.id);
        updateColors(updatedColors);
        console.log('updated colors: ', updatedColors)
      })
      .catch(err => console.log(err));
  };

  const addColorNameChanges = e => {
    setNewColor({
      ...newColor,
      [e.target.name]: e.target.value
    });
  };

  const addColorHexChanges = e => {
    setNewColor({
      ...newColor,
      [e.target.name]: { hex: e.target.value }
    })
  }

  const addColorSubmit = e => {
    e.preventDefault();
    axiosWithAuth()
      .post('/api/colors', newColor)
      .then(res => {
        console.log('addcolorsubmit post request response', res);
        updateColors(res.data);
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <form onSubmit={addColorSubmit}>
        <legend>add new color</legend>
        <label>color name:
          <input
          text='text'
          name='color'
          placeholder='color name'
          value={newColor.name}
          onChange={addColorNameChanges}
        />
        </label>
        <label>
          hex code:
         <input 
          text='text'
          name='code'
          placeholder='hex value'
          value={newColor.code.hex}
          onChange={addColorHexChanges}
        />
        </label>
        <div className="button-row">
        <button>Add New Color</button>
        </div>
      </form>
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
      
    </div>
  );
};

export default ColorList;
