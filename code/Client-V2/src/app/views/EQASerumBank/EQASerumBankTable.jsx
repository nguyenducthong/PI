import React, { Component } from "react";
import moment from "moment";
import { IconButton, Table, TableHead,TableBody, TableRow,TableCell, Icon,TablePagination,TableContainer,Button, Card,Checkbox, TableSortLabel,InputAdornment,Input,Grid
} from "@material-ui/core";
import MaterialTable, {MTableToolbar,Chip, MTableBody, MTableHeader
} from "material-table";
import {
  getAllEQASerumBanks,deleteEQASerumBank,getByPage, getById
} from "./EQASerumBankService";
import { getSerumBottleBySerumBank } from "../EQASerumBottle/EQASerumBottleService";
import EQASerumBankEditorDialog from "./EQASerumBankEditorDialog";
import EQASerumBankViewDialog from "./EQASerumBankViewDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import shortid from "shortid";
import { saveAs } from "file-saver";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { searchByPage } from "../EQASerumBank/EQASerumBankService";
import SearchIcon from "@material-ui/icons/Search";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        <Icon fontSize="small" color="primary">visibility</Icon>
      </IconButton>
    </div>
  );
}
class EQASerumBankTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    eQASerumBankList: [],
    item: {},
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenViewDialog: false,
    shouldOpenConfirmationDialog: false,
    selectAllItem: false,
    selectedList: [],
    totalElements: 0,
    shouldOpenConfirmationDeleteAllDialog: false,
    serumBottleList: [],
    keyword: ""
  };
  numSelected = 0;
  rowCount = 0;
  constructor(props) {
    super(props);
    //this.state = {keyword: ''};
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search(this.state.value);
    }
  };

  search() {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements
      });
    });
  }
  handleTextChange(event) {
    this.setState({ keyword: event.target.value });
  }
  setPage = page => {
    this.setState({ page }, function() {
      this.updatePageData();
    });
  };
  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };
  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function() {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  updatePageData = () => {
    var searchObject = {};
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.keyword = this.state.keyword.trim();
    //searchObject.eqaSerumBankId = this.state.eqaSerumBankId ? this.state.eqaSerumBankId : null;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements
      });
    });

    getByPage(searchObject).then(({ data }) =>
      this.setState({
        eQASerumBankList: [...data.content],
        selectAllItem: false,
        totalElements: data.totalElements
      })
    );
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
      shouldOpenViewDialog: false,
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenViewDialog: false,
    });
    this.setPage(0);
    //this.updatePageData();
  };

  handleDeleteEQASerumBank = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleEditEQASerumBank = item => {
    getById(item.id).then(result => {
      this.setState({
        item: result.data,
        shouldOpenEditorDialog: true
      });
    });
  };

  handleConfirmationResponse = () => {
    let {t} = this.props;
    deleteEQASerumBank(this.state.id).then((res) => {
      if(res.data ==  true){
        toast.info(t("EQASerumBank.notify.deleteSuccess"));
        this.updatePageData();
      }else{
        toast.info(t("EQASerumBank.notify.deleteError"));
      }
      this.handleDialogClose();
    }).catch((err)=>{
      toast.warning(t('EQASerumBank.notify.error'));
      this.handleDialogClose();
    });
  };

  componentDidMount() {
    this.updatePageData();
  }

  handleClick = (event, item) => {
    let { eQASerumBankList } = this.state;
    if (item.checked == null) {
      item.checked = true;
    } else {
      item.checked = !item.checked;
    }
    var selectAllItem = true;
    for (var i = 0; i < eQASerumBankList.length; i++) {
      if (
        eQASerumBankList[i].checked == null ||
        eQASerumBankList[i].checked == false
      ) {
        selectAllItem = false;
      }
      if (eQASerumBankList[i].id == item.id) {
        eQASerumBankList[i] = item;
      }
    }
    this.setState({
      selectAllItem: selectAllItem,
      eQASerumBankList: eQASerumBankList
    });
  };
  handleSelectAllClick = event => {
    let { eQASerumBankList } = this.state;
    for (var i = 0; i < eQASerumBankList.length; i++) {
      eQASerumBankList[i].checked = !this.state.selectAllItem;
    }
    this.setState({
      selectAllItem: !this.state.selectAllItem,
      eQASerumBankList: eQASerumBankList
    });
  };

  async handleDeleteList(list) {
    let {t} = this.props;
    let deleteSuccess = 0, deleteError = 0, error = 0;
    for (let i = 0; i < list.length; i++) {
      await deleteEQASerumBank(list[i].id).then((res) => {
        if(res.data === true){
          deleteSuccess++;
          this.updatePageData();
        }else{
          deleteError++;
        }
        this.handleDialogClose();
      }
      ).catch(()=>{
        error++
        this.handleDialogClose();
      });
    }
    if(deleteSuccess != 0){
      toast.info(t("EQASerumBank.notify.deleteSuccess") + " " + deleteSuccess );
    }
    if(deleteError != 0){
      toast.warning(t("EQASerumBank.notify.deleteError") + " " + deleteError);
    }
    if(error != 0){
      toast.warning(t('EQASerumBank.notify.error') + " " + error);
    }
  }
  handleDeleteAll = (event) => {
    let {t} = this.props;
    if(this.data != null){
      this.handleDeleteList(this.data);
    }else{
      toast.warning(t('general.select_data'));
      this.handleDialogClose();
    };
  };

  render() {
    const { t } = this.props;
    let TitlePage = t("EQASerumBankTable.title");
    let { keyword } = this.state;

    let {
      rowsPerPage,
      page,
      eQASerumBankList,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog,
      shouldOpenViewDialog,
      shouldOpenConfirmationDeleteAllDialog
    } = this.state;

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
                this.handleDeleteEQASerumBank(rowData.id);
              }else if (method === 2) {
                getById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: data,
                    shouldOpenViewDialog: true
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
        title: t("EQASerumBankTable.dialog.serum_code"),
        field: "serumCode",
        align: "left",
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
      },
      // {
      //   title: t("EQASerumBank.labCode"),
      //   field: "labCode",
      //   align: "left",
      //   width: "150"
      // },
      {
        title: t("EQASerumBankTable.dialog.original_code"),
        field: "originalCode",
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
      },
      // { title: t("EQASerumBankTable.dialog.nameSerumBank"), 
      //   field: "name", 
      //   width: "150" },
      {
        title: t("EQASerumBankTable.dialog.sampled_date"),
        field: "sampledDate",
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
          rowData.sampledDate ? (
            <span>{moment(rowData.sampledDate).format("DD/MM/YYYY")}</span>
          ) : (
            ""
          )
      },
      {
        title: t("EQASerumBankTable.dialog.receive_date"),
        field: "receiveDate",
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
          rowData.receiveDate ? (
            <span>{moment(rowData.receiveDate).format("DD/MM/YYYY")}</span>
          ) : (
            ""
          )
      },
      {
        title: t("EQASerumBank.inactivated"),
        field: "Status",
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
          rowData.inactivated == true ? (
            <small className="border-radius-4 bg-primary text-white px-8 py-2  ">
              {t("Yes")}
            </small>
          ) : (rowData.inactivated == false ? (
            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
              {t("No")}
            </small>
          ): "")
      },
      {
        title: t("EQASerumBankTable.dialog.number_Bottle"),
        field: "numberBottle",
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
      },
      {
        title: t("EQASerumBankTable.dialog.number_bottle_remaining"),
        field: "numberBottlesRemaining",
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
      },
      {
        title: t("EQASerumBankTable.dialog.original_Volume"),
        field: "originalVolume",
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
      },
      
    ];
    return (
      <div className="m-sm-30">
        <Helmet>
          <title>
            {TitlePage} | {t("web_site")}
          </title>
        </Helmet>
        <div className="mb-sm-30">
          <Breadcrumb
            routeSegments={[{ name: t("SampleManagement.title"), path: "/directory/apartment" },{ name: TitlePage }]}
          />
        </div>
        <Grid container spacing={3}>
          <Grid item md={7} sm={7} xs={12}>
            <Button
              className="mb-16 mr-16"
              variant="contained"
              color="primary"
              onClick={() =>
                this.setState({
                  shouldOpenEditorDialog: true,
                  item: {},
                  serumBottleList: []
                })
              }
            >
              {t("button.add")}
            </Button>
            <Button
              className="mb-16 mr-16"
              variant="contained"
              color="primary"
              onClick={() =>
                this.setState({ shouldOpenConfirmationDeleteAllDialog: true })
              }
            >
              {t("Delete")}
            </Button>
          </Grid>
          <Grid item md={5} sm={5} xs={12}>
            <Input
              label={t("EnterSearch")}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              className="w-100 mb-16 mr-10 stylePlaceholder"
              id="search_box"
              placeholder={t("general.enterSearch")}
              startAdornment={
                <InputAdornment>
                  <Link to="#">
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
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <MaterialTable
            title={t("List")}
            data={this.state.itemList}
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
            //     }
            //   }
            // ]}
          />
          <TablePagination
            className="px-16"
            rowsPerPageOptions={[1, 2, 5, 10, 25]}
            component="div"
            labelRowsPerPage={t('general.rows_per_page')}
            labelDisplayedRows={ ({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
            count={this.state.totalElements}
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

          {shouldOpenEditorDialog && (
            <EQASerumBankEditorDialog
              handleClose={this.handleDialogClose}
              handleOKEditClose={this.handleOKEditClose}
              open={shouldOpenEditorDialog}
              item={this.state.item}
              serumBottleList={this.state.serumBottleList}
              t={t}
            />
          )}
          {shouldOpenViewDialog && (
            <EQASerumBankViewDialog
              handleClose={this.handleDialogClose}
              handleOKEditClose={this.handleOKEditClose}
              open={shouldOpenViewDialog}
              item={this.state.item}
              serumBottleList={this.state.serumBottleList}
              t={t}
            />
          )}
          {shouldOpenConfirmationDialog && (
            <ConfirmationDialog
              open={shouldOpenConfirmationDialog}
              onConfirmDialogClose={this.handleDialogClose}
              onYesClick={this.handleConfirmationResponse}
              title={t("confirm")}
              text={t("DeleteConfirm")}
              Yes={t("general.Yes")}
              No={t("general.No")}
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
      </div>
    );
  }
}

export default EQASerumBankTable;
