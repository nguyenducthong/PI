import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  FormControlLabel,
  Switch,
  DialogTitle,
  DialogContent, Icon, IconButton
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { checkCode, updateUser, addNewEQAHealthOrgType, updateEQAHealthOrgType } from "./EQAHealthOrgTypeService";
import { generateRandomId } from "utils";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class EQAHealthOrgTypeEditorDialog extends Component {
  state = {
    name: "",
    code: "",
    description: "",
    isActive: false,
    isView: false
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
    let { code } = this.state;
    let {t} = this.props;
    this.setState({isView: true});
    checkCode(id, code).then((result) => {
      //Nếu trả về true là code đã được sử dụng
      if (result.data) {
        this.setState({isView: false});
        toast.warning(t("mess_code"));
      } else {
        //Nếu trả về false là code chưa sử dụng có thể dùng
        if (id) {
          updateEQAHealthOrgType({
            ...this.state
          }).then(() => {
            this.setState({isView: false});
            toast.success(t('mess_edit'));
          });
        } else {
          addNewEQAHealthOrgType({
            ...this.state
          }).then((response) => {
            if(response.data != null && response.status == 200){
              this.state.id = response.data.id;
              this.setState({...this.state})
              this.setState({isView: false});
              toast.success(t('mess_add'));
            }
            
          });
        }
      }
    });
  };

  componentWillMount() {
    //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
    let { open, handleClose, item } = this.props;
    this.setState(item);
  }

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      id,
      name,
      code,
      isView,
      description
    } = this.state;

    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'sm'} fullWidth={true}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("EQAHealthOrgTypeTable.title")} </span>
        <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
          <DialogContent dividers>
            <Grid className="mb-8" container spacing={4}>
              <Grid item sm={12} xs={12}>
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
                  value={code}
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
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
                <TextValidator
                  className="w-100 mb-16"
                  label={<span className="font">{t('Description')}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="description"
                  value={description}
                  // validators={["required"]}
                  // errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.props.handleClose()}>
              {t('Cancel')}
            </Button>
            {(!isView && <Button
                variant="contained"
                color="primary"
                type="submit">
                {t('Save')}
            </Button>)}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAHealthOrgTypeEditorDialog;
