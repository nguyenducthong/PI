import {
  InputAdornment,
  Input,
  Grid,
  MuiThemeProvider,
  IconButton,
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
  handleCancelRegistration,
  reRegisterEQARound,
  getItemById,
  searchByPage
} from "./HealthOrgRegisterFormService";
import HealthOrgRegisterFormEditorDialog from "./HealthOrgRegisterFormEditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContinuousColorLegend } from "react-vis";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div>
      {item.status != -1 && (
        <IconButton size="small"
          onClick={() => props.onSelect(item, 1)}
          title= {t("EQAHealthOrgRoundRegister.Status.cancelRegistration")}
        >
          <span fontSize="small" class="material-icons" style={{ color: "#f44336" }}>
            cancel
          </span>
        </IconButton>
      )}
      {item.status == -1 && (
        <IconButton size="small"
          onClick={() => props.onSelect(item, 0)}
          title={t("EQAHealthOrgRoundRegister.Status.registration")}
        >
          <span fontSize="small" class="material-icons" style={{ color: "#7467ef" }}>
            add_circle
          </span>
        </IconButton>
      )}
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
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    text: "",
    listEQARound: [],
    round: null,
    shouldOpenConfirmationDialog:false
  };

  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search() {
    var searchObject = {};
    searchObject.text = this.state.text;
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
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  componentDidMount() {
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    searchByPageEQARound(searchObject).then(({ data }) => {
      if (data != null && data.content.length > 0) {
        this.setState({ listEQARound: [...data.content] }, () => {});
      }
    });
    this.updatePageData();
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.text;
    if (this.state.round != null) {
      searchObject.roundId = this.state.round.id;
    }
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState(
          { itemList: [...data.content], totalElements: data.totalElements },
          // () => console.log(this.state.itemList)
        );
      }
    );
  };
  setPage = page => {
    this.setState({ page }, function() {
      this.updatePageData();
    });
  };
  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationEditDialog:false,
      shouldOpenConfirmationViewDialog:false,
      shouldOpenDialog: false
    });
    this.setPage(0);
  };
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationEditDialog:false,
      shouldOpenConfirmationViewDialog:false,
      shouldOpenDialog: false
    });
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationEditDialog:false,
      shouldOpenConfirmationViewDialog:false,
      shouldOpenDialog: false
    });
    this.setPage(0);
  };
  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function() {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
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
  handleResult =()=>{
    let {t}= this.props
    if (this.state.roundData.round && this.state.roundData.round.id) {
      this.state.roundData.status = 0;
      reRegisterEQARound(this.state.roundData).then(({ data }) => {
        if (data && data.id) {
          toast.info(t("EQAHealthOrgRoundRegister.notify.addSuccess"));
          this.search();
        } else {
          toast.error(t("EQAHealthOrgRoundRegister.notify.errorRegistration"));
        }
      });
    }
    this.handleDialogClose()
  }
  handleFinalResult =()=>{
    let {t}= this.props
    handleCancelRegistration(this.state.roundDataId).then(({ data }) => {
      if (data && data.id) {
        toast.info(t("EQAHealthOrgRoundRegister.notify.unsubscribeSuccessfully"));
        this.search();
      } else {
        toast.error(t("EQAHealthOrgRoundRegister.notify.errorCancelRegistration"));
      }
    }).catch(() => {
      toast.error(t("EQAHealthOrgRoundRegister.notify.error"));
    });
    this.handleDialogClose()
  }
  render() {
    const { t, i18n } = this.props;
    const { text, listEQARound, round,isFinalResult } = this.state;
    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        headerStyle: {
          minWidth:"100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth:"100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 1) {
                //hủy đăng ký
                this.setState({shouldOpenConfirmationDialog:true,roundDataId:rowData.id})
                // handleCancelRegistration(rowData.id).then(({ data }) => {
                //   if (data && data.id) {
                //     toast.info(t("EQAHealthOrgRoundRegister.notify.unsubscribeSuccessfully"));
                //     this.search();
                //   } else {
                //     toast.error(t("EQAHealthOrgRoundRegister.notify.errorCancelRegistration"));
                //   }
                // }).catch(() => {
                //   toast.error(t("EQAHealthOrgRoundRegister.notify.error"));
                // });
              } else if (method === 0) {
                //đăng ký
                this.setState({shouldOpenDialog:true,roundData:rowData})
                // if (this.state.roundData.round && this.state.roundData.round.id) {
                //   roundData.status = 0;
                //   reRegisterEQARound(roundData).then(({ data }) => {
                //     if (data && data.id) {
                //       toast.info(t("EQAHealthOrgRoundRegister.notify.addSuccess"));
                //       this.search();
                //     } else {
                //       toast.error(t("EQAHealthOrgRoundRegister.notify.errorRegistration"));
                //     }
                //   });
                // }
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        )
      },
      {
        title: t("EQAHealthOrgRoundRegister.RoundName"),
        field: "round.code",
        width: "150",
        headerStyle: {
          minWidth:"150px",
          paddingLeft: "0px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth:"150px",
          paddingLeft: "0px",
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
          textAlign: "left",
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
      },
      {
        title: t("Status"),
        field: "status",
        align: "left",
        width: "150",
        headerStyle: {
          textAlign: "left",
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
        render: rowData => <StatusReturn item={rowData} />
      },
      {
        title: t("EQAHealthOrgRoundRegister.HasResult.title"),
        field: "hasResult",
        width: "150",
        headerStyle: {
          textAlign: "left",
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
        title: t("EQAHealthOrgRoundRegister.FeeStatus.title"),
        field: "fee",
        align: "left",
        width: "150",
        headerStyle: {
          textAlign: "left",
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
      
    ];
    return (
      <Grid container spacing={2} className={"flex-end"}>
        <Helmet>
          <title>
            {t("EQAHealthOrgRoundRegister.titlePage")} | {t("web_site")}
          </title>
        </Helmet>
        <Grid container spacing={3}>
        {this.state.shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenConfirmationDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleFinalResult}
                text={t("HealthOrgRegisterForm.noRegister")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
            {this.state.shouldOpenDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleResult}
                text={t("HealthOrgRegisterForm.Register")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
          <Grid item md={6} sm={6} xs={6}></Grid>
          <Grid item md={3} sm={12} xs={12}>
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
          <Grid item md={3} sm={12} xs={12}>
            <Input
              label={t("EnterSearch")}
              className="mb-16 search_box w-100 stylePlaceholder"
              type="text"
              name="text"
              value={text}
              onKeyDown={this.handleKeyDownEnterSearch}
              onChange={this.handleTextChange}
              placeholder={t('general.enterSearch')}
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
        <Grid item xs={12}>
          <div>
            {this.state.shouldOpenEditorDialog && (
              <HealthOrgRegisterFormEditorDialog
                t={t}
                i18n={i18n}
                handleClose={this.handleDialogClose}
                open={this.state.shouldOpenEditorDialog}
                handleOKEditClose={this.handleOKEditClose}
                item={this.state.item}
              />
            )}

            {/* {this.state.shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenConfirmationDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleConfirmationResponse}
                text={t("DeleteConfirm")}
              />
            )} */}
          </div>
          <MaterialTable
            // title={t('List')}
            data={this.state.itemList}
            columns={columns}
            //parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
            parentChildData={(row, rows) => {
              var list = rows.find(a => a.id === row.parentId);
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
                },
                padding: 'dense',
                toolbar: false
              }}
            components={{
              Toolbar: props => <MTableToolbar {...props} />
            }}
            onSelectionChange={rows => {
              this.data = rows;
              // this.setState({selectedItems:rows});
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
            rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
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
        </Grid>
      </Grid>
    );
  }
}
export default EQARoundIsActiveForm;
