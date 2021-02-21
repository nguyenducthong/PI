import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    Select,
    Input,
    Icon,
    IconButton,
    InputLabel,
    FormControl,
    MenuItem,
    FormHelperText
} from "@material-ui/core";
import PropTypes from "prop-types";
import { getResultReportById } from "./ResultsOfTheUnitsService";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { ValidatorForm, TextValidator, TextField } from "react-material-ui-form-validator";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import EQAResultReportEcliaEditorDialog from "../EQAResultReportEclia/EQAResultReportEcliaEditorDialog";
function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

class EQAResultReportViewDetailDialog extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        hasErrorHealthOrgRound: false,
        hasErrorEQARound: false,
        isUsingIQC: false,
        isUsingControlLine: false,
        eqaRound: '',
        healthOrgRound: '',
        reagentLot: '',
        order: '',
        reagent: '',
        technician: '',
        personBuyReagent: '',
        item:{},
        details: [],
        supplyOfReagent: '',
        timeToResult: '',
        reagentExpiryDate: new Date(),
        testDate: new Date(),
        shouldOpenSearchDialog: false,
        shouldOpenConfirmationDialog: false,
        shouldOpenSearchEQASampleSearchDialog: false,
        listHealthOrgRound: [],
        listReagent: [],
        listTechnician: [],
        listEQARound: []
    };

    //positive(1),//Dương tính
    //indertermine(0),//Không xác định
    //negative(-1),//Âm tính
    //none(-2)//Không thực hiện
    Results = [
        { id: -2, name: "Không thực hiện" },
        { id: -1, name: "Âm tính" },
        { id: 0, name: "Không xác định" },
        { id: 1, name: "Dương tính" },
    ];

    handleDateChange = (date, name) => {
        this.setState({
            [name]: date
        });
    };

    handleChooseBooleanChange = (value, name) => {
        this.setState({
            [name]: value.target.value
        });
    };

    handleChange = (event, source) => {
        event.persist();
        if (source === "switch") {
            this.setState({ isActive: event.target.checked });
            return;
        }
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleRowDataCellChange = (rowData, event) => {
        let { details } = this.state;
        if (details != null && details.length > 0) {
            details.forEach(element => {
                if (element.tableData != null && rowData != null && rowData.tableData != null
                    && element.tableData.id == rowData.tableData.id) {
                    if (event.target.name == "sCOvalue") {
                        element.sCOvalue = event.target.value;
                    }
                    else if (event.target.name == "result") {
                        element.result = event.target.value;
                    }
                }
            });
            this.setState({ details: details });
        }
    };

    handleFormSubmit = () => {
    };

    component() {
        let { open, handleClose, resultReportDetail } = this.props;
        if (resultReportDetail != null && resultReportDetail.resultReport != null && resultReportDetail.resultReport.id != null) {
            getResultReportById(resultReportDetail.resultReport.id).then((result) => {
                let item = result.data;
                this.setState({...item}, function () {
                });
            });
        }
    }

    handleSearchDialogClose = () => {
        this.setState({
            shouldOpenSearchDialog: false
        });
    };

    handleSearchEQARoundDialogClose = () => {
        this.setState({
            shouldOpenSearchEQARoundSearchDialog: false
        });
    };

    render() {
        const { classes } = this.props;
        const { selected, hasErrorHealthOrgRound, hasErrorEQARound } = this.state;
        let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
        let {
            eqaRound,
            healthOrgRound,
            reagentLot,
            reagent,
            technician,
            reagentExpiryDate,
            details,
            testDate,
            listHealthOrgRound,
            listReagent,
            listTechnician,
            listEQARound
        } = this.state;

        let columns = [
            {
                title: t("EQAResultReportEclia.sample_code"), field: "sampleTube.code", align: "left", width: "50"
            },
            {
                title: t("EQAResultReportEclia.sCOvalue"),
                field: "sCOvalue",
                width: "50",
                render: rowData =>
                    <TextValidator
                        className="w-40"
                        onChange={sCOvalue => this.handleRowDataCellChange(rowData, sCOvalue)}
                        type="number"
                        name="sCOvalue"
                        value={rowData.sCOvalue}
                        step={0.0001}
                    />
            },
            {
                title: t("EQAResultReportEclia.result"), field: "result", align: "left", width: "150",
                render: rowData =>
                    <FormControl className="w-80">
                        <Select
                            value={rowData.result}
                            onChange={result => this.handleRowDataCellChange(rowData, result)}
                            inputProps={{
                                name: "result",
                                id: "result-simple"
                            }}
                        >
                            <MenuItem value=''><em>None</em> </MenuItem>
                            {this.Results.map(item => {
                                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
            }
        ];
        return (
            <Dialog onClose={handleClose} open={open} PaperComponent={PaperComponent} maxWidth={'lg'} fullWidth={true} >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <span className="mb-20 styleColor">{t("Details")}</span>

                    <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
                        title={t("close")}>
                        close
                        </Icon>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid className="mb-16" container spacing={2}>
                        <Grid item sm={4} xs={12}>
                            <TextValidator
                                className="w-100 mb-16"
                                label={t('EQARound.title')}
                                InputProps={{
                                    readOnly: true,
                                }}
                                type="text"
                                name="eqaRound"
                                value={eqaRound.name}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <FormControl fullWidth={true} error={hasErrorEQARound}>
                                <InputLabel htmlFor="eQARound-simple">{t('EQARound.title')}</InputLabel>
                                <Select
                                    value={eqaRound ? eqaRound : ''}
                                    onChange={value => this.handleSelectEQARound(value)}
                                    required={true}
                                    inputProps={{
                                        name: "eQARound",
                                        id: "eQARound-simple"
                                    }}
                                >
                                    {listEQARound.map(item => {
                                        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                                    })}
                                </Select>
                                {hasErrorEQARound && <FormHelperText>This is required!</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <FormControl fullWidth={true} error={hasErrorHealthOrgRound}>
                                <InputLabel htmlFor="healthOrgRound-simple">{t('EQAResultReportEclia.healthOrgEQARoundCode')}</InputLabel>
                                <Select
                                    value={healthOrgRound}
                                    onChange={this.handleHealthOrgRoundChange}
                                    required={true}
                                    inputProps={{
                                        name: "healthOrgRound",
                                        id: "healthOrgRound-simple"
                                    }}
                                >
                                    {listHealthOrgRound.map(item => {
                                        return <MenuItem key={item.id} value={item.id}>{item.healthOrg.code} | {item.healthOrg.name}</MenuItem>;
                                    })}
                                </Select>
                                {hasErrorHealthOrgRound && <FormHelperText>This is required!</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <TextValidator
                                className="w-100 mb-16"
                                label={t("EQAResultReportEclia.reagentLot")}
                                onChange={this.handleChange}
                                type="text"
                                name="reagentLot"
                                value={reagentLot}
                                validators={["required"]}
                                errorMessages={[t("general.errorMessages_required")]}
                            />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    fullWidth
                                    margin="none"
                                    id="mui-pickers-date"
                                    label={t('EQAResultReportEclia.testDate')}
                                    inputVariant="standard"
                                    type="text"
                                    autoOk={false}
                                    format="dd/MM/yyyy"
                                    value={testDate}
                                    onChange={date => this.handleDateChange(date, "testDate")}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <FormControl fullWidth={true}>
                                <InputLabel htmlFor="reagent-simple">{t('EQAResultReportEclia.reagentName')}</InputLabel>
                                <Select
                                    value={reagent}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: "reagent",
                                        id: "reagent-simple"
                                    }}
                                >
                                    {listReagent.map(item => {
                                        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    fullWidth
                                    margin="none"
                                    id="mui-pickers-date"
                                    label={t('EQAResultReportEclia.reagentExpiryDate')}
                                    inputVariant="standard"
                                    type="text"
                                    autoOk={false}
                                    format="dd/MM/yyyy"
                                    value={reagentExpiryDate}
                                    onChange={date => this.handleDateChange(date, "reagentExpiryDate")}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <FormControl fullWidth={true}>
                                <InputLabel htmlFor="technician">{t('EQAResultReportEclia.technicianName')}</InputLabel>
                                <Select
                                    value={technician}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: "technician",
                                        id: "technician"
                                    }}
                                >
                                    {listTechnician.map(item => {
                                        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTable title={t("EQAResultReportEclia.list_tube")} data={details} columns={columns}
                            options={{
                                selection: false,
                                actionsColumnIndex: -1,
                                paging: false,
                                search: false
                            }}
                            components={{
                                Toolbar: props => (
                                    <div style={{ witdth: "100%" }}>
                                        <MTableToolbar {...props} />
                                    </div>
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
                    <div className="flex flex-space-between flex-middle mt-16">
                        <Button variant="contained" color="secondary" type="button" onClick={() => handleClose()}> {t('Cancel')}</Button>
                    </div>
                </DialogContent>
            </Dialog >
        );
    }
}

export default EQAResultReportViewDetailDialog;
