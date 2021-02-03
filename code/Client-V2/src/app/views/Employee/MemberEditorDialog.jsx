import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getUserById, updateUser, addNewUser } from "./EmployeeService";
import { generateRandomId } from "utils";

class MemberEditorDialog extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    balance: "",
    age: "",
    company: "",
    address: "",
    isActive: false
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }

    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {
    let { id } = this.state;
    if (id) {
      updateUser({
        ...this.state
      }).then(() => {
        this.props.handleClose();
      });
    } else {
      addNewUser({
        id: generateRandomId(),
        ...this.state
      }).then(() => {
        this.props.handleClose();
      });
    }
  };

  componentWillMount() {
    getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
  }

  render() {
    let {
      name,
      email,
      phone,
      balance,
      age,
      company,
      address,
      isActive
    } = this.state;
    let { open, handleClose } = this.props;

    return (
      <Dialog onClose={handleClose} open={open}>
        <div className="p-24">
          <h4 className="mb-20">Update Member</h4>
          <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
            <Grid className="mb-16" container spacing={4}>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label="Name"
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
                <TextValidator
                  className="w-100 mb-16"
                  label="Email"
                  onChange={this.handleChange}
                  type="text"
                  name="email"
                  value={email}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <TextValidator
                  className="w-100 mb-16"
                  label="Phone"
                  onChange={this.handleChange}
                  type="text"
                  name="phone"
                  value={phone}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <TextValidator
                  className="w-100 mb-16"
                  label="Balance"
                  onChange={this.handleChange}
                  type="number"
                  name="balance"
                  value={balance}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label="Age"
                  onChange={this.handleChange}
                  type="number"
                  name="age"
                  value={age}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
                <TextValidator
                  className="w-100 mb-16"
                  label="Company"
                  onChange={this.handleChange}
                  type="text"
                  name="company"
                  value={company}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
                <TextValidator
                  className="w-100 mb-16"
                  label="Address"
                  onChange={this.handleChange}
                  type="text"
                  name="address"
                  value={address}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <FormControlLabel
                  className="my-20"
                  control={
                    <Switch
                      checked={isActive}
                      onChange={event => this.handleChange(event, "switch")}
                    />
                  }
                  label="Active Customer"
                />
              </Grid>
            </Grid>

            <div className="flex flex-space-between flex-middle">
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button onClick={() => this.props.handleClose()}>Cancel</Button>
            </div>
          </ValidatorForm>
        </div>
      </Dialog>
    );
  }
}

export default MemberEditorDialog;
