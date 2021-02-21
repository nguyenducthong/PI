import React, { Component } from "react";
import {
  IconButton,
  Grid,
  Icon,
  TablePagination,
  TableContainer,
  Button,
  TextField,
  Checkbox,
  Card,
  InputAdornment,
  Input
} from "@material-ui/core";
import {
  search as searchByPage,
  deleteEQAPlanning,
  getById,
  checkNotBeingUsed
} from "./EQAPlanningService";
import EQAPlanningEditorDialog from "./EQAPlanningDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import shortid from "shortid";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import EQAPlanningPrint from "./EQAPlanningPrint";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "webdatarocks/webdatarocks.min.css";
import * as WebDataRocksReact from "../../component/webdatarocks.react";
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
      <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
        <Icon fontSize="small" color="primary">edit</Icon>
      </IconButton>
      <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
        <Icon fontSize="small" color="error">delete</Icon>
      </IconButton>
      <IconButton size="small" onClick={() => props.onSelect(item, 2)}>
      <Icon fontSize="small" color="primary">print</Icon>
      </IconButton>
    </div>
  );
}

class EQAPlanningTable extends Component {
  state = {
    keyword: "",
    rowsPerPage: 10,
    page: 0,
    pageSize: 10,
    pageIndex: 0,
    totalElements: 0,
    listData: [],
    item: {},
    selectAllItem: false,
    selectedList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    shouldOpenPrintDialog: false
  };
  numSelected = 0;
  rowCount = 0;

  handleKeywordChange = event => {
    this.setState({ keyword: event.target.value }, function() {});
  };

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.updatePageData();
    }
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function() {
      this.updatePageData();
    });
  };

  setPage = page => {
    this.setState({ page }, function() {
      this.updatePageData();
    });
  };
  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleDownload = () => {
    var blob = new Blob(["Hello, world!"], {
      type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "hello world.txt");
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenPrintDialog: false
    });
    this.updatePageData();
  };
  handleAddItem = item => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    });
  };
  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenPrintDialog: false
    });
    this.updatePageData();
  };

  handleEditEQAPlanning = item => {
    getById(item.id).then(result => {
      this.setState({
        item: result.data,
        shouldOpenEditorDialog: true
      });
    });
  };

  handleDeleteEQAPlanning = id => {
    this.setState({
      pageIndex: 0,
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleConfirmationResponse = async () => {
    let {t} = this.props;
    const isNotUsed = (await checkNotBeingUsed(this.state.id)).data;
    if (isNotUsed) {
      deleteEQAPlanning(this.state.id).then(() => {
        this.updatePageData();
        toast.success(t("EQAPlanning.deleteSuccess"));
      });
    } else {
      toast.error(this.props.t("EQAPlanning.plan_in_use"));
    }
    this.handleDialogClose();
  };

  componentDidMount() {
    this.updatePageData();
  }

  search() {
    this.setState({ page: 0 }, function() {
      var searchObject = {};
      searchObject.text = this.state.keyword.trim();
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
        ({ data }) => {
          this.setState({
            listData: [...data.content],
            totalElements: data.totalElements
          });
        }
      );
    });
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState({
          listData: [...data.content],
          totalElements: data.totalElements
        });
      }
    );
  };

  handleClick = (event, item) => {
    let { listData } = this.state;
    if (item.checked == null) {
      item.checked = true;
    } else {
      item.checked = !item.checked;
    }
    var selectAllItem = true;
    for (var i = 0; i < listData.length; i++) {
      if (listData[i].checked == null || listData[i].checked == false) {
        selectAllItem = false;
      }
      if (listData[i].id == item.id) {
        listData[i] = item;
      }
    }
    this.setState({ selectAllItem: selectAllItem, listData: listData });
  };
  handleSelectAllClick = event => {
    let { listData } = this.state;
    for (var i = 0; i < listData.length; i++) {
      listData[i].checked = !this.state.selectAllItem;
    }
    this.setState({
      selectAllItem: !this.state.selectAllItem,
      listData: listData
    });
  };

  async handleDeleteList(list) {
    let result;
    let error = false;
    let {t} = this.props;
    for (let item of list) {
      result = (await checkNotBeingUsed(item.id)).data;
      if (!result) {
        error = true;
        break;
      }
    }
    if (!error) {
      for (let i = 0; i < list.length; i++) {
        await deleteEQAPlanning(list[i].id).then(res =>{
          if(res.data == true){
            toast.success(t("EQAPlanning.deleteSuccess") + " " + list[i].code);
            this.updatePageData();
          }else{
            toast.warning(t('EQAPlanning.plan_in_use')+ " " + list[i].code);
          }
          this.handleDialogClose();
        });
      }
    } else {
      toast.error(this.props.t("EQAPlanning.plans_in_use"));
    }
  }
  handleDeleteAll = event => {
    let { t } = this.props;
    if (this.state.selectedItems != null) {
      this.handleDeleteList(this.state.selectedItems).then(() => {
        this.updatePageData();
        this.handleDialogClose();
      }).catch(() =>{
        toast.warning(t('EQAPlanning.plan_in_use'));
        this.handleDialogClose();
      });
    } else {
      toast.warning(t("general.select_data"));
      this.handleDialogClose();
    }
  };
  reportComplete = () => {
  //  console.log(">>>>>", this.myRef.webdatarocks.getReport());
  };
  render() {
    const { t, i18n } = this.props;
    let TitlePage = t("EQAPlanning.title");
    let {
      keyword,
      rowsPerPage,
      page,
      item,
      pageSize,
      pageIndex,
      totalElements,
      listData,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog,
      shouldOpenConfirmationDeleteAllDialog
    } = this.state;

    let columns = [
      {
        title: t("general.action"),
        field: "custom",
        align: "left",
        width: "250",
        cellStyle: { whiteSpace: "nowrap" },
        render: rowData => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                getById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true
                  });
                });
              } else if (method === 1) {
                this.handleDeleteEQAPlanning(rowData.id);
              } else if (method === 2){
                getById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: data,
                    shouldOpenPrintDialog: true
                  });
                });
              }
               else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        )
      },
      {
        title: t("EQAPlanning.code"),
        field: "code",
        align: "left",
        width: "150"
      },
      { title: t("EQAPlanning.name"), field: "name", width: "150" },
      
    ];

    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>
              {TitlePage} | {t("web_site")}
            </title>
          </Helmet>
          <Breadcrumb routeSegments={[{ name: t("EQAPlanning.create"), path: "/directory/apartment" }, { name: TitlePage } ]} />
        </div>
        <Grid container spacing={3} justify ="space-between">
          <Grid item lg={7} md={7} sm={7} xs={12}>
            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => {
                this.handleAddItem({
                  startDate: new Date(),
                  endDate: new Date()
                });
              }}
            >
              {t("Add")}
            </Button>
            <Button
              className="mb-16 mr-36 align-bottom"
              variant="contained"
              color="primary"
              onClick={() =>
                this.setState({ shouldOpenConfirmationDeleteAllDialog: true })
              }
            >
              {t("Delete")}
            </Button>

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
            {this.state.shouldOpenPrintDialog && (
                <EQAPlanningPrint t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenPrintDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
              
                />
              )}
          </Grid>
          <Grid item lg={5} md={5} sm={5} xs={12}>
            <Input
              label={t("EnterSearch")}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleKeywordChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              className='mt-10 search_box w-100 stylePlaceholder'
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
            {shouldOpenEditorDialog && (
              <EQAPlanningEditorDialog
                t={t}
                i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenEditorDialog}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
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
            data={listData}
            columns={columns}
            parentChildData={(row, rows) => {
              var list = rows.find(a => a.id === row.parentId);
              return list;
            }}
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
                  color:'#fff',
                },
                padding: 'dense',
                toolbar: false
              }}
            components={{
              Toolbar: props => <MTableToolbar {...props} />
            }}
            onSelectionChange={rows => {
              this.setState({ selectedItems: rows });
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
            rowsPerPageOptions={[1, 2, 3, 5, 10, 25, 50, 100]}
            component="div"
            labelRowsPerPage={t('general.rows_per_page')}
            labelDisplayedRows={ ({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
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
      </div>
    );
  }
}

export default EQAPlanningTable;
