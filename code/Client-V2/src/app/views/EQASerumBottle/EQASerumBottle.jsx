import { Input, InputAdornment, Grid, MenuItem, FormControl, InputLabel, IconButton, Select, Icon, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { deleteItem, saveItem, getItemById, searchByPage } from "./EQASerumBottleService";
import { searchByPage as searchByPageSerumBank } from "../EQASerumBank/EQASerumBankService";
import EQASerumBottleEditorDialog from "./EQASerumBottleEditorDialog";
import EQASerumBottleViewDialog from "./EQASerumBottleViewDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
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
  return <div>
    <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton>
    <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton>
    <IconButton size="small" onClick={() => props.onSelect(item, 2)}>
      <Icon fontSize="small" color="primary">visibility</Icon>
    </IconButton>
  </div>;
}
class EQASerumBottle extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    listSerumBank: [],
    keyword: '',
    eqaSerumBankId: '',
    shouldOpenViewDialog: false
  }
  constructor(props) {
    super(props);
    //this.state = {keyword: ''};
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  handleTextChange(event) {
    this.setState({ keyword: event.target.value });
  }
  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter') {
      this.search(this.state.value)
    }
  }

  search() {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.eqaSerumBankId = this.state.eqaSerumBankId ? this.state.eqaSerumBankId : null;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  componentDidMount() {
    let searchObject = { pageIndex: 0, pageSize: 1000000 }
    searchByPageSerumBank(searchObject).then(({ data }) => {
      if (data != null && data.content.length > 0) {
        this.setState({ listSerumBank: [...data.content] }, () => { })
      };
    });
    this.updatePageData();
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.keyword = this.state.keyword.trim();
    searchObject.eqaSerumBankId = this.state.eqaSerumBankId ? this.state.eqaSerumBankId : null;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  };
  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };
  handleKeyDownEnterSearch = e => {
    if (e.key === 'Enter') {
      this.search();
    }
  };
  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    })
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenViewDialog: false
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenViewDialog: false
    });
    this.setPage(0);
  };
  handleFilterSerumBank = (event, SerumBank, reason, details) => {
    if (SerumBank != null && SerumBank.id != null) {
      this.setState({ eqaSerumBankId: SerumBank.id }, () => {
        let searchObject = {};
        searchObject.text = this.state.keyword.trim();
        searchObject.eqaSerumBankId = this.state.eqaSerumBankId ? this.state.eqaSerumBankId : null;
        searchObject.pageIndex = this.state.page + 1;
        searchObject.pageSize = this.state.rowsPerPage;
        searchByPage(searchObject).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            SerumBank: SerumBank
          })
        })
      });
      if (reason == 'clear') {
        this.setState({ SerumBank: null })
      }
    } else {
      this.setState({ SerumBank: null, eqaSerumBankId: "" }, () => {
        let searchObject = {};
        searchObject.text = this.state.keyword.trim();
        searchObject.eqaSerumBankId = "";
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
          this.setState({
            itemList: [...data.content],
            totalElements: data.totalElements,
            SerumBank: SerumBank
          })
        })
      });
    }
  }
  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleConfirmationResponse = () => {
    let {t} = this.props;
    deleteItem(this.state.id).then((res) => {
      if(res.data ==  true){
        toast.info(t("eQASerumBottle.notify.deleteSuccess"));
        this.updatePageData();
      }else{
        toast.warning(t('eQASerumBottle.notify.deleteError'));
      }
      this.handleDialogClose()
    }).catch(()=>{
      toast.warning(t('eQASerumBottle.notify.error'));
      this.handleDialogClose();
    });
  };
  handleEditItem = item => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    });
  };

  async handleDeleteList(list) {
    let {t} = this.props;
    let deleteSuccess = 0, deleteError = 0, error = 0;
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id).then((res) =>{
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
      toast.info(t("eQASerumBottle.notify.deleteSuccess") + " " + deleteSuccess );
    }
    if(deleteError != 0){
      toast.warning(t("eQASerumBottle.notify.deleteError") + " " + deleteError);
    }
    if(error != 0){
      toast.warning(t('eQASerumBottle.notify.error') + " " + error);
    }
  }
  
  handleDeleteAll = (event) => {
    let {t} = this.props;
    if(this.data != null){
      this.handleDeleteList(this.data);
    }else{
      toast.warning(t('general.select_data'));
      this.handleDialogClose();
    }
  };
  render() {
    const { t, i18n } = this.props;
    let { SerumBank, listSerumBank, keyword, rowsPerPage, page } = this.state;
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
        render: rowData => <MaterialButton item={rowData}
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
              })
            } else if (method === 1) {
              this.handleDelete(rowData.id);
            }else if (method === 2) {
              getItemById(rowData.id).then(({ data }) => {
                if (data.parent === null) {
                  data.parent = {};
                }
                this.setState({
                  item: data,
                  shouldOpenViewDialog: true
                });
              })
            } else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
      { title: t("SampleManagement.serum-bottle.code"), field: "code", align: "left", width: "150",
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
      { title: t("SampleManagement.serum-bottle.bottleQuality"), field: "bottleQuality", align: "left", width: "150",
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
      { title: t("SampleManagement.serum-bottle.bottleVolume"), field: "bottleVolume", align: "left", width: "150",
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
      { title: t("SampleManagement.serum-bottle.localSaveBottle"), field: "localSaveBottle", align: "left", width: "150",
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
      { title: t("SampleManagement.serum-bottle.serum_code"), field: "eqaSerumBank.serumCode", align: "left", width: "150",
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
      { title: t("SampleManagement.serum-bottle.bottleStatus"), field: "eqaSerumBank.bottleStatus", align: "left", width: "150",
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
      render: rowData => rowData.resultBottle == true ? (
        <small className="border-radius-4 bg-light-gray px-8 py-2 ">
          {t("SampleManagement.serum-bottle.no")}
      </small>
      ) : (
        <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
          {t("SampleManagement.serum-bottle.yes")}
        </small>
      )
    },
      
    ];
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>{t("SampleManagement.serum-bottle.title")} | {t("web_site")}</title>
          </Helmet>
          <Breadcrumb routeSegments={[{ name: t("SampleManagement.title"), path: "/directory/apartment" },{ name: t("SampleManagement.serum-bottle.title") }]} />
        </div>
        <Grid container spacing={1}>
          <Grid item lg= {3} md={3} sm={12} xs={12}>
            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => {
                this.handleEditItem({ startDate: new Date(), endDate: new Date() });
              }
              }
            >
              {t('Add')}
            </Button>
            <Button className="mb-16 mr-36 align-bottom" variant="contained" color="primary"
              onClick={() => this.setState({ shouldOpenConfirmationDeleteAllDialog: true })}>
              {t('Delete')}
            </Button>

            {this.state.shouldOpenConfirmationDeleteAllDialog && (
              <ConfirmationDialog
                open={this.state.shouldOpenConfirmationDeleteAllDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleDeleteAll}
                title={t("confirm")}
                text={t('DeleteAllConfirm')}
                Yes={t('general.Yes')}
                No={t('general.No')}
              />
            )}
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={listSerumBank}
              className="flex-end"
              getOptionLabel={(option) => option.serumCode}
              onChange={this.handleFilterSerumBank}
              value={SerumBank}
              renderInput={(params) => <TextField {...params}
                label={t('SampleManagement.serum-bottle.fillterBySerumBank')}
                variant="outlined"
              />}
            />
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <Input
              label={t('EnterSearch')}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              className="w-100 mb-16 mr-10 stylePlaceholder"
              id="search_box"
              placeholder={t('general.enterSearch')}
              startAdornment={
                <InputAdornment >
                  <Link to="#"> <SearchIcon
                    onClick={() => this.search()}
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0"
                    }} /></Link>
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <div>
              {this.state.shouldOpenEditorDialog && (
                <EQASerumBottleEditorDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEditorDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                />
              )}
              {this.state.shouldOpenViewDialog && (
                <EQASerumBottleViewDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenViewDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
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
            </div>
            <MaterialTable
              title={t('List')}
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
              components={{
                Toolbar: props => (
                  <MTableToolbar {...props} />
                ),
              }}
              onSelectionChange={(rows) => {
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
            className="px-16"
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
          </Grid>
        </Grid>
      </div>
    )
  }
}
export default EQASerumBottle;