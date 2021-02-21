import {
  Grid, MuiThemeProvider, IconButton, Icon, TextField, Button,
  Table, TableBody, TableContainer, TableCell, TableHead, TableRow, Paper, Checkbox, TablePagination
} from "@material-ui/core";

import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { deleteItem, saveItem, getItemById, searchByPage } from "./AllocationSampleSetService";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import allocationSampleSetRoutes from "./AllocationSampleSetRoutes";
import { classifyHealthOrgByRound, allocationSampleToHealthOrg } from "./AllocationSampleSetService";
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllocationSampleViewDetailHealthOrg from "./AllocationSampleViewDetailHealthOrg";

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});
const listRule = [
  { name: "Chẵn lẻ", value: 2 },
  { name: "Chia hết cho 5", value: 5 },
  { name: "Chia hết cho 10", value: 10 },
  { name: "Chia đôi danh sách", value: 50 }
]
toast.configure();
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return <div>
    <IconButton onClick={() => props.onSelect(item, 0)}>
      <Icon color="primary">edit</Icon>
    </IconButton>
    <IconButton onClick={() => props.onSelect(item, 1)}>
      <Icon color="error">delete</Icon>
    </IconButton>
  </div>;
}
class AllocationSampleSet extends React.Component {
  state = {
    rowsPerPage: 5,
    page: 0,
    data: {},
    item: {},
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    shouldOpenViewDetailHealthOrgDialog: false,
    listEQARound: [],
    //selectedItems:[],
    keyword: '',
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let searchObject = { pageIndex: 0, pageSize: 1000000 }
    searchByPageEQARound(searchObject).then(({ data }) => {
      if (data != null && data.content.length > 0) {
        this.setState({ listEQARound: [...data.content] }, () => {
        });
      };
    });
  }

  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenViewDetailHealthOrgDialog: false,
    });
  };

  handleViewGrouping = () => {
    let { t } = this.props;
    if (!this.state.roundId) {
      this.warning(t("AllocationSampleSet.errorRound"));
      return;
    }
    if (!this.state.rule) {
      this.warning(t("AllocationSampleSet.errorRule"));
      return;
    }
    classifyHealthOrgByRound(this.state.roundId, this.state.rule).then(({ data }) => {
      this.setState({ data: data, listSampleSet: data.listSampleSet });
    });

  };
  handleSave = () => {
    let { t } = this.props;
    if (this.state.data && this.state.data.listDetail != null && this.state.data.listDetail.length > 0) {
      for (let index = 0; index < this.state.data.listDetail.length; index++) {
        let detail = this.state.data.listDetail[index];
        if (!detail.eQASampleSetDto) {
          this.warning(t("AllocationSampleSet.errorSample") + detail.note);
          return;
        }
      }
      allocationSampleToHealthOrg(this.state.data).then(({ data }) => {
        this.success(t("AllocationSampleSet.success"));
      })
    }
  }

  async handleDeleteList(list) {
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id);
    }
  }
  handleDeleteAll = (event) => {
    //alert(this.data.length);
    this.handleDeleteList(this.data).then(() => {
      this.updatePageData();
      this.handleDialogClose();
    }
    );
  };
  handleFilterEQARound = (event, round, reason, details) => {
    if (round != null && round.id != null) {
      this.setState({ roundId: round.id });
    } else {

    }
  }
  handleSampleSetChange = (event, row, reason, details) => {
    // console.log(row);
    // console.log(this.state.data.listDetail);

  }
  handleRule = (event, rule, reason, details) => {
    if (rule != null) {
      this.setState({ rule: rule.value });
    }
    else {
      this.setState({ rule: null });
    }
  }
  useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  handleViewDetailOrg = (listHealthOrg) => {
    this.setState({ listHealthOrg, shouldOpenViewDetailHealthOrgDialog: true });
  }
 
  renderRow = () => {
    const { t, i18n } = this.props;
    if (this.state.data && this.state.data.listDetail && this.state.data.listDetail.length > 0) {
      return (
        this.state.data.listDetail.map((de, i) =>
          (
            <tr className='MuiTableRow-root'>
              <td>
                <Autocomplete
                  size="small"
                  id="combo-box"
                  // options={listSampleSet}
                  className="flex-end"
                  getOptionLabel={(option) => option.name}
                  onChange={(event, dto, reason, details) => {
                    de.eQASampleSetDto = dto;
                  }}
                  value={de.eQASampleSetDto}

                  renderInput={(params) => <TextField {...params}
                    variant="outlined"
                    label={t('AllocationSampleSet.selectSampleSet')}
                  />}
                />
              </td>
              <td>{de.listHealthOrg.length}</td>
              <td>aaa</td>
            </tr>
          ))
      )
    }
    else {
      return (
        <tr className='MuiTableRow-root'>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      )
    }

  }

  success = (content) => {
    toast.success(content);
  }
  info = (content) => {
    toast.info(content);
  }
  warning = (content) => {
    toast.warning(content);
  }
  error = (content) => {
    toast.error(content);
  }

  render() {
    const { t, i18n } = this.props;
    const classes = this.useStyles;
    let { rule, roundId, listEQARound, listSampleSet, data} = this.state;

    let columns = [
      { title: "Phân nhóm", field: "note", align: "left", width: "100" },
      {
        title: "Số lượng đơn vị tham gia",field: "numberOfHealthOrg", align: "left", width: "100",
        render: rowData => <Button
          className="mb-16 mr-16 align-bottom"
          variant="contained"
          color="primary"
          title={t('AllocationSampleSet.ViewDetailOrg')}
          onClick={() => { this.handleViewDetailOrg(rowData.listHealthOrg) }}
        >
          {rowData.numberOfHealthOrg}
        </Button>
      },
      {
        title: "Chọn tập mẫu",
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => <Autocomplete
          size="small"
          id="combo-box"
          options={listSampleSet}
          className="flex-end"
          getOptionLabel={(option) => option.name}
          value={rowData.eQASampleSetDto}
          onChange={(event, dto, reason, details) => {
            // console.log(this.state.data.listDetail)
            // let check = false
            if(this.state.data.listDetail != null && this.state.data.listDetail.length > 0){
              this.state.data.listDetail.forEach(el =>{
                
                // if(el.eQASampleSetDto != null && dto != null && el.eQASampleSetDto.id == dto.id){
                //   check = true
                  
                // }
              })
            }
            // if(check){
            //   toast.warning(t('AllocationSampleSet.warningSelectSampleSet'));
            //   rowData.eQASampleSetDto = null;
            // }else{
            //   rowData.eQASampleSetDto = dto;
            // }
            rowData.eQASampleSetDto = dto;
            this.setState({ data: data });
          }}
          renderInput={(params) => <TextField {...params}
            variant="outlined"
            label={t('AllocationSampleSet.selectSampleSet')}
          />}
        />
      },
    ];
    return (
      <div className="m-sm-30">

        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: t("AllocationSampleSet.title") }]} />
        </div>
        <Grid container spacing={3}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={listEQARound}
              className="flex-end"
              getOptionLabel={(option) => option.code}
              onChange={this.handleFilterEQARound}
              value={roundId}
              renderInput={(params) => <TextField {...params}
                variant="outlined"
                label={t('general.fillterByRoundEQA')}
              />}
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={listRule}
              className="flex-end"
              getOptionLabel={(option) => option.name}
              onChange={this.handleRule}
              value={rule}

              renderInput={(params) => <TextField {...params}
                variant="outlined"
                label={t('AllocationSampleSet.rule')}
              />}
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => {
                this.handleViewGrouping();
              }
              }
            >
              {t('AllocationSampleSet.groupResult')}
            </Button>
            <Button className="mb-16 mr-36 align-bottom" variant="contained" color="primary"
              onClick={() => this.handleSave()}>
              {t('Save')}
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
          <Grid item xs={12}>
            {this.state.shouldOpenViewDetailHealthOrgDialog && (
              <AllocationSampleViewDetailHealthOrg
                t={t}
                i18n={i18n}
                handleClose={this.handleDialogClose}
                open={this.state.shouldOpenViewDetailHealthOrgDialog}
                item={this.state.listHealthOrg}
              />
            )}
            <MaterialTable
              title={t('List')}
              data={data.listDetail}
              columns={columns}
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
          </Grid>
        </Grid>
      </div>

    )
  }
}
export default AllocationSampleSet;