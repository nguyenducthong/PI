import {
  InputAdornment,
  Input,
  Grid,
  TextField,
  IconButton,
  Icon,
  Button,
  TableHead,
  TableCell,
  TableRow,
  Checkbox,
  TablePagination,
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import {
  getByPage,
  deleteItem,
  saveItem,
  getItemById,
  searchByPage,
} from "./EQAHealthOrgService";
import { getByPage as getByPageAdministrativeUnit } from "../AdministrativeUnit/AdministrativeUnitService";
import EQAHealthOrgEditorDialog from "./EQAHealthOrgEditorDialog";
import { getItemByIdRoundRegister } from "../EQAHealthOrgRoundRegister/EQAHealthOrgRoundRegisterService";
import EQAHealthOrgRoundRegisterDialog from "../EQAHealthOrgRoundRegister/EQAHealthOrgRoundRegisterEditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { getCurrentUser } from "../User/UserService";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImportExcelDialog from "./ImportExcelDialog";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3,
});
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div>
      {/* {!props.isHealthOrg && (
        <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
          <Icon fontSize="small" color="primary">
            add
          </Icon>
        </IconButton>
      )} */}
      <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
        <Icon fontSize="small" color="primary">
          edit
        </Icon>
      </IconButton>
      {!props.isHealthOrg && (
        <IconButton size="small" onClick={() => props.onSelect(item, 2)}>
          <Icon fontSize="small" color="error">
            delete
          </Icon>
        </IconButton>
      )}
    </div>
  );
}
class EQAHealthOrgTable extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    shouldOpenRoundRegisterEditorDialog: false,
    keyword: "",
    administrativeUnitId: "",
    administrativeUnit: {},
    administrativeList: [],
    isHealthOrg: false,
    shouldOpenImportExcelDialog: false,
  };

  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(event) {
    this.setState({ keyword: event.target.value });
  }

  handleKeyDownEnterSearch = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  handleChangeRound() {
    this.setState({
      shouldOpenRoundRegisterEditorDialog: true,
    });
  }
  search() {
    this.setState({ page: 0 }, function () {
      var searchObject = {};
      searchObject.text = this.state.keyword;
      searchObject.administrativeUnitId = this.state.administrativeUnitId;
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject).then(({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
        });
      });
    });
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.administrativeUnitId = this.state.administrativeUnitId;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements,
      });
    });
  };

  componentDidMount() {
    let { isHealthOrg } = this.state;
    var searchObject = { pageIndex: 1, pageSize: 10000 };
    getCurrentUser().then(({ data }) => {
      if (data.roles != null && data.roles.length > 0) {
        data.roles.forEach((element) => {
          if (element.name == "ROLE_HEALTH_ORG") {
            isHealthOrg = true;
          }
        });
      }
      this.setState({ isHealthOrg: isHealthOrg });
    });
    this.updatePageData();
    getByPageAdministrativeUnit(searchObject).then(({ data }) => {
      this.setState({
        administrativeList: [...data.content],
      });
    });
  }

  handleFilterAdministrative = (event, administrativeUnit) => {
    if (administrativeUnit != null && administrativeUnit.id != null) {
      this.setState({ administrativeUnitId: administrativeUnit.id }, () => {
        this.search();
      });
    } else {
      this.setState({ administrativeUnitId: null });
      this.search();
    }
  };
  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenImportExcelDialog: false,
    });
    this.setPage(0);
  };

  handleDelete = (id) => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true,
    });
  };
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenRoundRegisterEditorDialog: false,
      shouldOpenImportExcelDialog: false,
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenRoundRegisterEditorDialog: false,
      shouldOpenImportExcelDialog: false,
    });
    this.setPage(0);
  };

  handleDelete = (id) => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true,
    });
  };

  handleConfirmationResponse = () => {
    let { t } = this.props;
    deleteItem(this.state.id)
      .then(() => {
        this.updatePageData();
        this.handleDialogClose();
        toast.success(t("deleteSuccess"));
      })
      .catch(() => {
        toast.warning(t("error"));
        this.handleDialogClose();
      });
  };
  handleEditItem = (item) => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true,
    });
  };

  handleDelete = (id) => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true,
    });
  };

  async handleDeleteList(list) {
    let { t } = this.props;
    let demSuccess = 0,
      demError = 0;
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id)
        .then((res) => {
          demSuccess++;
          // toast.success(t("deleteSuccess") + " " + list[i].code);
          this.updatePageData();
          this.handleDialogClose();
        })
        .catch((err) => {
          demError++;
          // toast.warning(t('error'));
          this.handleDialogClose();
        });
    }
    if (demSuccess != 0) {
      toast.success(t("deleteSuccess") + " " + demSuccess);
    }
    if (demError != 0) {
      toast.warning(t("error") + " " + demError);
    }
  }

  handleDeleteAll = (event) => {
    let { t } = this.props;
    if (this.data != null) {
      this.handleDeleteList(this.data).then(() => {
        this.updatePageData();
        this.handleDialogClose();
      });
    } else {
      toast.warning(t("general.select_data"));
      this.handleDialogClose();
    }
  };
  importExcel = () => {
    this.setState({
      shouldOpenImportExcelDialog: true,
    });
  };
  render() {
    const { t, i18n } = this.props;
    let {
      keyword,
      rowsPerPage,
      page,
      totalElements,
      itemList,
      administrativeUnit,
      administrativeList,
      item,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog,
      shouldOpenConfirmationDeleteAllDialog,
      shouldOpenImportExcelDialog,
      isHealthOrg,
    } = this.state;

    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "center",
        width: "250",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        cellStyle: { whiteSpace: "nowrap" },
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            isHealthOrg={isHealthOrg}
            onSelect={(rowData, method) => {
              if (method === 0) {
                getItemById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: { healthOrg: data },
                    shouldOpenRoundRegisterEditorDialog: true,
                  });
                });
              } else if (method === 1) {
                getItemById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true,
                  });
                });
              } else if (method === 2) {
                this.handleDelete(rowData.id);
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        ),
      },
      {
        title: t("EQAHealthOrg.Name"),
        field: "name",
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
        title: t("EQAHealthOrg.Code"),
        field: "code",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "175px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "175px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EQAHealthOrg.ContactName"),
        field: "contactName",
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
        title: t("EQAHealthOrg.Address"),
        field: "address",
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
        title: t("EQAHealthOrg.contactPhone"),
        field: "contactPhone",
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
    ];
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>
              {t("EQAHealthOrg.title")} | {t("web_site")}
            </title>
          </Helmet>
          <Breadcrumb
            routeSegments={[
              { name: t("category"), path: "/directory/apartment" },
              { name: t("EQAHealthOrg.title") },
            ]}
          />
        </div>
        <Grid container spacing={3}>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            {!isHealthOrg && (
              <Button
                className="mb-16 mr-16 align-bottom"
                variant="contained"
                color="primary"
                onClick={() => {
                  this.handleEditItem({
                    startDate: new Date(),
                    endDate: new Date(),
                  });
                }}
              >
                {t("Add")}
              </Button>
            )}
            {!isHealthOrg && (
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
            )}
            {/* {!isHealthOrg && (
              <Button
                className="align-bottom mb-16"
                variant="contained"
                color="primary"
                onClick={this.importExcel}
              >
                {t("general.importExcel")}
              </Button>
            )} */}
            {shouldOpenImportExcelDialog && (
              <ImportExcelDialog
                t={t}
                i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenImportExcelDialog}
                handleOKEditClose={this.handleOKEditClose}
              />
            )}
            {shouldOpenConfirmationDeleteAllDialog && (
              <ConfirmationDialog
                open={shouldOpenConfirmationDeleteAllDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleDeleteAll}
                title={t("confirm")}
                text={t("DeleteAllConfirm")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
          </Grid>
          {!isHealthOrg && (
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Autocomplete
                size="small"
                id="combo-box"
                options={administrativeList}
                className="flex-end"
                getOptionLabel={(option) => option.name}
                onChange={this.handleFilterAdministrative}
                value={administrativeUnit ? administrativeUnit.name : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("EQAHealthOrg.AdministrativeUnit")}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          )}

          {!isHealthOrg && (
            <Grid item lg={3} md={3} sm={12} xs={12}>
              <Input
                label={t("EnterSearch")}
                type="text"
                name="keyword"
                value={keyword}
                onChange={this.handleTextChange}
                onKeyDown={this.handleKeyDownEnterSearch}
                className="w-100 mt-8 mr-10 stylePlaceholder"
                id="search_box"
                placeholder={t("general.enterSearch")}
                startAdornment={
                  <InputAdornment>
                    <Link to="#">
                      {" "}
                      <SearchIcon
                        onClick={() => this.search()}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                        }}
                      />
                    </Link>
                  </InputAdornment>
                }
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <div>
              {shouldOpenEditorDialog && (
                <EQAHealthOrgEditorDialog
                  t={t}
                  i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={shouldOpenEditorDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  isHealthOrg={isHealthOrg}
                  item={item}
                />
              )}

              {this.state.shouldOpenRoundRegisterEditorDialog && (
                <EQAHealthOrgRoundRegisterDialog
                  t={t}
                  i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenRoundRegisterEditorDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                />
              )}

              {shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={shouldOpenConfirmationDialog}
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
              data={itemList}
              columns={columns}
              //parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
              parentChildData={(row, rows) => {
                var list = rows.find((a) => a.id === row.parentId);
                return list;
              }}
              options={{
                selection: true,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                rowStyle: (rowData, index) => ({
                  backgroundColor: index % 2 === 1 ? "#EEE" : "#FFF",
                }),
                maxBodyHeight: "450px",
                minBodyHeight: "370px",
                headerStyle: {
                  backgroundColor: "#358600",
                  color: "#fff",
                },
                padding: "dense",
                toolbar: false,
              }}
              components={{
                Toolbar: (props) => <MTableToolbar {...props} />,
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
              // actions={[
              //   {
              //     tooltip: 'Remove All Selected Users',
              //     icon: 'delete',
              //     onClick: (evt, data) => {
              //       this.handleDeleteAll(data);
              //       alert('You want to delete ' + data.length + ' rows');
              //     }
              //   },
              // ]}
            />
            <TablePagination
              align="left"
              className="px-16"
              rowsPerPageOptions={[1, 2, 3, 5, 10, 25, 50, 100]}
              component="div"
              labelRowsPerPage={t("general.rows_per_page")}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("general.of")} ${
                  count !== -1 ? count : `more than ${to}`
                }`
              }
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                "aria-label": "Previous Page",
              }}
              nextIconButtonProps={{
                "aria-label": "Next Page",
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
export default EQAHealthOrgTable;
