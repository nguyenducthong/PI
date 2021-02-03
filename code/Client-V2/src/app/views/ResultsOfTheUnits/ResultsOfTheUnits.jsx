import React, { Component } from "react";
import {
    IconButton,
    Grid,
    Icon,
    TablePagination,
    Button,
    FormControl,
    MenuItem,
    Select,
    FormHelperText,
    InputLabel,
    Input,
    InputAdornment
} from "@material-ui/core";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { searchByDto,searchByPage, getItemById,exportToExcel, getEQARoundsByYear, search as searchPlanning, getEQARoundsByPlanning } from "./ResultsOfTheUnitsService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { saveAs } from 'file-saver';
import { Link } from "react-router-dom";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {getCurrentUser,getListHealthOrgByUser} from "../User/UserService"
import HealthOrgEQARoundViewDetailDialog from "./HealthOrgEQARoundViewDetailDialog";
import { Helmet } from 'react-helmet';
import { toast } from "react-toastify";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit:3
  //etc you get the idea
});
function MaterialButton(props) {

    const { t, i18n } = useTranslation();
    const item = props.item;
    return <div>
        <IconButton onClick={() => props.onSelect(item, 0)}>
            <Icon color="primary"><VisibilityIcon /></Icon>
        </IconButton>
    </div>;
}

class ResultsOfTheUnits extends Component {
    state = {
        rowsPerPage: 10,
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

    currentYear = new Date().getFullYear();

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

    bindDataToComboboxListYear = () => {
        if (this.currentYear != null && this.currentYear > 0) {
            let listYear = [];
            for (let index = 2000; index <= (this.currentYear + 10); index++) {
                let year = { id: index, name: '' + index };
                listYear.push(year);
            }
            this.setState({ listYear: listYear }, function () {
            });
        }
    };

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

    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };

    handleChangeEQARound = (eQARoundIdSelected) => {
        if (eQARoundIdSelected != null && eQARoundIdSelected != '') {
            this.setState({ roundId: eQARoundIdSelected, itemList: [] }, function () {
                this.search();
            });
        }
    };

    search() {
        this.setState({ page: 0 }, function () {
            var searchObject = {};
            searchObject.text = this.state.keyword;
            searchObject.pageIndex = this.state.page + 1;
            searchObject.pageSize = this.state.rowsPerPage;
            searchObject.roundId = this.state.roundId ;
            searchByDto(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
                this.setState({ itemList: [...data.content], totalElements: data.totalElements })
            });
        });
    }

    updatePageData = () => {
        var searchObject = {};
        searchObject.text = this.state.keyword;
        searchObject.pageIndex = this.state.page + 1;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.roundId = this.state.roundId ;
        searchByDto(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
            this.setState({ itemList: [...data.content], totalElements: data.totalElements })
        });
    };

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

    getEQARoundsByPlanning = PlanningId =>{
        this.setState({ PlanningId: PlanningId , listEQARound: [], itemList: []}, function (){
            getEQARoundsByPlanning(PlanningId).then(({data})=>{
                if (data != null && data.length > 0) {
                    this.setState({ listEQARound: [...data], roundId: data[0].id }, function () {
                        this.handleChangeEQARound(data[0].id);
                    });
                }
            });
        })
    }

    componentDidMount() {
        var searchObject = {pageIndex: 1 , pageSize: 100};
        searchPlanning(searchObject).then(({data})=>{
              this.setState({listPlanning: [...data.content]}); 
      });
      this.search();
    }
    componentWillMount (){
        getCurrentUser().then(res=>{
            let checkRoleAdmin = false
            res.data.roles.forEach(el =>{
                if(el.name == "ROLE_ADMIN" || el.authority == "ROLE_ADMIN"){
                  checkRoleAdmin = true
                }
                if(checkRoleAdmin){
                    this.setState({isRoleAdmin:true,isView: true})
                  }
              })
          })
    }
    handleEditItem = item => {
        this.setState({
            item: item,
            shouldOpenViewDetailDialog: true
        });
    };
    exportToExcel = () => {
        const { t } = this.props;
        let searchObject = {}
        if(this.state.roundId == null || this.state.roundId == ""){
          toast.warn(t("EQASampleSet.please_select_eqa_round"))
          return
        }
          exportToExcel(this.state.roundId ? this.state.roundId :"").then((res) => {
            let blob = new Blob([res.data], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            saveAs(blob, 'EQAResultReport.xlsx')
          })
          .catch((err) => {
            // console.log(err)
          })
      }
    render() {
        const { t, i18n } = this.props;
        let {
            hasErrorCurrentYear,
            hasErrorRound,
            currentYear,
            listYear,
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
            shouldOpenConfirmationDialog,
            shouldOpenViewDetailDialog,isRoleAdmin,
            shouldOpenConfirmationDeleteAllDialog
        } = this.state;

        let title = t('ResultsOfTheUnits.list_unit') + " (" + totalElements + " " + t('ResultsOfTheUnits.unit') + ")";

        let columns = [
            {
                title: t("viewDetail"),
                field: "custom",
                align: "center",
                width: "50",
                render: rowData => <MaterialButton item={rowData}
                    onSelect={(rowData, method) => {
                        if (method === 0) {
                            getItemById(rowData.id).then(({ data }) => {
                                this.setState({
                                    item: data,
                                    shouldOpenViewDetailDialog: true
                                });
                            })
                        } else {
                            alert('Call Selected Here:' + rowData.id);
                        }
                    }}
                />
            },
            {
                title: t("ResultsOfTheUnits.STT"), width: "50", align: "left",
                render: rowData => ((page) * rowsPerPage) + (rowData.tableData.id + 1)
            },
            { title: t("ResultsOfTheUnits.health_org_code"), field: "healthOrg.code", align: "left", width: "150" },
            { title: t("ResultsOfTheUnits.health_org_name"), field: "healthOrg.name", align: "left", width: "250" },
            { title: t("ResultsOfTheUnits.set"), field: "sampleSet.name", align: "left", width: "150" },
            {
                title: t("ResultsOfTheUnits.hasResult.title"), field: "hasResult", align: "left", width: "150",
                render: rowData =>
                    rowData.hasResult == true ? (
                        <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
                            {t('ResultsOfTheUnits.hasResult.true')}
                        </small>
                    ) : (
                            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
                                {t('ResultsOfTheUnits.hasResult.false')}
                            </small>
                        )
            },
            
        ];

        return (
            <div className="m-sm-30">
                <Helmet>
                    <title>{t("ResultsOfTheUnits.title")} | {t("web_site")}</title>
                </Helmet>
                <div className="mb-sm-30">
                    <Breadcrumb routeSegments={[{ name: t("ReportResult.title"), path: "/directory/apartment" },{ name: t('ResultsOfTheUnits.title') }]} />
                </div>

                <Grid container spacing={2}>
                {isRoleAdmin && (<Grid item lg={3} md={3} sm={6} xs={12}>
                    <Button
                        className="mb-16 align-bottom"
                        variant="contained"
                        color="primary"
                        onClick={this.exportToExcel}
                        >
                        {t('general.exportToExcel')}
                        </Button>
                     </Grid>)}
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <FormControl fullWidth={true} error={hasErrorCurrentYear} variant="outlined" size="small">
                            <InputLabel htmlFor="planning-simple">{t('ResultsOfTheUnits.eqaPlanning')}</InputLabel>
                            <Select
                                label = {t('ResultsOfTheUnits.eqaPlanning')}
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
                        <FormControl fullWidth={true} error={hasErrorRound} variant="outlined" size="small">
                            <InputLabel htmlFor="round-simple">{t('ResultsOfTheUnits.round')}</InputLabel>
                            <Select
                                label = {t('ResultsOfTheUnits.round')}
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
                                className = "stylePlaceholder mt-8"
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
                    {shouldOpenViewDetailDialog && (
                        <HealthOrgEQARoundViewDetailDialog t={t} i18n={i18n}
                            handleClose={this.handleDialogClose}
                            open={shouldOpenViewDetailDialog}
                            handleOKEditClose={this.handleOKEditClose}
                            item={item}
                        />
                    )}
                    <Grid item xs={12}>
                        <MaterialTable
                            title={title}
                            data={itemList}
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
                </Grid>
            </div>
        );
    }
}

export default ResultsOfTheUnits;
