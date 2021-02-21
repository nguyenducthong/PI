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
import { addNewMessage, updateMessage, checkCodeMessage } from "./IntroduceTheProgramService";
import IntroduceTheProgramDialogTab from "./IntroduceTheProgramDialogTab";
import Checkbox from "@material-ui/core/Checkbox";

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3,
});

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

// Đây là dialog thông báo
class IntroduceTheProgramDialog extends Component {
  state = {
    isView: false,
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "checked") {
      this.setState({ active: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFormSubmit = () => {
    let { id } = this.state.item;
    let { code } = this.state.item;
    let { t } = this.props;
    checkCodeMessage(id, code).then((result) => {
      if (result.data) {
        toast.warning(t("mess_code"));
      } else {
        if (!id) {
          addNewMessage(this.state.item).then(({ data }) => {
            if (data != null && data.id != null) {
              id = data.id;
              this.setState({ item: data });
            }
            toast.success(t("mess_add"));
          });
        } else {
          updateMessage(this.state.item).then(({ data }) => {
            toast.success(t("mess_edit"));
          });
        }
      }
    });
  };

  componentWillMount() {
    //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
    let { open, handleClose, item } = this.props;
    this.setState({ item: item }, () => {});
  }
  handleChangeContent = (content) => {
    this.setState({ content: content });
  };

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let { isView } = this.state;
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20 styleColor">
            {(this.state.item.id ? t("update") : t("Add"))}
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
            <IntroduceTheProgramDialogTab
              t={t}
              i18n={i18n}
              item={this.state.item}
            />
          </DialogContent>

          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.props.handleClose()}
            >
              {t("Cancel")}
            </Button>
            {!isView && (
              <Button variant="contained" color="primary" type="submit">
                {t("Save")}
              </Button>
            )}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default IntroduceTheProgramDialog;
