import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,MenuItem,
  FormControl, InputLabel, Select,
  Switch,FormHelperText,
  InputAdornment,
  Checkbox,
  Icon,
  IconButton
} from "@material-ui/core";
import {
  ValidatorForm,
  TextValidator,
  TextField
} from "react-material-ui-form-validator";
import {
  getByPage,
  deleteItem,
  saveItem,
  getItemById,
  checkCode
} from "./EQARoundService";
import EQARoundDialog from "./EQARoundDialog";
import { generateRandomId } from "utils";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { search as searchByPage } from "../EQAPlanning/EQAPlanningService";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { MuiPickersUtilsProvider, DatePicker,KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import EQAPlanningSearchDialog from "./EQAPlanningSearchDialog";
import '../../../styles/views/_style.scss';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EQARoundTabs from "./EQARoundTabs"
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
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
class OrganizationEditorDialog extends Component {
  constructor(props) {
    super(props);

  }
  state = {
    name: "",
    code: "",
    level: 0,
    parent: {},
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    startDate: new Date(), //thời gian bắt đầu vòng ngoại kiểm
    endDate: new Date(), //thời gian kết thúc vòng ngoại kiểm
    registrationStartDate: new Date(), //thời gian bắt đầu đăng ký tham gia vòng ngoại kiểm
    registrationExpiryDate: new Date(), //thời gian kết thúc đăng ký tham gia vòng ngoại kiểm
    sampleSubmissionDeadline: new Date(),
    isManualSetCode: false,
    isActive: true,
    isView: false,
    sampleNumber: null,//số mẫu
    sampleSetNumber: null,//số bộ mẫu
    executionTime: new Date(),//thời gian thực hiện
    healthOrgNumber: null,//Số đơn vị tham gia
    detailRound: [],
    listPersonnel: [], 
    checkStartDate: false,
    checkEndDate: false,
    checkPersonnel: false
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if (source === "isManualSetCode") {
      this.setState({ isManualSetCode: event.target.checked })
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {
    let { code, id, detailRound, isManualSetCode } = this.state.item;
    let { listPersonnel, checkStartDate, checkEndDate, checkPersonnel } = this.state;
    let { t } = this.props;
    
    this.setState({isView:true});
      if(checkStartDate == true){
        toast.warning(t("EQARound.emptyStartTime"));
        this.setState({isView:false});
        return
      } else if(checkEndDate == true){
        toast.warning(t("EQARound.emptyEndTime"))
        this.setState({isView:false});
        return
      }else if(checkPersonnel == true){
        toast.warning(t("EQARound.emptyPersonnel"))
        this.setState({isView:false});
        return
      }else{
          if(isManualSetCode){
            checkCode(id, code).then(res =>{
              if(res.data){
                toast.warning(t("EQARound.duplicateCode"));
                this.setState({isView:false});
              }else{
                if (id) {
                  saveItem({
                    ...this.state.item
                  }).then(response => {
                    if (response.data != null && response.status == 200) {
                      // this.props.handleOKEditClose();
                      this.state.id = response.data.id;
                      if (response.data.detailRound != null && response.data.detailRound.length > 0) {
                        response.data.detailRound.sort( function (a, b){
                         return a.type - b.type
                        })
                        response.data.detailRound.forEach(res => {
                          if (res != null && res.personnel != null && res.personnel.id) {
                            res.personnel = res.personnel.id;
                          }
                        });
                        this.state.item.detailRound = response.data.detailRound;
                      }
                      this.setState({...this.state, isView:false});
                      toast.success(t("EQARound.notify.editSucess"));
                    } else {
                      this.setState({isView:false});
                      toast.error(t("EQARound.notify.error"));
                    }
                  }).catch(()=>{
                    this.setState({isView:false});
                  });
                } else {
                  saveItem({
                    ...this.state.item
                  }).then(response => {
                    if (response.data != null && response.status == 200) {
                      // this.props.handleOKEditClose();
                      this.state.id = response.data.id;
                      if (response.data.detailRound != null && response.data.detailRound.length > 0) {
                        response.data.detailRound.sort( function (a, b){
                          return a.type - b.type
                         })
                        response.data.detailRound.forEach(res => {
                          if (res != null && res.personnel != null && res.personnel.id) {
                            res.personnel = res.personnel.id;
                          }
                        });
                        this.state.item.detailRound = response.data.detailRound;
                      }
                      this.setState({...this.state, isView:false});
                      toast.success(t("EQARound.notify.addSucess"));
                    } else {
                      this.setState({isView:false});
                      toast.error(t("EQARound.notify.error"));
                    }
                  }).catch(()=>{
                    this.setState({isView:false});
                  });
                }
              }
            })
          }else{
            if (id) {
              saveItem({
                ...this.state.item
              }).then(response => {
                if (response.data != null && response.status == 200) {
                  // this.props.handleOKEditClose();
                  this.state.id = response.data.id;
           
                  this.setState({...this.state, isView:false});
                  toast.success(t("EQARound.notify.editSucess"));
                } else {
                  toast.error(t("EQARound.notify.error"));
                  this.setState({isView:false});
                }
              }).catch(()=>{
                this.setState({isView:false});
              });
            } else {
              saveItem({
                ...this.state.item
              }).then(response => {
                if (response.data != null && response.status == 200) {
                  // this.props.handleOKEditClose();
                  this.state.id = response.data.id;
                  
                  this.setState({...this.state, isView:false});
                  toast.success(t("EQARound.notify.addSucess"));
                } else {
                  toast.error(t("EQARound.notify.error"));
                  this.setState({isView:false});
                }
              }).catch(()=>{
                this.setState({isView:false});
              });
            }
          }
      } 
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
  
    this.setState({ item: item }, function () {
    
    });
  }
  handleSelectPlaning = results => {
    this.setState({ eqaPlanning: results, shouldPlanningSearchDialog: false });
  };
  handleSearchDialogClose = () => {
    this.setState({
      shouldPlanningSearchDialog: false
    });
  };

  handleSelect = item => {
    this.setState({ eqaPlanning: item });
    this.handleSearchDialogClose();
  };
  

  render() {
    let {
      id,
      isView,
    } = this.state;
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("EQARound.title")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid item xs={12}>
                <EQARoundTabs
                  t={t} i18n={i18n}
                  item={this.state.item}
                  listPersonnel = {this.state.listPersonnel}
                />
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

export default OrganizationEditorDialog;
