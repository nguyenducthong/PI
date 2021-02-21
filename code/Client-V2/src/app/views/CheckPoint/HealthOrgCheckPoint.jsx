import React, { Component } from "react";
import {
  IconButton,
  Grid,
  Icon,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Paper,
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
  InputLabel,
  Input,
  InputAdornment,
  TableContainer,
  Table,
  TablePagination,
  Button
} from "@material-ui/core";
import shortid from "shortid";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { searchByDto, getItemById, search as searchPlanning, getEQARoundsByPlanning, getListCheckScoresByRoundId, getListGroupCheckScoresByRoundId, exportToExcel, updateStatusSentResults } from "./CheckPointService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { saveAs } from 'file-saver';
import { Link } from "react-router-dom";
import VisibilityIcon from '@material-ui/icons/Visibility';
import CheckPointDialog from "./CheckPointDialog";
import { Helmet } from 'react-helmet';
import { getCurrentUser, getListHealthOrgByUser } from "../User/UserService"
import { toast } from "react-toastify";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
  //etc you get the idea
});
function MaterialButton(props) {

  const { t, i18n } = useTranslation();
  const item = props.item;
  return <div>
    <IconButton onClick={() => props.onSelect(item, 0)}>
      <Icon color="primary">send</Icon>
    </IconButton>
  </div>;
}

class HealthOrgCheckPoint extends Component {
  state = {
    rowsPerPage: 5,
    page: 0,
    qualificationList: [],
    item: {},
    roundId: '',
    listYear: [],
    listEQARound: [],
    listPlanning: [],
    currentYear: new Date().getFullYear(),
    shouldOpenViewDetailDialog: false,
    shouldOpenConfirmationDialog: false,
    selectAllItem: false,
    selectedList: [],
    totalElements: 0,
    shouldOpenConfirmationDeleteAllDialog: false,
    keyword: ''
  };
  numSelected = 0;
  rowCount = 0;


  handleChange = (event, source) => {
    event.persist();
    if (source === "PlanningId") {
      this.getEQARoundsByPlanning(event.target.value);
      return;
    }
    if (source === "roundId") {
      this.handleChangeEQARound(event.target.value);
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  sentResults = () => {
    let { t } = this.props;
    if (this.state.roundId == null || this.state.roundId == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    }
    let healthOrg = "00000000-0000-0000-0000-000000000000";
    updateStatusSentResults(healthOrg, this.state.roundId).then(res => {
      // window.location.reload();
      toast.warn(t("Gửi thành công"));
      this.updatePageData();
    })
  }

  sentResultsHealthOrg = (idHealthOrg) => {
    let { t } = this.props;
    if (this.state.roundId == null || this.state.roundId == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    }

    updateStatusSentResults(idHealthOrg, this.state.roundId).then(res => {
      toast.success(t("Gửi thành công"))
      this.updatePageData();
    })
  }

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  clearKeyword = () => {
    this.search()
    this.setState({ keyword: '' }, function () {
    });
  };

  handleTextChange = event => {
    this.setState({ keyword: event.target.value }, function () {
    });
  };

  handleKeyDownEnterSearch = e => {
    if (e.key === 'Enter') {
      this.search();
    }
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  updatePageData = () => {
    var searchObject = {};
    searchObject.isCheckPoint = true
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.roundId = this.state.roundId;
    searchByDto(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    });
  };
  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleChangeEQARound = (eQARoundIdSelected) => {
    if (eQARoundIdSelected != null && eQARoundIdSelected != '') {
      getListGroupCheckScoresByRoundId(eQARoundIdSelected).then(res => {
        this.setState({ listError: res.data });
      })
      getListCheckScoresByRoundId(eQARoundIdSelected).then(res => {
        this.setState({ listResults: res.data }, () => {
          // console.log(res.data)
        });
      })
      this.setState({ roundId: eQARoundIdSelected, itemList: [] }, function () {
        this.search();
      });
    }
  };

  search() {
    this.setState({ page: 0 }, function () {
      var searchObject = {};
      searchObject.isCheckPoint = true
      searchObject.text = this.state.keyword;
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
      searchObject.roundId = this.state.roundId;
      searchByDto(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
        this.setState({ itemList: [...data.content], totalElements: data.totalElements })
      });
    });
  }



  handleDownload = () => {
    var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "hello world.txt");
  }
  handleDialogClose = () => {
    this.setState({
      shouldOpenViewDetailDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false
    });
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenViewDetailDialog: false,
      shouldOpenConfirmationDialog: false
    });
    this.updatePageData();
  };

  handleDeleteResultsOfTheUnits = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleEditResultsOfTheUnits = item => {
    getItemById(item.id).then((result) => {
      this.setState({
        item: result.data,
        shouldOpenViewDetailDialog: true
      });
    });
  };

  getEQARoundsByPlanning = PlanningId => {
    this.setState({ PlanningId: PlanningId, listEQARound: [], itemList: [] }, function () {
      getEQARoundsByPlanning(PlanningId).then(({ data }) => {
        if (data != null && data.length > 0) {
          this.setState({ listEQARound: [...data], roundId: data[0].id }, function () {
            this.handleChangeEQARound(data[0].id);
          });
        }
      });
    })
  }

  componentDidMount() {
    var searchObject = { pageIndex: 1, pageSize: 100 };
    searchPlanning(searchObject).then(({ data }) => {
      this.setState({ listPlanning: [...data.content] });
    });
  }

  componentWillMount() {
    getCurrentUser().then(res => {
      let checkRoleAdmin = false
      res.data.roles.forEach(el => {
        if (el.name == "ROLE_ADMIN" || el.authority == "ROLE_ADMIN") {
          checkRoleAdmin = true
        }
        if (el.name == "ROLE_HEALTH_ORG" || el.authority == "ROLE_HEALTH_ORG") {
          this.setState({ statusSentResults: true }, () => {
            this.search();
          })
        } else {
          this.search();
        }
        if (checkRoleAdmin) {
          this.setState({ isRoleAdmin: true, isView: true })
        }
      })
    })
  }

  renderRowHead() {
    let { onSelectEvent, handleDelete, handleClick } = this.props;
    let { listError } = this.state;
    let titleCell = null;
    if (listError != null && listError.length > 0) {
      listError.forEach(item => {
        if (!titleCell) {
          titleCell = <TableCell key={shortid.generate()} className="px-0" align="left">
            {item.errorName}
          </TableCell>
        } else {
          titleCell += <TableCell key={shortid.generate()} className="px-0" align="left">
            {item.errorName}
          </TableCell>
        }
      });
    }

    return (
      <React.Fragment>
        {listError.map((item, index) => this.renderColHead(item))}
      </React.Fragment>
    )
  }

  renderColHead(item) {
    if (item.reagent != null) {
      item.title = item.errorName;
    } else {
      item.title = item.errorName;
    }
    //item.title = this.getTypeMethodName(item.reagent.name,item.typeMethod);
    return (
      this.renderHeadCells(item)
    )
  }
  renderHeadCells(item) {
    if (item == null) {
      item = {};
    }
    let titleCell = <TableCell style={{
      backgroundColor: '#358600',
      color: '#fff',
    }}
      key={shortid.generate()}
      className="px-0" align="left" >
      {item.title}
    </TableCell>
    return (
      <React.Fragment>
        {titleCell}
      </React.Fragment>
    )
  }

  renderResultDetails(item, index) {
    return (
      <React.Fragment>
        <TableRow>
          {this.renderHealthOrg(item, index)}
        </TableRow>
      </React.Fragment>
    )
  }
  renderHealthOrg(item, index) {
    let { isRoleAdmin } = this.state;

    let sttCell = <TableCell className="px-0" align="center">
      {index + 1}
    </TableCell>
    let titleCell = <TableCell className="px-0" align="left">
      {item ? item.healthOrg.code : ''}
    </TableCell>

    let { listResults, listError } = this.state;
    let cellContentByMethod = [];
    let listData = []
    // let note =""
    let result;
    let statusSent;
    let isCheck = false
    if (item.point >= 80) {
      result = "Đạt"
    } else {
      result = "Không đạt"
    }

    if (item.statusSentResults == true) {
      statusSent = "Đã gửi"
    } else {
      statusSent = "Chưa gửi"
    }

    listResults.forEach(result => {
      let content = null;
      if (result.healthOrgRound != null && item.id == result.healthOrgRound.id) {
        content = result
        // note += result.note +"\n"
        cellContentByMethod.push(content);

      }

    });

    if (cellContentByMethod.length < listError.length) {
      listError.forEach(e => {
        let p = null;
        cellContentByMethod.forEach(el => {
          if (e.errorName == el.errorName) {
            p = el
          }

        })
        listData.push(p)
      })
    }
    if (cellContentByMethod.length == listError.length) {
      listData = cellContentByMethod
    }
    // let titleCellNote = <TableCell className="px-0" align="center">
    // { note}
    // </TableCell>
    let titleCellPoint = <TableCell className="px-0" align="center">
      {item.point}
    </TableCell>
    let titleCellResult = <TableCell className="px-0" align="center">
      {result}
    </TableCell>
    let titleCellStatusSent = <TableCell className="px-0" align="center">
      {statusSent}
    </TableCell>
    let sentResults =
      <TableCell className="px-0" align="center">
        <MaterialButton item={item} onSelect={(item, method) => {
          if (method === 0) {
            // this.setState({healthOrg})
            this.sentResultsHealthOrg(item?.healthOrg?.id)
          }
        }} />

      </TableCell>
    return (
      <React.Fragment>
        {sttCell}
        {titleCell}
        {listData.map((cell, index) => this.renderCells(cell))}
        {titleCellPoint}
        {titleCellResult}
        {this.state.isRoleAdmin ? titleCellStatusSent : null}
        {this.state.isRoleAdmin ? sentResults : null}
      </React.Fragment>
    )
  }

  renderCells(item) {
    let { t, i18n } = this.props;
    if (item == null) {
      item = {};
    }
    let contentCell = <TableCell key={shortid.generate()} className="px-0" align="left">
      {
        item.errorNumber ? (
          <small >

            {item.errorNumber}

          </small>
        ) : ""
      }
    </TableCell>
    return (
      <React.Fragment>
        {contentCell}
      </React.Fragment>
    )
  }
  exportToExcel = () => {
    const { t } = this.props;
    let searchObject = {}
    searchObject.isCheckPoint = true
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = 1;
    searchObject.pageSize = 100000;
    searchObject.roundId = this.state.roundId;
    if (this.state.roundId == null || this.state.roundId == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    }
    exportToExcel(searchObject)
      .then((res) => {
        toast.info(this.props.t('general.successExport'));
        let blob = new Blob([res.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "SummaryResults.xlsx");
      })
      .catch((err) => {
        // console.log(err);
      });
  }
  render() {
    const { t, i18n } = this.props;
    let {
      hasErrorCurrentYear,
      hasErrorRound,
      listPlanning,
      rowsPerPage,
      page,
      totalElements,
      itemList,
      listEQARound,
      PlanningId,
      roundId,
      keyword,
      item,
      listError,
      listResults, isRoleAdmin,
    } = this.state;

    let title = t('ResultsOfTheUnits.list_unit') + " (" + totalElements + " " + t('ResultsOfTheUnits.unit') + ")";



    return (
      <div className="">
        {/* <Helmet>
                    <title>{t("ResultsOfTheUnits.title")} | {t("web_site")}</title>
                </Helmet>
                <div className="mb-sm-30">
                    <Breadcrumb routeSegments={[{ name: t("ReportResult.title"), path: "/directory/apartment" },{ name: t('ResultsOfTheUnits.title') }]} />
                </div> */}

        <Grid container spacing={3}>
          {this.state.isRoleAdmin && (<Grid item lg={3} md={3} sm={6} xs={12}>
            <Button
              className="mb-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={this.exportToExcel}
            >
              {t('general.exportToExcel')}
            </Button>
            <Button
              className="mb-16 ml-8 align-bottom"
              variant="contained"
              color="primary"
              onClick={this.sentResults}
            >
              {t('Gửi điểm')}
            </Button>
          </Grid>)}

          <Grid item lg={3} md={3} sm={6} xs={12}>
            <FormControl fullWidth={true} error={hasErrorCurrentYear} size="small" variant="outlined">
              <InputLabel htmlFor="planning-simple">{t('ResultsOfTheUnits.eqaPlanning')}</InputLabel>
              <Select
                label={t('ResultsOfTheUnits.eqaPlanning')}
                value={PlanningId}
                onChange={PlanningId => (this.handleChange(PlanningId, 'PlanningId'))}
                required={true}
                inputProps={{
                  name: "planning",
                  id: "planning-simple"
                }}
              >
                {listPlanning.map(item => {
                  return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                })}
              </Select>
              {hasErrorCurrentYear && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={12}>
            <FormControl fullWidth={true} error={hasErrorRound} size="small" variant="outlined">
              <InputLabel htmlFor="round-simple">{t('ResultsOfTheUnits.round')}</InputLabel>
              <Select
                label={t('ResultsOfTheUnits.round')}
                value={roundId}
                onChange={roundId => (this.handleChange(roundId, 'roundId'))}
                required={true}
                inputProps={{
                  name: "round",
                  id: "round-simple"
                }}
              >
                {listEQARound.map(item => {
                  return <MenuItem key={item.id} value={item.id}>{item.code}</MenuItem>;
                })}
              </Select>
              {hasErrorRound && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={12}>
            <FormControl fullWidth >
              <InputLabel htmlFor="standard-adornment-amount"></InputLabel>
              <Input
                label={t('EnterSearch')}
                type="text"
                name="keyword"
                className="mt-8 stylePlaceholder"
                id="standard-adornment-amount"
                value={keyword}
                onKeyDown={this.handleKeyDownEnterSearch}
                onChange={this.handleTextChange}
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
            </FormControl>


          </Grid>

          {(listResults && listResults.length > 0 && this.state.itemList && this.state.itemList.length != 0) && (<Paper>
            <TableContainer style={{ maxHeight: 1000 }}>
              <Table >
                <TableHead style={{
                  backgroundColor: '#358600',
                  color: '#fff',
                }} >
                  <TableRow>

                    <TableCell
                      style={{
                        backgroundColor: '#358600',
                        color: '#fff',
                      }}
                      rowSpan={2} width="50px" align="center" className="p-0">{t('ResultsOfTheUnits.STT')}</TableCell>
                    <TableCell style={{
                      backgroundColor: '#358600',
                      color: '#fff',
                    }}
                      rowSpan={2}>{t('ResultsOfUnitsByReagentGroup.countHealthOrg')}</TableCell>
                    {
                      (listError && this.renderRowHead())
                    }
                    <TableCell style={{
                      backgroundColor: '#358600',
                      color: '#fff',
                    }}
                      rowSpan={2}>{t('checkPoint.totalPoints')}</TableCell>
                    <TableCell style={{
                      backgroundColor: '#358600',
                      color: '#fff',
                      textAlign: "center"
                    }}
                      rowSpan={2}>{t('checkPoint.conclude')}</TableCell>
                    {this.state.isRoleAdmin && <TableCell style={{
                      backgroundColor: '#358600',
                      color: '#fff', textAlign: "center"
                    }}
                      rowSpan={2}>{t('Trạng thái')}</TableCell>}
                    {this.state.isRoleAdmin && <TableCell style={{
                      backgroundColor: '#358600',
                      color: '#fff', textAlign: "center"
                    }}
                      rowSpan={2}>{t('Gửi điểm')}</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    (listResults && itemList && itemList.map((item, index) => this.renderResultDetails(item, index)))
                  }

                </TableBody>

              </Table>
            </TableContainer>
            <TablePagination
              align="left"
              className="px-16"
              rowsPerPageOptions={[1, 2, 3, 5, 10, 25, 50, 100]}
              component="div"
              labelRowsPerPage={t('general.rows_per_page')}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
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
          </Paper>)}

        </Grid>
      </div>
    );
  }
}

export default HealthOrgCheckPoint;
