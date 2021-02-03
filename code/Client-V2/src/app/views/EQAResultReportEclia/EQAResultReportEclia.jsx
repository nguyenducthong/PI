import { FormControl, Input, Radio, InputAdornment, Grid, MuiThemeProvider, IconButton, Icon, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination } from "@material-ui/core";
import moment from "moment";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { deleteItem, saveItem, getItemById, searchByPage } from "./EQAResultReportEcliaService";
import EQAResultReportEcliaEditorDialog from "./EQAResultReportEcliaEditorDialog";
import EQAResultReportEcliaDialog from "./EQAResultReportEcliaDialog";
import EQAResultReportViewDialog from "./EQAResultReportViewDialog";
import EQAResultReportEcliaPrint from "./EQAResultReportEcliaPrint";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import { MuiPickersUtilsProvider, DateTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { searchByPage as searchByPageHealthOrgRound } from "../EQAHealthOrgRoundRegister/EQAHealthOrgRoundRegisterService";
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from "@date-io/date-fns";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { getCurrentUser, getListHealthOrgByUser } from "../User/UserService"
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return <div>
    <IconButton onClick={() => props.onSelect(item, 2)}>
      <Icon color="primary"><VisibilityIcon /></Icon>
    </IconButton>
    <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton>
    {props.isRoleAdmin && (<IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton>)}
    <IconButton size="small" onClick={() => props.onSelect(item, 3)}>
      <Icon fontSize="small" color="primary">print</Icon>
    </IconButton>
  </div>;
}
class EQAResultReportEclia extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenViewDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    listEQARound: [],
    keyword: '',
    round: null,
    startDate: null,
    endDate: null,
    shouldOpenConfirmationEditDialog: false,
    shouldOpenDialog: false,
    isSearch: false,
    shouldOpenPrintDialog: false
  }
  constructor(props) {
    super(props);
    this.handleTextSearchChange = this.handleTextSearchChange.bind(this);
  }

  handleTextSearchChange = event => {
    this.setState({ keyword: event.target.value }, function () {
    })
  };
  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter') {
      this.search()
    }
  }
  search() {
    var searchObject = {};
    searchObject.typeMethod = 4;
    searchObject.text = this.state.keyword.trim();
    searchObject.round = this.state.round ? this.state.round : null;
    searchObject.startDate = this.state.startDate;
    searchObject.endDate = this.state.endDate;
    searchObject.pageIndex = 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  }

  componentDidMount() {
    let searchObject = { pageIndex: 0, pageSize: 1000000 }
    searchByPageEQARound(searchObject).then(({ data }) => {
      if (data != null && data.content.length > 0) {
        this.setState({ listEQARound: [...data.content] }, () => {
        });
      };
    });
    this.updatePageData();
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.round = this.state.round ? this.state.round : null;
    searchObject.startDate = this.state.startDate;
    searchObject.endDate = this.state.endDate;
    searchObject.typeMethod = 4;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  };

  handleDateChange = (date, name) => {
    if (name == "startDate") {
      this.setState({ startDate: date }, () => {
        this.search();
      })
    }
    if (name == "endDate") {
      this.setState({ endDate: date }, () => {
        this.search();
      })
    }
  };
  handleFilterEQARound = (event, round, reason, details) => {
    if (round != null) {
      this.setState({ round: round }, () => {
        let searchObject = {};
        searchObject.round = this.state.round
        searchObject.pageIndex = this.state.page
        searchObject.pageSize = this.state.rowsPerPage
        searchByPage(searchObject).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            round: round
          })
        })
      });
      if (reason == 'clear') {
        this.setState({ round: null })
      }
    } else {
      this.setState({ round: null }, () => {
        let searchObject = {};
        searchObject.round = null
        searchObject.pageIndex = this.state.page
        searchObject.pageSize = this.state.rowsPerPage
        searchByPage(searchObject).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            round: round
          })
        })
      });
    }
  }

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    })
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationEditDialog: false,
      shouldOpenViewDialog: false,
      shouldOpenDialog: false,
      shouldOpenPrintDialog: false
    });
    this.setPage(0);
  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationEditDialog: false,
      shouldOpenViewDialog: false,
      shouldOpenDialog: false,
      shouldOpenPrintDialog: false
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationEditDialog: false,
      shouldOpenViewDialog: false,
      shouldOpenDialog: false,
      shouldOpenPrintDialog: false
    });
    this.setPage(0);
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
        toast.success(t("EqaResult.deleteSuccess"));
        this.updatePageData();
      } else {
        toast.warning(t('EqaResult.deleteError'));
      }
      this.handleDialogClose();
    }).catch((err) => {
      toast.warning(t('EqaResult.error'));
      this.handleDialogClose();
    });
  };
  handleConfirmationEdit = () => {
    this.setState({
      shouldOpenEditorDialog: true
    });
  }
  handleEditItem = item => {
    let { round } = this.state;
    let { t } = this.props;
    var searchObject = {};

    if (round != null) {
      searchObject.roundId = round.id;
      searchObject.listStatus = [0, 1];
      searchObject.isSampleTransferStatus = true;
      searchObject.pageSize = 10000;
      searchByPageHealthOrgRound(searchObject).then(({ data }) => {
        // console.log(data.content);
        if (data.content != null && data.content.length > 0) {
          item.listHealthOrgRound = data.content;
          // console.log(item);
          if (this.state.isManagementUnit) {
            this.setState({
              item: item,
              listHealthOrgRound:data.content,
              shouldOpenDialog: true
            });
          } else {
            this.setState({
              item: item,
              listHealthOrgRound:data.content,
              shouldOpenEditorDialog: true
            });
          }
        } else {
          toast.warning(t("EqaResult.noHealthOrgRound"));
        }
      })
    } else {
      toast.warning(t("EqaResult.noRound"));
    }
  };

  async handleDeleteList(list) {
    let { t } = this.props;
    let demSuccess = 0, demError = 0;
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id).then((res) => {
        if (res.data == true) {
          demSuccess++;
          // toast.success(t("EqaResult.deleteSuccess"));
          this.updatePageData();
        } else {
          demError++;
          // toast.warning(t('EqaResult.deleteError'));
        }
        this.handleDialogClose();
      }).catch((err) => {
        toast.warning(t('EqaResult.error'));
        this.handleDialogClose();
      });
    }
    if (demSuccess != 0) {
      toast.info(t("EqaResult.deleteSuccess") + " " + demSuccess);
    }
    if (demError != 0) {
      toast.info(t("EqaResult.deleteError") + " " + demError);
    }
  }

  handleDeleteAll = (event) => {
    let { t } = this.props;
    if (this.data != null) {
      this.handleDeleteList(this.data).then(() => {
        this.updatePageData();
        this.handleDialogClose();
      }
      );
    } else {
      toast.warning(t('general.select_data'));
      this.handleDialogClose();
    }
  };
  componentWillMount() {
    getCurrentUser().then(res => {
      getListHealthOrgByUser(res.data.id).then(({ data }) => {
        let checkManagementUnit = false
        let checkRoleAdmin = false
        data.forEach(item => {
          if (item.isManagementUnit) {
            checkManagementUnit = true
          }
        })
        res.data.roles.forEach(el => {
          if (el.name == "ROLE_ADMIN" || el.authority == "ROLE_ADMIN") {
            checkRoleAdmin = true
          }
        })
        if (checkRoleAdmin) {
          this.setState({ isRoleAdmin: true, isView: true })
        }
        if (!checkRoleAdmin) {
          this.setState({ isRoleAdmin: false, isView: false })
        }
        if (checkManagementUnit && checkRoleAdmin) {
          this.setState({ isManagementUnit: true, isRoleAdmin: true })
        }

      })
    })
  }
  render() {
    const { t, i18n } = this.props;
    let { startDate, endDate, keyword, listEQARound, round, isSearch } = this.state;

    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "center",
        width: "250",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "0px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => <MaterialButton item={rowData} isRoleAdmin={this.state.isRoleAdmin}
          onSelect={(rowData, method) => {
            if (method === 0) {
              getItemById(rowData.id).then(({ data }) => {
                if (data.parent === null) {
                  data.parent = {};
                }
                if (rowData.isEditAble && this.state.isRoleAdmin) {
                  this.setState({
                    item: data,
                    shouldOpenDialog: true//pi
                  })
                  return
                }
                if (!data.isFinalResult || rowData.isFinalResult == null) {
                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true
                  })
                  return
                }
                if (data.isFinalResult) {
                  if (!this.state.isRoleAdmin || this.state.isRoleAdmin == null) {
                    toast.warning(t("EQAResultReportFastTest.warningEdit"))
                    return
                  }
                  if (this.state.isRoleAdmin) {
                    this.setState({
                      item: data,
                      shouldOpenConfirmationEditDialog: true
                    })
                  }

                }
                // this.setState({
                //   item: data,
                //   shouldOpenEditorDialog: true
                // });
              })
            } else if (method === 1) {
              this.handleDelete(rowData.id);
            } else if (method === 2) {
              getItemById(rowData.id).then(({ data }) => {
                if (data.parent === null) {
                  data.parent = {};
                }
                this.setState({
                  item: data,
                  shouldOpenViewDialog: true
                });
              })
            } else if (method === 3) {
              getItemById(rowData.id).then(({ data }) => {
                if (data.parent === null) {
                  data.parent = {};
                }
                this.setState({
                  item: data,
                  shouldOpenPrintDialog: true
                });
              })
            }
            else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
      {
        title: t("EqaResult.round"), field: "healthOrgRound.round.code", align: "left", width: "150",
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
        title: t("EqaResult.healthOrgName"), field: "healthOrgRound.healthOrg.name", width: "150",
        headerStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EqaResult.testDate"), field: "testDate", align: "left", width: "150",
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
          (rowData.testDate) ? <span>{moment(rowData.testDate).format('DD/MM/YYYY')}</span> : ''
      },
      {
        title: t("EqaResult.technician"), field: "technicianName", align: "left", width: "150",
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
        title: t("EqaResult.reagent"), field: "reagentName", align: "left", width: "150",
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
        title: t("EqaResult.dateSubmitResults"), field: "dateSubmitResults", align: "left", width: "150",
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
          (rowData.dateSubmitResults) ? <span>{moment(rowData.dateSubmitResults).format('DD/MM/YYYY')}</span> : ''
      },
      {
        title: t("EqaResult.finalResult"), field: "isFinalResult", align: "center", width: "150",
        headerStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        render: rowData => <Radio name="radSelected" value={rowData.isFinalResult} checked={rowData.isFinalResult}
        />
      },

    ];
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>{t("EQAResultReportEclia.title")} | {t("web_site")}</title>
          </Helmet>
          <Breadcrumb routeSegments={[{ name: t("EqaResult.title"), path: "/directory/apartment" }, { name: t("EQAResultReportEclia.title") }]} />
        </div>
        <Grid container spacing={3}>
          {this.state.isRoleAdmin ? (<Grid item container spacing={2}>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <Autocomplete
                size="small"
                id="combo-box"
                options={listEQARound}
                className="flex-end w-100"
                getOptionLabel={(option) => option.code}
                onChange={this.handleFilterEQARound}
                value={round}
                renderInput={(params) => <TextField {...params}
                  label={t('general.fillterByRoundEQA')}
                  variant="outlined"
                />}
              />
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  size="small"
                  inputVariant="outlined"
                  className="ml-8 w-100"
                  label={t("EQAResultReportElisa.startDate")}
                  type="text"
                  format="dd/MM/yyyy"
                  value={startDate}
                  onChange={date => this.handleDateChange(date, "startDate")}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  size="small"
                  inputVariant="outlined"
                  className="w-100"
                  label={t("EQAResultReportElisa.endDate")}
                  type="text"
                  format="dd/MM/yyyy"
                  value={endDate}
                  onChange={date => this.handleDateChange(date, "endDate")}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={12} >
              <FormControl fullWidth>
                <Input
                  className='search_box w-100 mt-8 stylePlaceholder'
                  type="text"
                  name="keyword"
                  value={keyword}
                  onChange={this.handleTextSearchChange}
                  onKeyDown={this.handleKeyDownEnterSearch}
                  placeholder={t('general.enterSearch')}
                  id="search_box"
                  startAdornment={
                    <InputAdornment >
                      <Link to="#"> <SearchIcon
                        onClick={() => this.search(keyword)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0"
                        }} /></Link>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
          ) : (<Grid item container spacing={1}>
            <Grid item md={3} sm={6} xs={12}>
              <Button
                className=" mr-16"
                variant="contained"
                color="primary"
                onClick={() => {
                  this.handleEditItem({ startDate: new Date(), endDate: new Date() });
                }
                }
              >
                {t('Add')}
              </Button>
              {/* <Button className="mb-16 mr-36" variant="contained" color="primary"
              onClick={() => this.setState({ shouldOpenConfirmationDeleteAllDialog: true })}>
              {t('Delete')}
            </Button> */}

            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Autocomplete
                size="small"
                id="combo-box"
                options={listEQARound}
                className="flex-end"
                getOptionLabel={(option) => option.code}
                onChange={this.handleFilterEQARound}
                value={round}
                renderInput={(params) => <TextField {...params}
                  label={t('general.fillterByRoundEQA')}
                  variant="outlined"
                />}
              />
            </Grid>
            <Grid item md={4} sm={11} xs={11} >
              <FormControl fullWidth>
                <Input
                  className='search_box w-100 stylePlaceholder'
                  type="text"
                  name="keyword"
                  value={keyword}
                  onChange={this.handleTextSearchChange}
                  onKeyDown={this.handleKeyDownEnterSearch}
                  placeholder={t('general.enterSearch')}
                  id="search_box"
                  startAdornment={
                    <InputAdornment >
                      <Link to="#"> <SearchIcon
                        onClick={() => this.search(keyword)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0"
                        }} /></Link>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Grid item md={1} sm={1} xs={11}>
              <Button
                className=""
                variant="contained"
                color="primary"
                onClick={() => {
                  if (this.state.isSearch) {
                    this.setState({ isSearch: false, startDate: null, endDate: null })
                    this.search()
                  } else {
                    this.setState({ isSearch: true })
                    this.search()
                  }
                }}
              >
                <ArrowDropDownIcon />
                {/* {t('general.exportToExcel')} */}
              </Button>
            </Grid>
            {isSearch && (<Grid container spacing={2} alignItems="flex-end" style={{ backgroundColor: "#fafafa" }}>
              {/* <div>Tìm kiếm nâng cao</div> */}
              <Grid item md={3} sm={12} xs={12}>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    size="small"
                    inputVariant="outlined"
                    className=""
                    label={t("EQAResultReportElisa.startDate")}
                    type="text"
                    format="dd/MM/yyyy"
                    value={startDate}
                    onChange={date => this.handleDateChange(date, "startDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    size="small"
                    inputVariant="outlined"
                    className=""
                    label={t("EQAResultReportElisa.endDate")}
                    type="text"
                    format="dd/MM/yyyy"
                    value={endDate}
                    onChange={date => this.handleDateChange(date, "endDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>

            )}
            {this.state.shouldOpenConfirmationDeleteAllDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenConfirmationDeleteAllDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleDeleteAll}
                text={t('DeleteAllConfirm')}
                Yes={t('general.Yes')}
                No={t('general.No')}
              />
            )}
          </Grid>
            )}

          <Grid item xs={12}>
            <div>
              {this.state.shouldOpenEditorDialog && (
                <EQAResultReportEcliaEditorDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEditorDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                  isRoleAdmin={this.state.isRoleAdmin}
                  isView={this.state.isView}
                  listHealthOrgRound ={this.state.listHealthOrgRound}
                />
              )}
              {this.state.shouldOpenViewDialog && (
                <EQAResultReportViewDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenViewDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                />
              )}
              {this.state.shouldOpenDialog && (
                <EQAResultReportEcliaDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                  isRoleAdmin={this.state.isRoleAdmin}
                  isView={this.state.isView}
                />
              )}

              {this.state.shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  text={t('DeleteConfirm')}
                  Yes={t('general.Yes')}
                  No={t('general.No')}
                />
              )}
              {this.state.shouldOpenConfirmationEditDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationEditDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationEdit}
                  text={t('EQAResultReportFastTest.editConfirm')}
                  Yes={t('general.Yes')}
                  No={t('general.No')}
                />
              )}
              {this.state.shouldOpenPrintDialog && (
                <EQAResultReportEcliaPrint t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenPrintDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                  print={true}
                // isRoleAdmin={this.state.isRoleAdmin}
                // isView={this.state.isView}
                />
              )}
            </div>
            <MaterialTable
              title={t('EQAResultReportEclia.list')}
              data={this.state.itemList}
              columns={columns}
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
                  color: '#fff',
                },
                padding: 'dense',
                toolbar: false
              }}
              components={{
                Toolbar: props => (
                  <MTableToolbar {...props} />
                ),
              }}
              onSelectionChange={(rows) => {
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
              rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
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

    )
  }
}
export default EQAResultReportEclia;