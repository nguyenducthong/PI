import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  TablePagination,
  Radio,
  FormControlLabel,
  Switch, Icon, IconButton
} from "@material-ui/core";

import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { ValidatorForm, TextValidator, TextField } from "react-material-ui-form-validator";
import { getByPage, deleteItem, saveItem, getItemById, checkCode } from "./TestMethodService";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { el } from "date-fns/locale";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
class TestMethodEditorDialog extends Component {
  state = {
    name: "",
    code: "",
    description: "",
    details: [],
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenSearchEQASampleSearchDialog: false,
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
    let { t } = this.props;
    checkCode(id, code).then((result) => {
      //Nếu trả về true là code đã được sử dụng
      if (result.data) {
       
        toast.warning(t('mess_code'));
      } else {
        //Nếu trả về false là code chưa sử dụng có thể dùng
        if(id){
          saveItem({
            ...this.state
          }).then(() => {
            this.props.handleOKEditClose();
            toast.success(t('mess_edit'));
          });
        }else{
          saveItem({
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
    let { open, handleClose, item } = this.props;
    this.setState({
      ...this.props.item
    });
  }

  handleSearchDialogClose = () => {
    this.setState({
      shouldOpenSearchDialog: false
    });
  };
  handleSearchEQARoundDialogClose = () => {
    this.setState({
      shouldOpenSearchEQARoundSearchDialog: false
    });
  };
  handleSelectEQARound = (item) => {
    this.setState({ eqaRound: item });
    this.handleSearchEQARoundDialogClose();
  }
  handleSearchEQASampleDialogClose = () => {
    this.setState({
      shouldOpenSearchEQASampleSearchDialog: false
    });
  };
  handleSelectEQASample = (item) => {
    let notInList = true;
    let { details } = this.state;
    if (details == null || details.length == 0) {
      details = [];
      let eQASampleSetDetail = {};
      eQASampleSetDetail.orderNumber = 1; //nếu là lần đầu thì mặc định orderNumber = 1
      eQASampleSetDetail.sample = item;
      details.push(eQASampleSetDetail);
    }
    else {
      details.forEach(eQASampleSetDetail => {
        if (eQASampleSetDetail.sample != null && item.id != null && eQASampleSetDetail.sample.id == item.id) {
          notInList = false;
        }
      });

      if (notInList) {
        let eQASampleSetDetail = {};
        eQASampleSetDetail.orderNumber = details.length + 1; //nếu không là lần đầu thì mặc định = số lượng danh sách + 1 
        eQASampleSetDetail.sample = item;
        details.push(eQASampleSetDetail);
      }
    }

    this.setState({ details }, function () {
      this.handleSearchEQASampleDialogClose();
    });
  }

  deleteTestMethodDetail(eQASampleSetDetail) {
    let index = null;
    let { details } = this.state;
    if (details != null && details.length > 0) {
      details.forEach(element => {
        if (element != null && element.sample != null && eQASampleSetDetail.sample != null && element.sample.id == eQASampleSetDetail.sample.id) {
          if (index == null) {
            index = 0;
          }
          else {
            index++;
          }
        }
      });

      details.splice(index, 1);
      this.setState({ details });
    }
  }

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      id,
      name,
      code,
      description,
      eqaSample,
      details,
      shouldOpenSearchEQASampleSearchDialog
    } = this.state;

    let columns = [
      {
        title: t("STT"), field: "orderNumber", width: "150",
        render: rowData =>
          <TextValidator
            className="w-50 mb-16"
            //label={t("Code")}
            onChange={this.handleChange}
            type="text"
            name="orderNumber"
            value={rowData.orderNumber}
            validators={["required"]}
            errorMessages={[t("general.errorMessages_required")]}
          />
      },
      { title: t("EQASerumBankTable.title"), field: "sample.eqaSerumBank.serumCode", width: "150" },
      { title: t("TestMethod.sample_code"), field: "sample.code", align: "left", width: "150" },
      { title: t("TestMethod.sample_name"), field: "sample.name", align: "left", width: "150" },
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData =>
          <Button className="mb-16 mr-16" variant="contained" color="primary" onClick={() => this.deleteTestMethodDetail(rowData)}>{t('Delete')}</Button>
      },

    ];
    return (
      <Dialog  open={open} PaperComponent={PaperComponent} maxWidth={'md'} fullWidth={true} >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <span className="mb-20"> {(id ? t("update") : t("Add")) + " " + t("TestMethod.title")} </span>
        <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
            <Grid className="mb-16" container spacing={2}>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={t("Code")}
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={t("Name")}
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={t("Description")}
                  onChange={this.handleChange}
                  type="text"
                  name="description"
                  value={description}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
            </Grid>
            {/* <Grid item xs={12}>
              <Button
                className=""
                variant="contained"
                color="primary"
                onClick={() => this.setState({ shouldOpenSearchEQASampleSearchDialog: true, item: {} })}
              >
                {t('TestMethod.add_sample')}
              </Button>
            </Grid> */}
            {/* <Grid item xs={12}>
              <MaterialTable title={t("SampleManagement.sample-list.title")} data={details} columns={columns}
                options={{
                  selection: false,
                  actionsColumnIndex: -1,
                  paging: false,
                  search: false
                }}
                components={{
                  Toolbar: props => (
                    <div style={{ witdth: "100%" }}>
                      <MTableToolbar {...props} />
                    </div>
                  ),
                }}
                onSelectionChange={(rows) => {
                  this.data = rows;
                }}
              />
              {shouldOpenSearchEQASampleSearchDialog && (
                <EQASampleSearchDialog
                  open={this.state.shouldOpenSearchEQASampleSearchDialog}
                  handleSelect={this.handleSelectEQASample}
                  selectedItem={eqaSample != null ? eqaSample : {}}
                  handleClose={this.handleSearchEQASampleDialogClose} t={t} i18n={i18n} />
              )
              }
            </Grid> */}
            <div className="flex flex-space-between flex-middle mt-16">
              <Button variant="contained" color="primary" type="submit">
                {t('Save')}
              </Button>
              <Button variant="contained" color="secondary" type="button" onClick={() => handleClose()}> {t('Cancel')}</Button>
            </div>
          </ValidatorForm>
        </DialogContent>
      </Dialog >
    );
  }
}

export default TestMethodEditorDialog;
