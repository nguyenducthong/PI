import { Input, InputAdornment, Grid, MenuItem, FormControl, InputLabel, IconButton, Select, Icon, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { deleteItem, saveItem, getItemById, searchByPage } from "./EQASampleSetService";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import EQASampleSetEditorDialog from "./EQASampleSetEditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
    <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton>
    <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton>
  </div>;
}
class EQASampleSet extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    //selectedItems:[],
    keyword: '',
    eqaRoundId: '',
    round: null
  }
  constructor(props) {
    super(props);
    //this.state = {keyword: ''};
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(event) {
    this.setState({ value: event.target.value });
  }

  handleTextSearchChange = event => {
    this.setState({ keyword: event.target.value }, function () {
    })
  };

  handleKeyDownEnterSearch = e => {
    if (e.key === 'Enter') {
      this.search(this.state.keyword);
    }
  };

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  componentDidMount() {
    this.updatePageData();
  }

  search() {
    this.setState({ page: 0 }, () => {
      var searchObject = {}
      searchObject.text = this.state.keyword.trim();
      searchObject.eqaRoundId = this.state.eqaRoundId ? this.state.eqaRoundId : null;
      searchObject.pageIndex = this.state.page;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
        this.setState({ itemList: [...data.content], totalElements: data.totalElements })
      }
      );
    })
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = '';
    searchObject.eqaRoundId = this.state.eqaRoundId ? this.state.eqaRoundId : null;
    //searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  };

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  handleFilterEQARound = (event, round, reason, details) => {
    if (round != null && round.id != null) {
      this.setState({ eqaRoundId: round.id }, () => {
        let searchObject = {};
        searchObject.eqaRoundId = this.state.eqaRoundId
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
      this.setState({ round: null, eqaRoundId: "" }, () => {
        let searchObject = {};
        searchObject.eqaRoundId = ""
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
      shouldOpenConfirmationDialog: false
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
      shouldOpenConfirmationDeleteAllDialog: false
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false
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
        toast.info(t("EQASampleSet.notify.deleteSuccess"));
        this.updatePageData();
      } else {
        toast.warning(t('EQASampleSet.notify.deleteError'));
      }
      this.handleDialogClose();
    }).catch((err) => {
      toast.warning(t('EQASampleSet.notify.error'));
      this.handleDialogClose();
    })
  };

  handleEditItem = item => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    });
  };

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
        error++
        this.handleDialogClose();
      });
    }
    if (deleteSuccess != 0) {
      toast.info(t("EQASampleSet.notify.deleteSuccess") + " " + deleteSuccess);
    }
    if (deleteError != 0) {
      toast.warning(t('EQASampleSet.notify.deleteError') + " " + deleteError);
    }
    if (error != 0) {
      toast.warning(t('EQASampleSet.notify.error') + " " + error);
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

  render() {
    const { t, i18n } = this.props;
    const { keyword } = this.state;
    let { text, round, selectedItem, listEQARound } = this.state;
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

        // cellStyle: { whiteSpace: 'nowrap' },
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
            } else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
      {
        title: t("EQARound.title"), field: "eqaRound.code", align: "left", width: "150",
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
        title: t("EQASampleSet.SampleSetCode"), field: "code", align: "left", width: "150",
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
        title: t("EQASampleSet.SampleSetName"), field: "name", width: "150",
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


    ];
    return (
      <div className="m-sm-30">
        <Helmet>
          <title>{t("EQASampleSet.title")} | {t("web_site")}</title>
        </Helmet>
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: t("SampleManagement.title"), path: "/directory/apartment" }, { name: t("EQASampleSet.title") }]} />
        </div>
        <Grid container spacing={3}>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <Button
              className="mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => {
                this.handleEditItem({ startDate: new Date(), endDate: new Date() });
              }
              }
            >
              {t('Add')}
            </Button>
            <Button className="mr-36 align-bottom" variant="contained" color="primary"
              onClick={() => this.setState({ shouldOpenConfirmationDeleteAllDialog: true })}>
              {t('Delete')}
            </Button>

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
          <Grid item lg={4} md={4} sm={12} xs={12}>
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
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <FormControl fullWidth>
              <Input
                className='mt-10 search_box w-100 stylePlaceholder'
                type="text"
                name="keyword"
                value={this.state.keyword}
                onChange={this.handleTextSearchChange}
                onKeyDown={this.handleKeyDownEnterSearch}
                placeholder={t('general.enterSearch')}
                id="search_box"
                startAdornment={
                  <InputAdornment >
                    <Link to="#"> <SearchIcon
                      onClick={() => this.search(this.state.keyword)}
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

          <Grid item xs={12}>
            <div>
              {this.state.shouldOpenEditorDialog && (
                <EQASampleSetEditorDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEditorDialog}
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
              //parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
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
export default EQASampleSet;