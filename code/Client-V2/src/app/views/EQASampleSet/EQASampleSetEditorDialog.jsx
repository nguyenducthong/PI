import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  InputAdornment,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Icon, IconButton
} from "@material-ui/core";

import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import {
  ValidatorForm,
  TextValidator,
  TextField
} from "react-material-ui-form-validator";
import { saveItem, checkCode } from "./EQASampleSetService";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import EQARoundSearchDialog from "./EQARoundSearchDialog";
import EQASampleSearchDialog from "./EQASampleSearchDialog";
import { el } from "date-fns/locale";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../../styles/views/_style.scss';
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
class EQASampleSetEditorDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      code: "",
      details: [],
      shouldOpenSearchDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenSearchEQASampleSearchDialog: false,
      eqaRound: [],
      eqaRoundId: "",
      sampleList: [],
      isView: false
    };
    this.dialogRef = React.createRef();
  }

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

  handleRowDataCellChange = (rowData, event) => {
    let { details } = this.state;
    let { t } = this.props;
    if (details != null && details.length > 0) {
      details.forEach(element => {
        if(event.target.value == element.orderNumber){
         //toast.warning(t("EQASampleSet.duplicate_orderNumber") + " " + event.target.value);
        }
        if (
          element.tableData != null &&
          rowData != null &&
          rowData.tableData != null &&
          element.tableData.id == rowData.tableData.id
        ) {
          if (event.target.name == "orderNumber") {
            element.orderNumber = event.target.value;
          }
        }
      });
      this.setState({ details: details });
    }
  };

  checkDuplicate = (data)=>{
    let { t } = this.props;
    let count = 0;
    if(data != null && data.length > 0){
      data.forEach(item1 =>{
        data.forEach(item2 =>{
          if(item1.orderNumber == item2.orderNumber){
            count++;
          }
        })
      });
      if(count > data.length){
        toast.warning(t("EQASampleSet.duplicate_orderNumber"));
        return true;
      }else{
        return false;
      }
    }
  }
  handleFormSubmit = () => {
    this.setState({ hasErrorRound: false });
    let { code, id, details } = this.state;
    let { t } = this.props;
    if(!this.checkDuplicate(details)){
      checkCode(id, code).then(result => {
        //Nếu trả về true là code đã được sử dụng
        if (result.data) {
          // console.log("Code đã được sử dụng");
          toast.warning(t("mess_code"));
        } else if(details != null && details.length > 0 ) {
          if (id) {
            this.setState({isView: true});
            saveItem({
              ...this.state
            }).then((response) => {
              if(response.data != null && response.status == 200){
                this.setState({...this.state,isView: false});
                toast.success(t("mess_edit"));
              }
              // this.props.handleOKEditClose();
            }).catch(()=>{
              toast.warning(t("EQASampleSet.notify.deleteError"));
              this.setState({isView: false});
            });
           
          } else {
            this.setState({isView: true});
            saveItem({
              ...this.state
            }).then((response) => {
              if(response.data != null && response.status == 200){
                id = response.data.id
                this.setState({...this.state,isView: false});
                toast.success(t("mess_add"));
              }
              // this.props.handleOKEditClose();
            }).catch(()=>{
              toast.warning(t("EQASampleSet.notify.deleteError"));
              this.setState({isView: false});
            });
          }
        }else{
          toast.warning(t("EQASampleSet.notify.checkDetails"));
        }
      });
    }
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    if (item && item.details && item.details.length > 0) {
      item.details.forEach(element=>{
        let str = element.sampleCode;
        str = str.split("-");
        str = parseInt(str[str.length - 1]);
        element.number = str;
      })
    
      item.details.sort((a, b) =>
        a.number > b.number
          ? 1
          : a.number === b.number
          ? a.code > b.code
            ? 1
            : -1
          : -1
      );
    }
  


    let sampleList = [];
    if (typeof item.details != "undefined" && item.details != null) {
      for (const detail of item.details) {
        const myItem = {
          sampleList: {
            ...detail,
            id: detail.sample?.id
          }
        };
        sampleList.push(myItem);
      }
    }
    this.setState({
      ...this.props.item,
      sampleList
    });
    if (item != null && item.eqaRound != null) {
      this.setState({ eqaRoundId: item.eqaRound.id });
    }
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

  handleSelectEQARound = item => {
    this.setState({ eqaRound: item, details: [], sampleList: [] });
    if (item != null) {
      this.setState({ eqaRoundId: item.id });
    }
    this.handleSearchEQARoundDialogClose();
  };

  handleSearchEQASampleDialogClose = () => {
    this.setState({
      shouldOpenSearchEQASampleSearchDialog: false
    });
  };

  handleSelectEQASample = listItem => {
    let { details } = this.state;
    listItem.forEach(item => {
      let notInList = true;
      if (details == null || details.length == 0) {
        details = [];
        let eQASampleSetDetail = {};
        eQASampleSetDetail.orderNumber = 1; //nếu là lần đầu thì mặc định orderNumber = 1
        eQASampleSetDetail.sample = item.sampleList;
        eQASampleSetDetail.sampleCode = item.sampleList.code;
        eQASampleSetDetail.result = item.sampleList.result;
        details.push(eQASampleSetDetail);
      } else {
        details.forEach(eQASampleSetDetail => {
          if (
            eQASampleSetDetail.sample != null &&
            item.sampleList.id != null &&
            eQASampleSetDetail.sample.id == item.sampleList.id
          ) {
            notInList = false;
          }
        });

        if (notInList) {
          let eQASampleSetDetail = {};
          eQASampleSetDetail.orderNumber = details.length + 1; //nếu không là lần đầu thì mặc định = số lượng danh sách + 1
          eQASampleSetDetail.sample = item.sampleList;
          eQASampleSetDetail.sampleCode = item.sampleList.code;
          eQASampleSetDetail.result = item.sampleList.result;
          details.push(eQASampleSetDetail);
        }
      }
    });

    if (details && details.length > 0) {
      details.forEach(element=>{
        let str = element.sampleCode;
        str = str.split("-");
        str = parseInt(str[str.length - 1]);
        element.number = str;
      })
      details.sort((a, b) =>
        a.number > b.number
          ? 1
          : a.number === b.number
          ? a.code > b.code
            ? 1
            : -1
          : -1
      );
    }
  
    this.setState({ details }, function() {
      this.handleSearchEQASampleDialogClose();
    });
  };

  deleteEQASampleSetDetail(eQASampleSetDetail) {
    let { details, sampleList } = this.state;
    let index = details.findIndex(function(element) {
      if (
        element.tableData &&
        element.tableData.id &&
        eQASampleSetDetail &&
        eQASampleSetDetail.tableData &&
        eQASampleSetDetail.tableData.id
      ) {
        return element.tableData.id == eQASampleSetDetail.tableData.id;
      }
    });

    if (index) {
      details.splice(index, 1);
      sampleList.splice(index, 1);
      this.setState({ details, sampleList });
    }
  }

  handleAddSampleButtonClick = () => {
    const { eqaRound, eqaRoundId } = this.state;
    if (eqaRound != null && eqaRoundId != "") {
      this.setState({
        shouldOpenSearchEQASampleSearchDialog: true
      });
    } else {
      toast.warn(this.props.t("EQASampleSet.please_select_eqa_round"));
    }
  };

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let {
      id,
      name,
      code,
      eqaRound,
      eqaRoundId,
      eqaSample,
      details,
      sampleList,
      round,
      isView,
      shouldOpenSearchEQARoundSearchDialog,
      shouldOpenSearchEQASampleSearchDialog,
      shouldOpenConfirmationDialog,
      hasErrorRound,
      shouldOpenSearchDialog,
      administrativeUnit
    } = this.state;

    let columns = [
      {
        title: t("STT"),
        field: "orderNumber",
        width: "150",
        headerStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        cellStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        render: rowData => (
          <TextValidator
            className="w-30 mb-8"
            onChange={orderNumber =>
              this.handleRowDataCellChange(rowData, orderNumber)
            }
            type="number"
            name="orderNumber"
            value={rowData.orderNumber}
            validators={["required", "minNumber:0"]}
            errorMessages={[
              t("EQASampleSet.required_field"),
              t("EQASampleSet.number_cannot_be_negative")
            ]}
          />
        )
      },
      {
        title: t("EQASampleSet.sample_code"),
        field: "sampleCode",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("EQASampleSet.tube_code"),
        field: "code",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("Action"),
        field: "custom",
        width: "250",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        render: rowData => (
          <Button
            className="mr-16 mb-8"
            variant="contained"
            color="primary"
            onClick={() => this.deleteEQASampleSetDetail(rowData)}
          >
            {t("Delete")}
          </Button>
        )
      }
    ];
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"md"}
        fullWidth={true}
      >
        <ValidatorForm
          ref="form"
          onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("EQASampleSet.title")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid className="mb-16" container spacing={2}>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                      {t("Code")}
                      </span>}
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={5} md={5} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                      {t("Name")}
                      </span>}
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <AsynchronousAutocomplete
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                      {t("EQARound.title")}
                      </span>}
                  size="small"
                  variant = "outlined"
                  searchFunction={searchByPageEQARound}
                  searchObject={searchObject}
                  defaultValue={eqaRound}
                  value={eqaRound}
                  displayLable={"code"}
                  valueTextValidator={eqaRound}
                  onSelect={this.handleSelectEQARound}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  className="mt-8"
                  variant="contained"
                  color="primary"
                  onClick={this.handleAddSampleButtonClick} //, sampleList: {details}
                >
                  {t("EQASampleSet.add_sample")}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <MaterialTable
                  title={t("SampleManagement.sample-list.title")}
                  data={details}
                  columns={columns}
                  options={{
                  selection: false,
                  actionsColumnIndex: -1,
                  paging: false,
                  search: false,
                  rowStyle: rowData => ({
                    backgroundColor: (rowData.tableData.id % 2 === 1) ? '#EEE' : '#FFF',
                  }), 
                  headerStyle: {
                    backgroundColor: '#358600',
                    color:'#fff',
                  },
                  padding: 'dense',
                  toolbar: false
                }}
                  components={{
                    Toolbar: props => (
                      <div style={{ witdth: "100%" }}>
                        <MTableToolbar {...props} />
                      </div>
                    )
                  }}
                  onSelectionChange={rows => {
                    this.data = rows;
                  }}
                  localization={{
                    body: {
                      emptyDataSourceMessage: `${t(
                        "general.emptyDataMessageTable"
                      )}`,
                    },
                  }}
                />
                {shouldOpenSearchEQASampleSearchDialog && (
                  <EQASampleSearchDialog
                    open={this.state.shouldOpenSearchEQASampleSearchDialog}
                    handleSelect={this.handleSelectEQASample}
                    eqaRound={eqaRound}
                    sampleList={this.state.sampleList}
                    handleClose={this.handleSearchEQASampleDialogClose}
                    ref={this.dialogRef}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>
            </Grid>
          
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => handleClose()}
            >
              {" "}
              {t("Cancel")}
            </Button>
            <Button disabled = {isView} variant="contained" color="primary" type="submit">
              {t("Save")}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQASampleSetEditorDialog;
