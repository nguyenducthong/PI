import React, { Component } from "react";
import {
  Dialog,
  Button,
  DialogActions,
  Grid,
  Checkbox,
  FormControlLabel,
  DialogTitle,
  TextField,
  DialogContent,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText, Icon, IconButton
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { checkCode, addNewReagent, updateReagent } from "./ReagentService";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocalConstants from "./Constants";
import DateFnsUtils from "@date-io/date-fns";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';
import TabsReagent from "./Tabs";

toast.configure();

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

class ReagentEditorDialog extends Component {
  state = {
    name: "",
    code: "",
    description: "",
    registrationNumber: "",//Số đăng ký
    dateOfIssue: new Date(), //Ngày cấp
    expirationDate: new Date(), //Ngày hết hạn
    activeIngredients: "", //Hoạt chất
    dosageForms: "", //Dạng bào chế
    packing: "", //Quy cách đóng gói
    registeredFacilityName: "", //Tên cơ sở đăng ký
    productionFacilityName: "", //Tên cơ sở sản xuất
    healthDepartmentDirectory: true, //thuộc bộ y tế
    testType: null, //Thuộc phương pháp xét nghiệm nào
    isActive: false,
    isView: false,
    hasTestType: false
  };

  list() {
    let listMethod = [
      { value: LocalConstants.EQAResultReportTypeMethod.Elisa, name: "Elisa" },
      { value: LocalConstants.EQAResultReportTypeMethod.FastTest, name: "Test nhanh" },
      { value: LocalConstants.EQAResultReportTypeMethod.ECL, name: "Điện hóa phát quang" },
      { value: LocalConstants.EQAResultReportTypeMethod.SERODIA, name: "Serodia" },
    ]
    this.setState({ listMethod: listMethod });
  }
  saveRegant = () => {
    let { id, code, testType,item } = this.state;
    let { t } = this.props;
    if (item.testType == null) {
      item["hasTestType"]=true
      this.setState({ item: item });
    } else {
      this.setState({ isView: true });
      checkCode(id, item.code).then((result) => {
        //Nếu trả về true là code đã được sử dụng
        if (result.data) {
          toast.warning(t('mess_code'));
          this.setState({ isView: false });
        } else {
          //Nếu trả về false là code chưa sử dụng có thể dùng
          if (id) {
            updateReagent({
              ...this.state.item
            }).then(() => {
              toast.success(t('mess_edit'));
              this.setState({ isView: false });
            });
          } else {
            addNewReagent({
              ...this.state.item
            }).then((response) => {
              if(response.data != null && response.status == 200){
                this.state.item.id = response.data.id
                this.setState({...this.state.item, isView: false})
                toast.success(t('mess_add'));
              }
            });
          }
        }
      });
    }
  };

  componentWillMount() {
    //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
    let { open, handleClose, item } = this.props;
    if(item == null){
      item = {}
    
      item["dateOfIssue"]= new Date()
      item["expirationDate"]= new Date()
    }
    item["hasTestType"]= false
    if(item != null && item.healthDepartmentDirectory == null){
      item["healthDepartmentDirectory"]= true
    }
 
    this.setState({item:item},()=>{
      // console.log(this.state.item)
    });
    this.list();
    
    this.setState({
      ...item
  }); 
    // ValidatorForm.addValidationRule('checkMaxLength', (value) => {
    //   if (value.length > 1020) {
    //     return false;
    //   }
    //   return true;
    // });

    // ValidatorForm.addValidationRule('checkBox', (value) => {
    //   if (this.state.healthDepartmentDirectory == true) {
    //     if (value.length == 0) {
    //       return false;
    //     }
    //   }
    //   return true;
    // });
  }

  render() {
    let {
      id,
      name,
      code,
      isView,
      registrationNumber,//Số đăng ký
      dateOfIssue, //Ngày cấp
      expirationDate, //Ngày hết hạn
      activeIngredients, //Hoạt chất
      dosageForms, //Dạng bào chế
      packing, //Quy cách đóng gói
      registeredFacilityName, //Tên cơ sở đăng ký
      productionFacilityName, //Tên cơ sở sản xuất
      healthDepartmentDirectory,
      testType,
      listMethod,
      description,
      hasTestType
    } = this.state;

    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'lg'} fullWidth={true}>
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
      <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("ReagentTable.title")} </span>
      <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
      </DialogTitle>
      <ValidatorForm ref="form" style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column"
      }}>
          <DialogContent dividers>
              <Grid item  xs={12}>
                  <TabsReagent 
                      t={t} i18n={i18n} 
                      item={this.state.item} 
                  />
              </Grid>
          </DialogContent>
              
          <DialogActions spacing={4} className="flex flex-end flex-middle">
              <Button 
                  variant="contained" 
                  className="mr-16" 
                  color="secondary" 
                  type="button" onClick={() => handleClose()}> {t('Cancel')}</Button>
              <Button 
                  disabled = {isView}
                  onClick={this.saveRegant}
                  variant="contained" 
                  color="primary" 
                  className=" mr-16 align-bottom" 
                  type="submit">
                  {t('Save')}
              </Button>
          </DialogActions>
      </ValidatorForm>
  </Dialog>
    );
  }
}

export default ReagentEditorDialog;
