import React, { Component } from 'react';
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  FormControlLabel,
  Switch,
  DialogTitle,
  DialogContent,
  Icon,
  IconButton,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { generateRandomId } from "utils";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/views/_style.scss";
import EditorForm from "./EditorForm";
import { addNew, update } from "./IntroduceTheProgramService";
import IntroduceTheProgramDialogTab from "./IntroduceTheProgramDialogTab";
import Checkbox from '@material-ui/core/Checkbox';


class IntroduceTheProgramDialogInfomation extends Component {

  componentWillMount() {
    let { open, handleClose, item ,isRoleAdmin,isView } = this.props;
    this.setState({
      item: item,
    })
  }

    handleChange = (event, source) => {
        let {item} = this.state
        if(item == null){
          item = {}
        }
        let name = event.target.name
        let value = event.target.value
        if (source == "checked") {
          item["active"] = event.target.checked;
          this.setState({item:item})
          return
        }
        item[name] = value
        this.setState({
          item: item
        });
    
      };
      handleChangeContent = (content) => {
        let {item} = this.state
        item["content"] = content;
        this.setState({ item: item });
      };
    render() {
        let {t} = this.props;
        let {item} = this.state;
        return (
            <div>
                <Grid className="mb-8" container spacing={4}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("Code")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={item.code ? item.code : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
                <TextValidator
                  className="w-100 mb-16"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("Name")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={item.name ? item.name : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.active ? true : false}
                      onChange={(e) => this.handleChange(e, "checked")}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label={t("isShow")}
                /> */}
                <EditorForm
                  content={item.content ? item.content : ""}
                  handleChangeContent={this.handleChangeContent}
                />
              </Grid>
            </Grid>
            </div>
        );
    }
}

export default IntroduceTheProgramDialogInfomation;