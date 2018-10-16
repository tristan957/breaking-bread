import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import React from "react";
import './FormExample.css'

class FormExample extends React.Component {
    render() {
      return (
        <form className={"test"}>
          <FormGroup controlId="formBasicText">
            <ControlLabel>Search</ControlLabel>
            <FormControl type="text" placeholder="Enter text" />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      );
    }
  }
  
export default FormExample;