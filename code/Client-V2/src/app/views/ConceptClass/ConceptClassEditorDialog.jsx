import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { checkCode, addNewConceptClass, updateConceptClass } from "./ConceptClassService";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class ConceptClassEditorDialog extends Component {
  state = {
    name: "",
    code: "",
    shortName:"",
    description:"",
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
    let { id , code} = this.state;
    let { t } = this.props;
    
    checkCode(id, code).then((result) => {
      //Nếu trả về true là code đã được sử dụng
      if (result.data) {
        console.log("Code đã được sử dụng");
        toast.warning(t('mess_code'));
      } else {
        //Nếu trả về false là code chưa sử dụng có thể dùng
        if (id) {
          this.setState({isView: true});
            updateConceptClass({
            ...this.state
          }).then(() => {
            this.props.handleOKEditClose();
            toast.success(t('mess_edit'));
          });
        } else {
          this.setState({isView: true});
            addNewConceptClass({
            ...this.state
          }).then(() => {
            this.props.handleOKEditClose();
            toast.success(t('mess_add'));
          });
        }
      }
    });
  };

  componentWillMount() {
    //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
    let { open, handleClose,item } = this.props;
    this.setState(item);
  }

  render() {
    let {
      id,
      name,
      code,
      shortName,
      isView,
      description
    } = this.state;
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'sm'} fullWidth={true}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20"> {t("SaveUpdate")} </span>
        </DialogTitle>
          <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
          <DialogContent dividers>
          <Grid className="mb-16" container spacing={4}>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={<span><span style={{ color: "red" }}> * </span>
                      {t("ConceptClass.code")}
                      </span>}
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
                  label={<span><span style={{ color: "red" }}> * </span>
                      {t("ConceptClass.name")}
                      </span>}
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
                  label={t("ConceptClass.Short_Name")}
                  onChange={this.handleChange}
                  type="text"
                  name="shortName"
                  value={shortName}
                  variant="outlined"
                  size="small"
                />
                <TextValidator
                  className="w-100 mb-16"
                  label={t("ConceptClass.description")}
                  onChange={this.handleChange}
                  type="text"
                  name="description"
                  value={description}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
 	        </DialogContent>
            
            <DialogActions spacing={4}  className="flex flex-end flex-middle">
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

export default ConceptClassEditorDialog;
