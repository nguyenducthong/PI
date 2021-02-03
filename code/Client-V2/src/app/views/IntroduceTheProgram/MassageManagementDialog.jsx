import React, { Component } from "react";
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
import { addNew, update, checkCode } from "./IntroduceTheProgramService";
import IntroduceTheProgramDialogTab from "./IntroduceTheProgramDialogTab";
import Checkbox from "@material-ui/core/Checkbox";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

//Dialog của bài viết
class MassageManagementDialog extends Component {
  componentWillMount() {
    let { open, handleClose, item, isRoleAdmin, isView } = this.props;
    this.setState({
      item: item,
    });
  }

  handleChange = (event, source) => {
    let { item } = this.state;
    if (item == null) {
      item = {};
    }
    let name = event.target.name;
    let value = event.target.value;
    if (source == "checked") {
      item["active"] = event.target.checked;
      this.setState({ item: item });
      return;
    }
    item[name] = value;
    this.setState({
      item: item,
    });
  };
  handleChangeContent = (content) => {
    let { item } = this.state;
    item["content"] = content;
    this.setState({ item: item });
  };
  handleFormSubmit = () => {
    let { id } = this.state.item;
    let { code } = this.state.item;
    let { t } = this.props;
    checkCode(id, code).then((result) => {
      if (result.data) {
        toast.warning(t("mess_code"));
      } else {
        if (!id) {
          addNew(this.state.item).then(({ data }) => {
            if (data != null && data.id != null) {
              id = data.id;
              this.setState({ item: data });
            }
            toast.success(t("mess_add"));
          });
        } else {
          update(this.state.item).then(({ data }) => {
            toast.success(t("mess_edit"));
          });
        }
      }
    });
  };
  render() {
    let { t } = this.props;
    let { item } = this.state;
    let { handleClose, handleEditOk, open, isView } = this.props;
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20 styleColor">
            {this.state.item.id ? t("update") : t("Add")}
          </span>
          <IconButton
            style={{ position: "absolute", right: "10px", top: "10px" }}
            onClick={() => handleClose()}
          >
            <Icon color="error" title={t("close")}>
              close
            </Icon>
          </IconButton>
        </DialogTitle>
        <div>
          <ValidatorForm
            ref="form"
            onSubmit={this.handleFormSubmit}
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <DialogContent dividers>
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.active ? true : false}
                        onChange={(e) => this.handleChange(e, "checked")}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={t("isShow")}
                  />
                  <EditorForm
                    content={item.content ? item.content : ""}
                    handleChangeContent={this.handleChangeContent}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions spacing={4} className="flex flex-end flex-middle">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.props.handleClose()}
              >
                {t("Cancel")}
              </Button>
              <Button variant="contained" color="primary" type="submit">
                {t("Save")}
              </Button>
            </DialogActions>
          </ValidatorForm>
        </div>
      </Dialog>
    );
  }
}

export default MassageManagementDialog;
