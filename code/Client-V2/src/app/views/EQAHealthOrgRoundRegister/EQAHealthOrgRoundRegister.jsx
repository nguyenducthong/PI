import {
  Input,
  InputAdornment,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  Icon,
  TextField,
  Button,
  TableHead,
  TableCell,
  TableRow,
  Checkbox,
  TablePagination
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import moment from "moment";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import {
  getByPage,
  deleteItem,
  saveItem,
  getItemById,
  searchByPage,
  getTubeById,
  exportToExcel,
  updateSubscriptionStatus
} from "./EQAHealthOrgRoundRegisterService";
import EQAHealthOrgRoundRegisterEditorDialog from "./EQAHealthOrgRoundRegisterEditorDialog";
import EQAHealthOrgRoundRegisterUpdateStatus from "./EQAHealthOrgRoundRegisterUpdateStatus";
import SampleTransferStatusEditorDialog from "./SampleTransferStatusEditorDialog";
import EQAHealthOrgRoundRegisterEditorMultipleDialog from "./EQAHealthOrgRoundRegisterEditorMultipleDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { getByPage as searchByAdministrativeUnit } from "../AdministrativeUnit/AdministrativeUnitService";
import LocalConstants from "./Constants";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  let isCheck = false
  if (props.eqaSampleSetId == null) {
    isCheck = true
  }
  return (
    <div>
      <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
        <Icon fontSize="small" color="primary">edit</Icon>
      </IconButton>
      <IconButton disabled={isCheck} size="small" onClick={() => props.onSelect(item, 2)}>
        {!isCheck ? (<Icon disabled={isCheck} fontSize="small" color="primary">local_shipping</Icon>)
          : (<Icon disabled={isCheck} fontSize="small" color="disabled">local_shipping</Icon>)}
      </IconButton>
      <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
        <Icon fontSize="small" color="error">delete</Icon>
      </IconButton>
    </div>
  );
}


class EQAHealthOrgRoundRegister extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  state = {
    rowsPerPage: 10,
    data: [],
    page: 0,
    listEQARound: [],
    totalElements: 0,
    itemList: [],
    listSampleTrans: [],
    itemTubeList: [],
    shouldOpenEditorDialog: false,
    shouldOpenEditorSampleTransferStatusDialog: false,
    shouldOpenEditorMultipleDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    shouldOpenConfirmationUpdateStatus: false,
    keyword: "",
    listTransferStatus: [],
    roundId: "",
    transferStatus: "",
    eqaSampleTubes: [],
    round: null,
    transferStatus: null,
    hasResult: null,
    administrativeUnit: null,
    listAdministrativeUnit: [],
    isSearch: false,
    isViewDetails: false
  };

  handleTextChange(event) {
    this.setState({ keyword: event.target.value });
  }

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search() {
    var searchObject = {};
    this.setState({ page: 0 }, () => {
      searchObject.round = this.state.round ? this.state.round : "";
      searchObject.isExportExcel = false;
      searchObject.administrativeUnitId = this.state.administrativeUnitId ? this.state.administrativeUnitId : "";
      searchObject.transferStatus = this.state.transferStatus ? this.state.transferStatus : null;
      searchObject.hasResult = this.state.hasResult;
      searchObject.text = this.state.keyword.trim();
      searchObject.roundId = this.state.roundId ? this.state.roundId : "";
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject).then(
        ({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            round: searchObject.round
          });
        }
      );
    });
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleFilterEQARound = (event, round, reason, details) => {
    if (round != null && round.id != null) {
      this.setState({ roundId: round.id, round: round }, () => {
        this.search()
      });
      if (reason == "clear") {
        this.setState({ round: null });
      }
    } else {
      this.setState({ round: null, roundId: "" }, () => {
        this.search()
      });
    }
  };
  handleFilterSampleTransferStatus = (event, status) => {
    if (status != null && status.value != null) {
      this.setState({ transferStatus: status.value, status: status });
      this.search();
    } else {
      this.setState({ transferStatus: null, status: null });
      this.search();
    }
  }
  handleFilterResult = (event, result) => {
    if (result != null && result.value != null) {
      this.setState({ hasResult: result.value, result: result });
      this.search();
    } else {
      this.setState({ hasResult: null, result: null });
      this.search();
    }
  }
  listConstants() {
    let { t } = this.props;
    let listTransferStatus = [
      { value: LocalConstants.TransferStatus_Value.received, name: t("EQAHealthOrgSampleTransferStatus.received") },
      { value: LocalConstants.TransferStatus_Value.delivered, name: t("EQAHealthOrgSampleTransferStatus.delivered") },
      { value: LocalConstants.TransferStatus_Value.wait_for_transfer, name: t("EQAHealthOrgSampleTransferStatus.wait_for_transfer") },
      { value: LocalConstants.TransferStatus_Value.no_sample_received, name: t("EQAHealthOrgSampleTransferStatus.no_sample_received") },
    ];

    let listResult = [
      { value: true, name: t("EQAHealthOrgRoundRegister.HasResult.Yes") },
      { value: false, name: t("EQAHealthOrgRoundRegister.HasResult.No") }
    ]
    this.setState({ listTransferStatus: listTransferStatus, listResult: listResult });
  }
  componentDidMount() {
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let searchObjectAdministrativeUni = { pageIndex: 1, pageSize: 1000000 }
    searchByPageEQARound(searchObject).then(({ data }) => {
      if (data != null && data.content.length > 0) {
        this.setState({ listEQARound: [...data.content] }, () => { });
      }
    });

    searchByAdministrativeUnit(searchObjectAdministrativeUni).then(({ data }) => {
      if (data != null && data.content.length > 0) {
        this.setState({ listAdministrativeUnit: [...data.content] }, () => { });
      }
    });
    this.listConstants();
    this.updatePageData();

  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.isExportExcel = false;
    searchObject.administrativeUnitId = this.state.administrativeUnitId ? this.state.administrativeUnitId : "";
    searchObject.transferStatus = this.state.transferStatus ? this.state.transferStatus : null;
    searchObject.roundId = this.state.roundId ? this.state.roundId : null;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements
        });
      }
    );
  };
  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenEditorSampleTransferStatusDialog: false,
      shouldOpenEditorMultipleDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationUpdateStatus: false
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenEditorSampleTransferStatusDialog: false,
      shouldOpenEditorMultipleDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationUpdateStatus: false,
      shouldOpenConfirmationDeleteAllDialog: false
    });
    this.updatePageData();
  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleConfirmationResponse = () => {
    let { t } = this.props;
    deleteItem(this.state.id).then((res) => {
      if (res.data == true) {
        toast.info(t("EQAHealthOrgRoundRegister.notify.deleteSuccess"));
        this.updatePageData();
      } else {
        toast.warning(t('EQAHealthOrgRoundRegister.notify.deleteError'));
      }
      this.handleDialogClose();
    }).catch((err) => {
      toast.warning(t('EQAHealthOrgRoundRegister.notify.deleteFail'));
      this.handleDialogClose();
    })
  };
  handleEditItem = item => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    });
  };
  handleOpenEditorMultipleDialog = () => {
    this.setState({
      shouldOpenEditorMultipleDialog: true
    });
  };
  async handleDeleteList(list) {
    let { t } = this.props;
    let deleteSuccess = 0, deleteError = 0, error = 0;
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id).then((res) => {
        if (res.data == true) {
          deleteSuccess++;
          this.updatePageData();
        } else {
          deleteError++;
        }
        this.handleDialogClose();
      }).catch((err) => {
        error++;
        this.handleDialogClose();
      });
    }
    if (deleteSuccess != 0) {
      toast.info(t("EQAHealthOrgRoundRegister.notify.deleteSuccess") + " " + deleteSuccess);
    }
    if (deleteError != 0) {
      toast.warning(t("EQAHealthOrgRoundRegister.notify.deleteError") + " " + deleteError);
    }
    if (error != 0) {
      toast.warning(t('EQAHealthOrgRoundRegister.notify.deleteFail') + " " + error);
    }
  }
  handleDeleteAll = (event) => {
    let { t } = this.props;
    if (this.data != null) {
      this.handleDeleteList(this.data);
    } else {
      toast.warning(t('general.select_data'));
      this.handleDialogClose();
    }
  };

  // handleExportExcel = () => {
  //   let { t } = this.props;
  //   const { round, itemList} = this.state;
  //   if (round != null && round.id != "") {
  //     if(itemList != null && itemList.length > 0){
  //       exportToExcel(round.id).then(result => {
  //         const url = window.URL.createObjectURL(new Blob([result.data]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", "DanhSachDonViThamGia.xlsx");
  //         document.body.appendChild(link);
  //         link.click();
  //       });
  //     }else{
  //       toast.warning(t("EQAHealthOrgSampleTransferStatus.noData"));
  //     }

  //   } else {
  //     toast.warning(t("EQAHealthOrgSampleTransferStatus.messErrorEqaRound"));
  //   }
  // };
  handleUpdateStatus = () => {
    let { t } = this.props;
    // console.log(this.data);
    if (this.data != null) {
      this.setState({
        item: this.data,
        shouldOpenConfirmationUpdateStatus: true
      })
    } else {
      toast.warning(t('general.select_data'));
      this.handleDialogClose();
    }

  }
  handleExportExcel = () => {
    let { t } = this.props;
    const { round, itemList } = this.state;
    // if (round != null && round.id != "") {
    if (itemList != null && itemList.length > 0) {
      var searchObject = {};
      searchObject.text = this.state.keyword.trim();
      searchObject.isExportExcel = true;
      searchObject.isViewDetails = this.state.isViewDetails;
      searchObject.administrativeUnitId = this.state.administrativeUnitId ? this.state.administrativeUnitId : "";
      searchObject.transferStatus = this.state.transferStatus ? this.state.transferStatus : null;
      searchObject.roundId = this.state.roundId ? this.state.roundId : null;
      // searchObject.pageIndex = this.state.page + 1;
      // searchObject.pageSize = this.state.rowsPerPage;
      exportToExcel(searchObject)
        .then((res) => {
          toast.info(this.props.t('general.successExport'));
          let blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "DanhSachDonViThamGia.xlsx");
        })
        .catch((err) => {
          // console.log(err);
        });
    } else {
      toast.warning(t("EQAHealthOrgSampleTransferStatus.noData"));
    }

    // }
    // else {
    //   toast.warning(t("EQAHealthOrgSampleTransferStatus.messErrorEqaRound"));
    // }
  };


  selectAdministrativeUnit = (event, item) => {
    this.setState({ administrativeUnit: item ? item : {}, administrativeUnitId: item ? item.id : "" }, () => {
      this.search()
    })
  }

  notify = () => {
    toast.warning("Danger");
  };
  render() {
    const { t, i18n } = this.props;
    const { keyword } = this.state;
    let {
      item,
      round,
      listEQARound,
      listResult,
      result,
      status,
      isSearch,
      sampleTransferStatus,
      listTransferStatus,
      shouldOpenEditorSampleTransferStatusDialog,
      administrativeUnit, listAdministrativeUnit
    } = this.state;
    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => (
          <MaterialButton
            item={rowData}
            eqaSampleSetId={rowData.sampleSet ? rowData.sampleSet.id : null}
            onSelect={(rowData, method) => {
              if (method === 0) {
                getItemById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }

                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true
                  });
                });
              } else if (method === 1) {
                this.handleDelete(rowData.id);
              } else if (method === 2) {
                getItemById(rowData.id).then(({ data }) => {
                  this.setState({
                    item: data,
                    shouldOpenEditorSampleTransferStatusDialog: true
                  });
                });
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        )
      },
      {
        title: t("EQAHealthOrgRoundRegister.sampleSet"),
        field: "sampleSet.name",
        align: "left",
        width: "200",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EQAHealthOrgRoundRegister.RoundName"),
        field: "round.code",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EQAHealthOrgRoundRegister.code"),
        field: "healthOrg.code",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
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
          minWidth: "300px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "300px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },

    ];


    let columnDetail = [
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => (
          <MaterialButton
            item={rowData}
            eqaSampleSetId={rowData.sampleSet ? rowData.sampleSet.id : null}
            onSelect={(rowData, method) => {
              if (method === 0) {
                getItemById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }

                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true
                  });
                });
              } else if (method === 1) {
                this.handleDelete(rowData.id);
              } else if (method === 2) {
                getItemById(rowData.id).then(({ data }) => {
                  this.setState({
                    item: data,
                    shouldOpenEditorSampleTransferStatusDialog: true
                  });
                });
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        )
      },
      {
        title: t("EQAHealthOrgRoundRegister.sampleSet"),
        field: "sampleSet.name",
        align: "left",
        width: "200px",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EQAHealthOrgRoundRegister.RoundName"),
        field: "round.code",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
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
          minWidth: "300px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "300px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EQAHealthOrgRoundRegister.code"),
        field: "healthOrg.code",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EQAHealthOrgRoundRegister.status"),
        field: "status",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          rowData.status == LocalConstants.EQAHealthOrgRoundRegister_Value.new ? (
            <small className="border-radius-4 text-black px-8 py-2 " style={{ backgroundColor: '#FFFF33' }}>
              {t("EQAHealthOrgRoundRegister.Status.New")}
            </small>
          ) : rowData.status == LocalConstants.EQAHealthOrgRoundRegister_Value.confirmed ? (
            <small className="border-radius-4 px-8 py-2 " style={{ backgroundColor: '#3366FF' }}>
              {t("EQAHealthOrgRoundRegister.Status.Confirmed")}
            </small>
          ) : rowData.status == LocalConstants.EQAHealthOrgRoundRegister_Value.cancel_Registration ? (
            <small className="border-radius-4 px-8 py-2 " style={{ backgroundColor: '#FF0000', color: "#ffffff" }}>
              {t("EQAHealthOrgRoundRegister.Status.Cancel_Registration")}
            </small>
          ) : (
                  ""
                )
      },
      {
        title: t("EQAHealthOrgRoundRegister.HasResult.title"),
        field: "hasResult",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
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
        title: t("EQAHealthOrgRoundRegister.FeeStatus.title"),
        field: "fee",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          rowData.feeStatus == 1 ? (
            <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
              {t("EQAHealthOrgRoundRegister.FeeStatus.Yes")}
            </small>
          ) : (
              <small className="border-radius-4 bg-light-gray px-8 py-2 ">
                {t("EQAHealthOrgRoundRegister.FeeStatus.No")}
              </small>
            )
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.title"),
        field: "sampleTransferStatus",
        align: "left",
        width: "300",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => {
          return rowData.sampleTransferStatus ? (
            rowData.sampleTransferStatus === LocalConstants.TransferStatus_Value.received ? (
              <small
                className="border-radius-4 text-white px-8 py-2 "
                style={{ backgroundColor: "#52FF33" }}
              >
                {t("EQAHealthOrgSampleTransferStatus.received")}
              </small>
            ) : rowData.sampleTransferStatus === LocalConstants.TransferStatus_Value.delivered ? (
              <small
                className="border-radius-4 text-white px-8 py-2"
                style={{ backgroundColor: "#3361FF" }}
              >
                {t("EQAHealthOrgSampleTransferStatus.delivered")}
              </small>
            ) : rowData.sampleTransferStatus === LocalConstants.TransferStatus_Value.wait_for_transfer ? (
              <small
                className="border-radius-4 text-white px-8 py-2 "
                style={{ backgroundColor: "orange" }}
              >
                {t("EQAHealthOrgSampleTransferStatus.wait_for_transfer")}
              </small>
            ) : rowData.sampleTransferStatus === LocalConstants.TransferStatus_Value.no_sample_received ? (
              <small
                className="border-radius-4 text-white px-8 py-2 "
                style={{ backgroundColor: "#FF5833" }}
              >
                {t("EQAHealthOrgSampleTransferStatus.no_sample_received")}
              </small>
            ) : (
                      ""
                    )
          ) : (
              ""
            );
        }
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.delivery_date"),
        field: "deliveryDate",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
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
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
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
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => {
          return rowData.sampleTransferStatusRef ? (
            rowData.sampleTransferStatusRef === LocalConstants.TransferStatusRef_Value.Delivered_Pi ? (
              <small
                className="border-radius-4 text-white px-8 py-2 "
                style={{ backgroundColor: "#3361FF" }}
              >
                {t("EQAHealthOrgSampleTransferStatus.delivered_pi")}
              </small>
            ) : rowData.sampleTransferStatusRef === LocalConstants.TransferStatusRef_Value.Received_Health_Org ? (
              <small
                className="border-radius-4 text-white px-8 py-2"
                style={{ backgroundColor: "#3361FF" }}
              >
                {t("EQAHealthOrgSampleTransferStatus.received_health_org")}
              </small>
            ) : rowData.sampleTransferStatusRef === LocalConstants.TransferStatusRef_Value.Sample_Resend_Unit ? (
              <small
                className="border-radius-4 text-white px-8 py-2 "
                style={{ backgroundColor: "orange" }}
              >
                {t("EQAHealthOrgSampleTransferStatus.sample_resend_unit")}
              </small>
            ) : rowData.sampleTransferStatusRef === LocalConstants.TransferStatusRef_Value.Received_Pi ? (
              <small
                className="border-radius-4 text-white px-8 py-2 "
                style={{ backgroundColor: "#52FF33" }}
              >
                {t("EQAHealthOrgSampleTransferStatus.received_pi")}
              </small>
            ) : (
                      ""
                    )
          ) : (
              ""
            );
        }
      },
      {
        title: t("EQAHealthOrgSampleTransferStatus.delivered_date_ref"),
        field: "deliveryDateRef",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
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
        width: "150",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
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
              {t("EQAHealthOrgRoundRegister.title")} | {t("web_site")}
            </title>
          </Helmet>
          <Breadcrumb
            routeSegments={[{ name: t("EQAHealthOrgRoundRegister.title") }]}
          />
        </div>
        <Grid  container spacing={1}>
          <Grid item lg={6} md={6} sm={12} xs={12}>

            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={this.handleOpenEditorMultipleDialog}
            >
              {t("Add")}
            </Button>
            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() =>
                this.setState({ shouldOpenConfirmationDeleteAllDialog: true })
              }
            >
              {t("Delete")}
            </Button>
            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={this.handleUpdateStatus}
            >
              {t("general.update")}
            </Button>
            {/* <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={this.handleExportExcel}
            >
              {t("exportExcel")}
            </Button> */}

            <Button
              className="mb-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => {
                if (this.state.isViewDetails) {
                  this.setState({ isViewDetails: false })
                } else {
                  this.setState({ isViewDetails: true })
                }
              }}
            >
              {this.state.isViewDetails ? t("EQAHealthOrgRoundRegister.compact") : t("EQAHealthOrgRoundRegister.details")}
            </Button>
            {this.state.shouldOpenConfirmationDeleteAllDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenConfirmationDeleteAllDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleDeleteAll}
                text={t("DeleteAllConfirm")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}

            {this.state.shouldOpenConfirmationUpdateStatus && (
              <EQAHealthOrgRoundRegisterUpdateStatus
                t={t}
                i18n={i18n}
                handleClose={this.handleDialogClose}
                open={this.state.shouldOpenConfirmationUpdateStatus}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
              />
            )
            }
          </Grid>
          <Grid item container lg={6} md={6} sm={12} xs={12} spacing={2}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <Autocomplete
                size="small"
                id="combo-box"
                options={listEQARound}
                className=""
                getOptionLabel={option => option.code}
                onChange={this.handleFilterEQARound}
                value={round ? round : null}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t("EQARound.title")}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={10} xs={10}>
              <FormControl fullWidth>
                <Input
                  className="search_box w-100 mt-8 stylePlaceholder"
                  type="text"
                  name="keyword"
                  value={keyword}
                  onChange={this.handleTextChange}
                  onKeyDown={this.handleKeyDownEnterSearch}
                  placeholder={t("general.enterSearch")}
                  id="search_box"
                  startAdornment={
                    <InputAdornment>
                      <Link to="#">
                        {" "}
                        <SearchIcon
                          onClick={() => this.search(keyword)}
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
              </FormControl>
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={2}>
              <Button
                className="mr-8"
                variant="contained"
                color="primary"
                onClick={() => {
                  if (this.state.isSearch) {
                    this.setState({ isSearch: false, transferStatus: null, hasResult: null })
                    this.search()
                  } else {
                    this.setState({ isSearch: true })
                    this.search()
                  }
                }}
              >
                <ArrowDropDownIcon />
              </Button>
            </Grid>
          </Grid>

          {isSearch && (<Grid container spacing={2} alignItems="flex-end" style={{ backgroundColor: "#fafafa" }}>
            <Grid item lg={3} md={3} sm={12} xs={12}>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Autocomplete
                size="small"
                id="combo-box"
                options={listAdministrativeUnit}
                className="flex-end"
                getOptionLabel={option => option.name}
                onChange={this.selectAdministrativeUnit}
                value={administrativeUnit ? administrativeUnit : null}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t("AdministrativeUnit.title")}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Autocomplete
                id="list-transfer-status"
                size="small"
                options={listResult}
                className="flex-end"
                autoHighlight
                getOptionLabel={(option) => option.name}
                onChange={this.handleFilterResult}
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
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Autocomplete
                id="list-transfer-status"
                size="small"
                options={listTransferStatus}
                className="flex-end"
                autoHighlight
                getOptionLabel={(option) => option.name}
                onChange={this.handleFilterSampleTransferStatus}
                value={status ? status : null}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t("EQAHealthOrgRoundRegister.filterTransferStatus")}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>)}

          <Grid item xs={12}>
            <div>
              {this.state.shouldOpenEditorDialog && (
                <EQAHealthOrgRoundRegisterEditorDialog
                  t={t}
                  i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEditorDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                  listTube={this.state.eqaSampleTubes}
                  isView={true}
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

              {this.state.shouldOpenEditorMultipleDialog && (
                <EQAHealthOrgRoundRegisterEditorMultipleDialog
                  t={t}
                  i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEditorMultipleDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  toast={toast}
                />
              )}
              {this.state.shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  text={t("DeleteConfirm")}
                  Yes={t("general.Yes")}
                  No={t("general.No")}
                />
              )}
            </div>
            <MaterialTable
              title={t("List")}
              data={this.state.itemList}
              columns={this.state.isViewDetails ? columnDetail : columns}
              //parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
              parentChildData={(row, rows) => {
                var list = rows.find(a => a.id === row.parentId);
                return list;
              }}
              style={{ width: "100%" }}
              options={{
                selection: true,
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
                  color: '#fff',
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
            // actions={[
            //   {
            //     tooltip: "Remove All Selected Users",
            //     icon: "delete",
            //     onClick: (evt, data) => {
            //       this.handleDeleteAll(data);
            //       alert("You want to delete " + data.length + " rows");
            //     }
            //   }
            // ]}
            />
            <TablePagination
              align="left"
              className="px-16"
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              labelRowsPerPage={t('general.rows_per_page')}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
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
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default EQAHealthOrgRoundRegister;
