import {
  InputAdornment,
  Input,
  Grid,
  MuiThemeProvider,
  IconButton,
  Button,
  Icon,
  TextField,
  TablePagination
} from "@material-ui/core";
import React from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import {
  searchByPage, getItemById,
  changeSampleTransferStatus, changeSampleTransferStatusRef, checkCountReport
} from "./EQAHealthOrgSampleTransferStatusServices";
import { Breadcrumb, ConfirmationDialog } from "egret";
import LocalConstants from "./Constants";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SampleTransferStatusEditorDialog from "./SampleTransferStatusEditorDialog";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import moment from "moment";

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div>
      <IconButton size="small" onClick={() => props.onSelect(item, 2)}>
        <Icon fontSize="small" color="primary">local_shipping</Icon>
      </IconButton>  
    </div>
  );
}
function StatusReturn(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  if (item && item.status == 0) {
    //mới
    return (
      <small className="border-radius-4 bg-light-gray px-8 py-2">
        {t("EQAHealthOrgRoundRegister.Status.New")}
      </small>
    );
  } else if (item && item.status == 1) {
    //đã xác nhận
    return (
      <small className="border-radius-4 bg-primary text-white px-8 py-2">
        {t("EQAHealthOrgRoundRegister.Status.Confirmed")}
      </small>
    );
  } else if (item && item.status == -1) {
    //đã hủy
    return (
      <small className="border-radius-4 bg-secondary text-white px-8 py-2">
        {t("EQAHealthOrgRoundRegister.Status.Cancel_Registration")}
      </small>
    );
  } else {
    return "";
  }
}

class EQARoundIsActiveForm extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDialogRef: false,
    shouldOpenEditorSampleTransferStatusDialog: false,
    text: "",
    listEQARound: [],
    hasResult: null,
    round: null,
    healthOrgID: "",
    sampleTransferStatus: 0
  };

  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  listConstants(){
    let { t } = this.props;
    let listResult = [
      {value: true , name: t("EQAHealthOrgRoundRegister.HasResult.Yes")},
      {value: false , name: t("EQAHealthOrgRoundRegister.HasResult.No")}
    ]
    this.setState({listResult: listResult});
   }
  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDialogRef: false,
      shouldOpenEditorSampleTransferStatusDialog: false
    });
  };
  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorSampleTransferStatusDialog: false
    });
    this.updatePageData();
  };
  handleConfirmationResponse = () => {
    const { sampleTransferStatus, healthOrgID, sampleTransferStatusRef } = this.state;
    changeSampleTransferStatus(healthOrgID, sampleTransferStatus)
      .then(() => {
        toast.success(this.props.t("update_success_message"));
        this.updatePageData();
        this.handleDialogClose();
      })
      .catch(err => {
        toast.error(this.props.t("error_message"));
        this.handleDialogClose();
      });
  };
  handleConfirmationResponseRef = () => {
    const { healthOrgID, sampleTransferStatusRef } = this.state;
    changeSampleTransferStatusRef(healthOrgID, sampleTransferStatusRef)
      .then(() => {
        toast.success(this.props.t("update_success_message"));
        this.updatePageData();
        this.handleDialogClose();
      })
      .catch(err => {
        toast.error(this.props.t("error_message"));
        this.handleDialogClose();
      });
  };
  search() {
    var searchObject = {};
    searchObject.text = this.state.text;
    searchObject.hasResult = this.state.hasResult ;
    if (this.state.round != null) {
      searchObject.roundId = this.state.round.id;
    }
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements
        });
      }
    );
  }

  componentDidMount() {
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    searchByPageEQARound(searchObject).then(({ data }) => {
      if (data != null && data.content.length > 0) {
        this.setState({ listEQARound: [...data.content] }, () => {});
      }
    });
    this.updatePageData();
    this.listConstants();
  }
  handleFilterResult = (event, result)=>{
    if(result != null && result.value != null){
      this.setState({hasResult: result.value, result:result}, ()=>{
        this.search();
      });
    }else{
      this.setState({hasResult: null, result:null}, () =>{
        this.search();
      });
    }
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.text;
    searchObject.hasResult = this.state.hasResult ;
    if (this.state.round != null) {
      searchObject.roundId = this.state.round.id;
    }
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements
        });
      }
    );
  };

  setPage = page => {
    this.setState({ page }, function() {
      this.updatePageData();
    });
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function() {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleOpenConfirmationDialog = (event, healthOrgID) => {
    let { t } =this.props;
    if(event.target.value == LocalConstants.TransferStatus_Value.received){
      this.setState({
        shouldOpenConfirmationDialog: true,
        healthOrgID,
        sampleTransferStatus: LocalConstants.TransferStatus_Value.received,
      });
    }
    if( event.target.value == LocalConstants.TransferStatus_Value.delivered ){
      toast.warning(t("EQAHealthOrgSampleTransferStatus.noUpdateStatus"));  
    }
  };

  handleOpenConfirmationDialogRef = (event, healthOrgID) => {
    if(event.target.value == LocalConstants.TransferStatusRef_Value.Received_Health_Org){
      this.setState({
        shouldOpenConfirmationDialogRef: true,
        healthOrgID,
        sampleTransferStatusRef: event.target.value
      });
    }else{
      getItemById(healthOrgID).then(({ data }) => {
        data.sampleTransferStatusRef = LocalConstants.TransferStatusRef_Value.Sample_Resend_Unit;

        this.setState({
          item: data,
          shouldOpenEditorSampleTransferStatusDialog: true
        });
      });
    }
  };
  handleFilterEQARound = (event, round, reason, details) => {
    if (round != null && round.id != null) {
      let searchObject = {};
      searchObject.roundId = round.id;
      searchObject.isRunning = this.state.isRunning;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject).then(({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
          round: round
        });
      });
      if (reason == "clear") {
        this.setState({ round: null });
      }
    } else {
      this.setState({ round: null }, () => {
        let searchObject = {};
        searchObject.isRunning = this.state.isRunning;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchByPage(searchObject).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            round: round
          });
        });
      });
    }
  };

  render() {
    const { t, i18n } = this.props;
    const { text, listEQARound,result, shouldOpenEditorSampleTransferStatusDialog, round, item , listResult} = this.state;
    let columns = [
      // {
      //   title: t("Action"),
      //   field: "custom",
      //   align: "center",
      //   width: "100px",
      //   headerStyle: {
      //     minWidth:"100px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //   },
      //   cellStyle: {
      //     minWidth:"100px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //     textAlign: "center",
      //   }, 
      //   render: rowData => (
      //     <MaterialButton
      //       item={rowData}
      //       onSelect={(rowData, method) => {
      //       if (method === 2) {
      //           getItemById(rowData.id).then(({ data }) => {
      //             this.setState({
      //               item: data,
      //               shouldOpenEditorSampleTransferStatusDialog: true
      //             });
      //           });
      //         } else {
      //           alert("Call Selected Here:" + rowData.id);
      //         }
      //       }}
      //     />
      //   )
      // },
      {
        title: t("EQAHealthOrgRoundRegister.RoundName"),
        field: "round.code",
        width: "200",
        headerStyle: {
          minWidth:"140px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"140px",
          paddingLeft: "15px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title: t("EQAHealthOrgRoundRegister.HealthOrgName"),
        field: "healthOrg.name",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth:"250px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"250px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title: t("EQAHealthOrgRoundRegister.HealthOrgCode"),
        field: "healthOrg.code",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth:"175px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"175px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title: t("EQAHealthOrgRoundRegister.HasResult.title"),
        field: "hasResult",
        width: "150",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData =>
          rowData.hasResult == true ? (
            <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
              {t("EQAHealthOrgRoundRegister.HasResult.Yes")}
            </small>
          ) : (
            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
              {t("EQAHealthOrgRoundRegister.HasResult.No")}
            </small>
          )
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.main"),
        field: "sampleTransferStatus",
        align: "left",
        width: "300",
        headerStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData => (
          <RadioGroup
            name="gender1"
            value={
              rowData.sampleTransferStatus != null
                ? rowData.sampleTransferStatus
                : ""
            }
             onChange={event =>
            // {
            //   (event.value == LocalConstants.TransferStatus_Value.delivered) ?
            //   this.handleOpenConfirmationDialog(event, rowData.id) :
            //   ""
            // }
              this.handleOpenConfirmationDialog(event, rowData.id)
            }
          >
            <FormControlLabel
              value={LocalConstants.TransferStatus_Value.delivered}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.not_received")}
            />
            <FormControlLabel
              value={LocalConstants.TransferStatus_Value.received}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.received")}
            />
          </RadioGroup>
        )
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.ref"),
        field: "sampleTransferStatusRef",
        align: "left",
        width: "300",
        headerStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData => (rowData.sampleTransferStatusRef != null)  ? (
          <RadioGroup
            name="gender1"
            value={
              rowData.sampleTransferStatusRef != null
                ? rowData.sampleTransferStatusRef
                : ""
            }
            onChange={event =>
              this.handleOpenConfirmationDialogRef(event, rowData.id)
            }
          >
            <FormControlLabel
              value={LocalConstants.TransferStatusRef_Value.Received_Health_Org}
              disabled = {(((rowData.sampleTransferStatusRef == LocalConstants.TransferStatusRef_Value.Received_Pi) ? true : false ) || 
                ((rowData.sampleTransferStatusRef == LocalConstants.TransferStatusRef_Value.Sample_Resend_Unit) ? true : false ))}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.received_health_org")}
            />
            <FormControlLabel
              value={LocalConstants.TransferStatusRef_Value.Sample_Resend_Unit}
              disabled = { rowData.sampleTransferStatusRef == LocalConstants.TransferStatusRef_Value.Received_Pi ? true : false}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.sample_resend_unit")}
            />
            <FormControlLabel
              value={LocalConstants.TransferStatusRef_Value.Received_Pi}
              disabled = {true}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.received_pi")}
            />
          </RadioGroup>
        ) : ""
      },
    ];

   let columnDetail = [
    // {
    //   title: t("Action"),
    //   field: "custom",
    //   align: "center",
    //   width: "100px",
    //   headerStyle: {
    //     minWidth:"100px",
    //     paddingLeft: "10px",
    //     paddingRight: "0px",
    //   },
    //   cellStyle: {
    //     minWidth:"100px",
    //     paddingLeft: "10px",
    //     paddingRight: "0px",
    //     textAlign: "center",
    //   }, 
    //   render: rowData => (
    //     <MaterialButton
    //       item={rowData}
    //       onSelect={(rowData, method) => {
    //       if (method === 2) {
    //           getItemById(rowData.id).then(({ data }) => {
    //             this.setState({
    //               item: data,
    //               shouldOpenEditorSampleTransferStatusDialog: true
    //             });
    //           });
    //         } else {
    //           alert("Call Selected Here:" + rowData.id);
    //         }
    //       }}
    //     />
    //   )
    // },
      {
        title: t("EQAHealthOrgRoundRegister.RoundName"),
        field: "round.code",
        width: "200",
        headerStyle: {
          minWidth:"140px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"140px",
          paddingLeft: "15px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title: t("EQAHealthOrgRoundRegister.HealthOrgName"),
        field: "healthOrg.name",
        align: "left",
        width: "200px",
        headerStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"250px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title: t("EQAHealthOrgRoundRegister.HealthOrgCode"),
        field: "healthOrg.code",
        align: "left",
        width: "300px",
        headerStyle: {
          minWidth:"175px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"175px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title: t("EQAHealthOrgRoundRegister.HasResult.title"),
        field: "hasResult",
        width: "150px",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData =>
          rowData.hasResult == true ? (
            <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
              {t("EQAHealthOrgRoundRegister.HasResult.Yes")}
            </small>
          ) : (
            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
              {t("EQAHealthOrgRoundRegister.HasResult.No")}
            </small>
          )
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.main"),
        field: "sampleTransferStatus",
        align: "left",
        width: "300px",
        headerStyle: {
          width: "200px",
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData => (
          <RadioGroup
            name="gender1"
            value={
              rowData.sampleTransferStatus != null
                ? rowData.sampleTransferStatus
                : ""
            }
            onChange={event =>
              this.handleOpenConfirmationDialog(event, rowData.id)
            }
          >
            <FormControlLabel
              value={2}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.not_received")}
            />
            <FormControlLabel
              value={3}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.received")}
            />
          </RadioGroup>
        )
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.billOfLadingCode"),
        field: "billOfLadingCode",
        align: "left",
        width: "150px",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.delivery_date"),
        field: "deliveryDate",
        align: "left",
        width: "150px",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData =>
          (rowData.deliveryDate) ? <span>{moment(rowData.deliveryDate).format('DD/MM/YYYY')}</span> : ''
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.sample_receiving_date"),
        field: "sampleReceivingDate",
        align: "left",
        width: "150px",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData =>
          (rowData.sampleReceivingDate) ? <span>{moment(rowData.sampleReceivingDate).format('DD/MM/YYYY')}</span> : ''
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.ref"),
        field: "sampleTransferStatusRef",
        align: "left",
        width: "300",
        headerStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData => (rowData.sampleTransferStatusRef != null)  ? (
          <RadioGroup
            name="gender1"
            value={
              rowData.sampleTransferStatusRef != null
                ? rowData.sampleTransferStatusRef
                : ""
            }
            onChange={event =>
              this.handleOpenConfirmationDialogRef(event, rowData.id)
            }
          >
            <FormControlLabel
              value={LocalConstants.TransferStatusRef_Value.Received_Health_Org}
              disabled = {(((rowData.sampleTransferStatusRef == LocalConstants.TransferStatusRef_Value.Received_Pi) ? true : false ) || 
                ((rowData.sampleTransferStatusRef == LocalConstants.TransferStatusRef_Value.Sample_Resend_Unit) ? true : false ))}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.received_health_org")}
            />
            <FormControlLabel
              value={LocalConstants.TransferStatusRef_Value.Sample_Resend_Unit}
              disabled = { rowData.sampleTransferStatusRef == LocalConstants.TransferStatusRef_Value.Received_Pi ? true : false}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.sample_resend_unit")}
            />
            <FormControlLabel
              value={LocalConstants.TransferStatusRef_Value.Received_Pi}
              disabled = {true}
              control={<Radio />}
              label={t("EQAHealthOrgSampleTransferStatus.received_pi")}
            />
          </RadioGroup>
        ) : ""
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.billOfLadingCodeRef"),
        field: "billOfLadingCodeRef",
        align: "left",
        width: "150px",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.delivered_date_ref"),
        field: "deliveryDateRef",
        align: "left",
        width: "175px",
        headerStyle: {
          minWidth:"175x",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"175px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData =>
          (rowData.deliveryDateRef) ? <span>{moment(rowData.deliveryDateRef).format('DD/MM/YYYY')}</span> : ''
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.sample_receiving_date_ref"),
        field: "sampleReceivingDateRef",
        align: "left",
        width: "175px",
        headerStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        }, 
        render: rowData =>
          (rowData.sampleReceivingDateRef) ? <span>{moment(rowData.sampleReceivingDateRef).format('DD/MM/YYYY')}</span> : ''
      },
    ];
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>
              {t("EQAHealthOrgSampleTransferStatus.title")} | {t("web_site")}
            </title>
          </Helmet>
          <Breadcrumb
            routeSegments={[
              { name: t("EQAHealthOrgSampleTransferStatus.title") }
            ]}
          />
        </div>
        <Grid container spacing={3}>
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <Button
                className="mb-16 mr-16 align-bottom"
                variant="contained"
                color="primary"
                onClick={()=>{
                  if(this.state.isViewDetails){
                    this.setState({isViewDetails:false})
                  }else{
                    this.setState({isViewDetails:true})
                  }
                }}
              >
                {this.state.isViewDetails ? t("EQAHealthOrgRoundRegister.compact") : t("EQAHealthOrgRoundRegister.details")}
              </Button>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}>
              <Autocomplete
                id = "list-transfer-status"
                size="small"
                options={listResult}
                // className="flex-end w-80 mb-10"
                autoHighlight
                getOptionLabel={(option) => option.name}
                onChange= {this.handleFilterResult}
                value={result ? result : null}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t("EQAHealthOrgRoundRegister.filterStatusResult")}
                    variant="outlined"
                  />
                )}
              /> 
            </Grid>
          <Grid item lg={3} md={3} sm={12} xs={6}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={listEQARound}
              className="flex-end"
              getOptionLabel={option => option.code}
              onChange={this.handleFilterEQARound}
              value={round}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("general.fillterByRoundEQA")}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={6}>
            <Input
              label={t("EnterSearch")}
              className="mb-16 mr-10 w-100 stylePlaceholder"
              type="text"
              name="text"
              placeholder={t("Search")}
              value={text}
              onKeyDown={this.handleKeyDownEnterSearch}
              onChange={this.handleTextChange}
              id="search_box"
              startAdornment={
                <InputAdornment>
                  <Link>
                    {" "}
                    <SearchIcon
                      onClick={() => this.search()}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0"
                      }}
                    />
                  </Link>
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>
        <div>
          {this.state.shouldOpenConfirmationDialog && (
            <ConfirmationDialog
              title={t("confirm")}
              open={this.state.shouldOpenConfirmationDialog}
              onConfirmDialogClose={this.handleDialogClose}
              onYesClick={this.handleConfirmationResponse}
              Yes={t("confirm")}
              No={t("Cancel")}
              text={t("EQAHealthOrgSampleTransferStatus.confirm_update_status")}
            />
          )}
          {this.state.shouldOpenConfirmationDialogRef && (
            <ConfirmationDialog
              title={t("confirm")}
              open={this.state.shouldOpenConfirmationDialogRef}
              onConfirmDialogClose={this.handleDialogClose}
              onYesClick={this.handleConfirmationResponseRef}
              Yes={t("confirm")}
              No={t("Cancel")}
              text={t("EQAHealthOrgSampleTransferStatus.confirm_update_status")}
            />
          )}
          {shouldOpenEditorSampleTransferStatusDialog && (
              <SampleTransferStatusEditorDialog
                t={t}
                i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenEditorSampleTransferStatusDialog}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
              />
            )}
        </div>
        <MaterialTable
          // title={t('List')}
          data={this.state.itemList}
          columns={this.state.isViewDetails ? columnDetail : columns}
          parentChildData={(row, rows) => {
            let list = rows.find(a => a.id === row.parentId);
            return list;
          }}
          options={{
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                rowStyle: (rowData, index) => ({
                  backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                }), 
                maxBodyHeight: '450px',
                minBodyHeight: '370px',
                headerStyle: {
                  backgroundColor: '#358600',
                  color:'#fff',
                  minHeight: '1000px'
                },
                padding: 'dense',
                toolbar: false
              }}
          components={{
            Toolbar: props => <MTableToolbar {...props} />
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
        <TablePagination
          align="left"
          className="px-16"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          labelRowsPerPage={t('general.rows_per_page')}
          labelDisplayedRows={ ({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
          count={this.state.totalElements}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.setRowsPerPage}
        />
      </div>
    );
  }
}
export default EQARoundIsActiveForm;
