import {
  Grid,
  FormControl,
  InputLabel,
  Button,
  Input,
  Checkbox,
  TablePagination,
  InputAdornment,
  Dialog,
  DialogActions,
  IconButton, Icon
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import SearchIcon from "@material-ui/icons/Search";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { searchByPage } from "../EQASamplesList/EQASampleListService";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import '../../../styles/views/_style.scss';
import Paper from "@material-ui/core/Paper";
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
class EQASampleSearchDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectedItem: {},
    keyword: "",
    sampleList: [],
    eqaRoundId: ""
  };

  handleTextSearchChange = event => {
    this.setState({ keyword: event.target.value }, function() {});
  };

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.setPage(0);
    }
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

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.eqaRoundId = this.state.eqaRoundId;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      let { sampleList } = this.state;
      // nếu đã có trong list chọn rồi thì sẽ thay trạng thái isCheck bằng true
      let itemListClone = [...data.content];
      itemListClone.map(item => {
        const found = sampleList.find(obj => {
          if (
            typeof obj.sampleList.sample != "undefined" &&
            obj.sampleList.sample.id != null
          ) {
            return obj.sampleList.sample.id == item.id;
          } else {
            return obj.sampleList.id == item.id;
          }
        });
        if (found) {
          item.isCheck = true;
        } else {
          item.isCheck = false;
        }
      });
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements
      });
    });
  };

  componentDidMount() {
    this.updatePageData(this.state.page, this.state.rowsPerPage);
  }

  // handleClick = (event, item) => {
  //   //alert(item);
  //   item.isCheck = event.target.checked;
  //   if (item.id != null) {
  //     this.setState({ selectedValue: item.id, selectedItem: item });
  //   } else {
  //     this.setState({ selectedValue: item.id, selectedItem: null });
  //   }

  // }
  handleClick = (event, item) => {
    item.isCheck = event.target.checked;
    let { sampleList } = this.state;
    if (sampleList == null) {
      sampleList = [];
    }
    if (sampleList != null && sampleList.length == 0 && item.isCheck == true) {
      let p = {};
      p.sampleList = item;
      sampleList.push(p);
    } else {
      let itemInList = false;
      sampleList.forEach(el => {
        if (
          el.sampleList.id == item.id ||
          el.sampleList.sample?.id == item.id
        ) {
          itemInList = true;
        }
      });
      if (!itemInList && item.isCheck == true) {
        let p = {};
        p.sampleList = item;
        sampleList.push(p);
      } else {
        if (item.isCheck === false) {
          sampleList = sampleList.filter(proper => {
            if (
              typeof proper.sampleList.sample != "undefined" &&
              proper.sampleList.sample.id != null
            ) {
              return proper.sampleList.sample.id == item.id;
            } else {
              return proper.sampleList.id !== item.id;
            }
          });
        }
      }
    }
    this.setState({ sampleList }, function() {});
  };

  componentWillMount() {
    let { open, handleClose, selectedItem, sampleList, eqaRound } = this.props;
    //this.setState(item);
    //this.setState({ selectedValue: selectedItem.id });
    this.setState({ sampleList, eqaRoundId: eqaRound.id });
  }
  search = keyword => {
    this.updatePageData();
  };

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    const {
      t,
      i18n,
      handleClose,
      handleSelect,
      sampleList,
      selectedItem,
      open
    } = this.props;
    let { keyword, eqaRound } = this.state;
    let columns = [
      // {
      //   title: t("Action"),
      //   field: "custom",
      //   align: "left",
      //   width: "250",
      //   render: rowData => <Radio name="radSelected" value={rowData.id} checked={this.state.selectedValue === rowData.id} onClick={(event) => this.handleClick(event, rowData)}
      //   />
      // },
      {
        title: t("general.select"),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => (
          <Checkbox
            id={`radio${rowData.id}`}
            name="radSelected"
            value={rowData.id}
            checked={rowData.isCheck}
            onClick={event => this.handleClick(event, rowData)}
          />
        )
      },
      //  { title: t("Name"), field: "name", width: "150" },
      { title: t("Code"), field: "code", align: "left", width: "150" }
      // { title: t("EQASerumBankTable.title"), field: "eqaSerumBank.serumCode", align: "left", width: "150" },
      // { title: t("SampleManagement.sample-list.Result.title"), field: "eqaSerumBank.serumCode", align: "left", width: "150" },
    ];
    return (
      <Dialog
        onClose={handleClose}
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"sm"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20 styleColor">{t("EQASampleSet.select_sample")}</span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid item xs={12}>
            {/* <Button className="mb-16 mr-16" variant="contained" color="primary" onClick={() => handleSelect(this.state.sampleList)}>
              {t('Select')}
            </Button>
            <Button className="mb-16 mr-36" variant="contained" color="secondary" onClick={() => handleClose()}>{t('Cancel')}</Button> */}
            {/* <TextField className="mb-36 mr-36" placeholder={t('EnterSearch')} type="text" value={this.state.keyword} onChange={this.handleTextSearchChange} onKeyDown={this.handleKeyDownEnterSearch} />
            <Button className="mb-16 mr-16" variant="contained" color="primary" onClick={() => this.search()}>{t('Search')}</Button> */}
            <FormControl fullWidth>
              <InputLabel htmlFor="standard-adornment-amount">
                {t("EnterSearch")}
              </InputLabel>
              <Input
                id="standard-adornment-amount"
                name="text"
                value={this.state.keyword}
                onKeyDown={this.handleKeyDownEnterSearch}
                onChange={this.handleTextSearchChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon onClick={() => this.search()} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item className="mt-8" xs={12}>
            <MaterialTable
              title={t("SampleManagement.sample-list.title")}
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
        </DialogContent>
        <DialogActions spacing={4} className="flex flex-end flex-middle">
          <Button
            className="mb-16 mr-36"
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="mb-16 mr-16"
            variant="contained"
            color="primary"
            onClick={() => handleSelect(this.state.sampleList)}
          >
            {t("Select")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default EQASampleSearchDialog;
