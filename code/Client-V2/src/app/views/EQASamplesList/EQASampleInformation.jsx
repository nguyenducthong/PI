import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    FormControlLabel,
    Checkbox,
    Paper,
    Input,
    InputLabel,
    MenuItem,
    FormControl, TextField,
    Select, FormHelperText, IconButton, Icon
} from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardDateTimePicker
} from "@material-ui/pickers";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import DateFnsUtils from "@date-io/date-fns";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { checkCode, deleteItem, saveItem, getItemById, updateEQASampleList, addNewEQASampleList } from "./EQASampleListService";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { countByRoundId } from "./EQASampleListService"
import Draggable from 'react-draggable';
import EQASerumBottleSelectMultiple from './EQASerumBottleSelectMultiple';
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';
import { result } from "lodash";

toast.configure({
    autoClose: 1000,
    draggable: false,
    limit: 3
});
function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}
function MaterialButton(props) {
    const item = props.item;
    return (
        <div>
            <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
                <Icon fontSize="small" color="error">delete</Icon>
            </IconButton>
        </div>
    );
}
function OriginnalResult(props) {
    const { t, i18n } = useTranslation();
    const item = props.item;
    let hivStatus = null;
    let str = "";
    if (item) {
        hivStatus = item.hivStatus == 1 ? true : false;
        str = t('eQASerumBottle.hivStatus.' + item.hivStatus);
    }

    if (hivStatus && hivStatus == true) {
        return <small className="border-radius-4 bg-primary text-white px-8 py-2 ">{str}</small>;
    }
    else {
        return <small className="border-radius-4 bg-light-gray px-8 py-2 ">{str}</small>;
    }
}

class EQASampleInformation extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        name: "",
        code: "",
        eqaSampleBottles: [],
        thrombinAddedDate: new Date(),
        removeFibrinDate: new Date(),
        centrifugeDate: new Date(),
        shouldOpenConfirmationDialog: false,
        shouldOpenPopupSelectEQASerumBottle: false,
        errMessageBottle: "",
        errMessageCode: "",
        round: [],
        result: null,
        isView: false,
    };

    handleChange = (event, source) => {
        event.persist();
        let { item } = this.state
        if (source === "active") {
            item["hasErrorResult"] = false
            this.setState({ item: item });
        }
        if (source === "hasErrorSample") {
            item["hasErrorSample"] = false
            this.setState({ item: item });
        }

        if (source === "inactiveVirus") {
            item["hasErrorVirus"] = false;
            this.setState({ item: item });
        }
        if (source === "isManualSetCode") {
            item["isManualSetCode"] = event.target.checked;
            this.setState({ item: item });
        }
        const name = event.target.name;
        const value = event.target.value;
        item[name] = value
        this.setState({
            item: item
        });
    };

    handleDelete = rowData => {
        let { item } = this.state
        let eqaSampleBottles = item.eqaSampleBottles;
        for (let index = 0; index < eqaSampleBottles.length; index++) {
            const items = eqaSampleBottles[index]
            if (
                rowData &&
                items &&
                rowData.id === items.id
            ) {
                eqaSampleBottles.splice(index, 1)
                item["eqaSampleBottles"] = eqaSampleBottles
                this.setState({ item: item })
                break
            }
        }

    };
    handleSelectEQARound = (items) => {
        let { item } = this.state;
        item["round"] = items;
        if(items != null && items.id != null) {
            item["sampleNumber"] = items.sampleNumber
            countByRoundId(items.id).then(({data})=>{
                item["countSampleList"] = data
            })
        }
        this.setState({ item: item });
        // let numberSampleList = [];
        // if(items != null && items.numberSampleList != null){
        //     for(let i = 0 ; i < items.numberSampleList; i++){
        //         numberSampleList.push({id: i+1,
        //         name: i+1});
        //     }
        //     item["numberSampleList"] = numberSampleList
        //     this.setState({item:item});
        // }else{
        //     item["numberSampleList"] = null
        //     this.setState({item: item});
        // }
    }


    componentDidMount() {
    }

    componentWillMount() {
        let { open, handleClose, item } = this.props;
        let numberSampleList = [];
        if (item && item.eqaSampleBottles && item.eqaSampleBottles.length > 0) {
            item.eqaSampleBottles.sort((a, b) => (a.eQASerumBottle.code > b.eQASerumBottle.code) ? 1 : -1);
        }

        this.setState({ item: item });
    }

    handleThrombinAddedDateChange = (date) => {
        let { item } = this.state
        item["thrombinAddedDate"] = date
        this.setState({
            item: item
        });
    };
    handleRemoveFibrinDateChange = (date) => {
        let { item } = this.state
        item["removeFibrinDate"] = date
        this.setState({
            item: item
        });
    };
    handleCentrifugeDateChange = (date) => {
        let { item } = this.state
        item["centrifugeDate"] = date
        this.setState({
            item: item
        });
    };

    handleEndDateChange = (date) => {
        let { item } = this.state
        item["endDate"] = date
        this.setState({
            item: item
        });
    };
    selectBottle = (bottles) => {
        let { item } = this.state
        item["eqaSampleBottles"] = bottles
        this.setState({ item: item }, function () {
        });
    }

    handleClosePopupSelectEQASerumBottle = () => {
        this.setState({ shouldOpenPopupSelectEQASerumBottle: false }, function () {
        });
    }

    handleSelectEQASerumBottle = (items) => {
        // item.sort((a, b) => (a.eQASerumBottle.code > b.eQASerumBottle.code) ? 1 : -1);
        // this.setState({ eqaSampleBottles: item }, function () {
        //     this.handleClosePopupSelectEQASerumBottle();
        // });
        let { item } = this.state
        let data = items.map(row => ({ ...row }));
        item["eqaSampleBottles"] = data
        this.setState({ item: item });
        this.handleClosePopupSelectEQASerumBottle();
    }

    render() {
        let {
            id,
            name,
            code,
            result,
            round,
            eqaSampleBottles,
            additiveThrombin,
            thrombinAddedDate,
            inactiveVirus,
            volumeAfterRemoveFibrin,
            removeFibrinDate,
            volumeAfterCentrifuge,
            centrifugeDate,
            volumeOfProclinAdded,
            note, orderNumberSample,
            numberSample,
            hasErrorSample,
            hasErrorResult,
            isView,
            shouldOpenPopupSelectEQASerumBottle,
            item
        } = this.state;

        let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
        let searchObject = { pageIndex: 0, pageSize: 1000000 };

        let columns = [
            {
                title: t("stt"), width: "50px", align: "center",
                headerStyle: {
                    minWidth:"100px",
                    paddingLeft: "10px",
                    paddingRight: "0px",
                  },
                  cellStyle: {
                    minWidth:"100px",
                    paddingLeft: "10px",
                    paddingRight: "0px",
                    textAlign: "center",
                  },
                render: rowData => (rowData.tableData.id + 1)
            },
            {
                title: t("eQASerumBottle.code"), field: "eQASerumBottle.code", align: "left", width: "50",
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
                render: rowData => (rowData.eQASerumBottle)
                    ? rowData.eQASerumBottle.code : rowData.code
            },
            {
                title: t("eQASerumBottle.eqaSerumBank"), field: "", align: "left", width: "150",
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
                render: rowData => (rowData.eQASerumBottle)
                    ? rowData.eQASerumBottle.serumCode : rowData.serumCode
            },
            {
                title: t("eQASerumBottle.hivStatus.title"), field: "", align: "left", width: "150",
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
                render: rowData => <OriginnalResult item={(rowData.eQASerumBottle) ? rowData.eQASerumBottle : rowData} />
            },
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
                cellStyle: { whiteSpace: "nowrap" },
                render: rowData => (
                    <MaterialButton
                        item={rowData}
                        onSelect={(rowData, method) => {
                            if (method === 1) {
                                this.handleDelete(rowData);
                            } else {
                                alert("Call Selected Here:" + rowData.id);
                            }
                        }}
                    />
                )
            }
        ];

        return (
            <React.Fragment>
                <Grid className="mb-16" container spacing={2}>
                    <Grid item className="" container spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <AsynchronousAutocomplete
                            label={<span className="font"><span style={{ color: "red" }}> * </span>
                                {t("EQARound.title")}
                            </span>}
                            size="small"
                            searchFunction={searchByPageEQARound}
                            searchObject={searchObject}
                            defaultValue={item.round}
                            value={item.round}
                            displayLable={'code'}
                            variant="outlined"
                            valueTextValidator={item.round}
                            onSelect={this.handleSelectEQARound}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl className="w-100" error={item.hasErrorResult}  variant="outlined" size="small">
                            <InputLabel htmlFor="result">{<span className="font"><span style={{ color: "red" }}> * </span>
                                {t("SampleManagement.sample-list.Result.title")}
                            </span>}</InputLabel>
                            <Select
                                size="small"
                                // name="result"
                                value={item.result}
                                onChange={event => this.handleChange(event, "active")}
                                // input={<Input id="result" />}
                                inputProps={{
                                    id: "result",
                                    name: "result"
                                }}
                            >
                                <MenuItem value={1}>{t("SampleManagement.sample-list.Result.positive")}</MenuItem>
                                <MenuItem value={0}>{t("SampleManagement.sample-list.Result.indertermine")}</MenuItem>
                                <MenuItem value={-1}>{t("SampleManagement.sample-list.Result.negative")}</MenuItem>
                            </Select>
                            {item.hasErrorResult && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item lg={3} md={3} sm={5} xs={12}>
                        <FormControlLabel
                            label={<span className="font">{t('EQASerumBank.isManualSetCode')}</span>}
                            control={<Checkbox checked={item.isManualSetCode}
                                onChange={(isManualSetCode) =>
                                    this.handleChange(isManualSetCode, "isManualSetCode")
                                }
                            />}

                        />
                    </Grid>
                    {item.isManualSetCode && <Grid item lg={3} md={3} sm={7} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={<span className="font"><span style={{ color: "red" }}> * </span>
                                {t("SampleManagement.sample-list.Code")}
                            </span>}
                            onChange={this.handleChange}
                            type="text"
                            variant="outlined"
                            name="code"
                            size = "small"
                            value={item.code}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>}
                
                   
                    </Grid>
                  
                    <Grid item  lg={3} md={3}  sm={12} xs={12}>
                        <FormControl className="w-100" error={item.hasErrorVirus} variant="outlined" size="small">
                            <InputLabel htmlFor="inactiveVirus">{<span className="font"><span style={{ color: "red" }}> * </span>
                            {t("SampleManagement.sample-list.InactiveVirus.title")}
                            </span>}</InputLabel>
                            <Select
                                size="small"
                                // name="inactiveVirus"
                                value={item.inactiveVirus}
                                onChange={event => this.handleChange(event, "inactiveVirus")}
                                // input={<Input id="inactiveVirus" />}
                                inputProps={{
                                    id: "inactiveVirus",
                                    name: "inactiveVirus"
                                }}
                            >
                                <MenuItem value={true}>{t("SampleManagement.sample-list.InactiveVirus.Yes")}</MenuItem>
                                <MenuItem value={false}>{t("SampleManagement.sample-list.InactiveVirus.No")}</MenuItem>
                            </Select>
                            {item.hasErrorVirus && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item  lg={3} md={3}  sm={12} xs={12}>
                        <TextValidator
                            size="small"
                            className="w-100"
                            label={<span className="font">{t("SampleManagement.sample-list.AdditiveThrombin")}</span>}
                            onChange={this.handleChange}
                            type="number"
                            variant="outlined"
                            name="additiveThrombin"
                            value={item.additiveThrombin}
                        />
                    </Grid>
                    <Grid item  lg={3} md={3}  sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDateTimePicker
                                size="small"
                                margin="none"
                                label={<span className="font">{t("SampleManagement.sample-list.ThrombinAddedDate")}</span>}
                                inputVariant="outlined"
                                type="text"
                                value={item.thrombinAddedDate}
                                name="thrombinAddedDate"
                                fullWidth
                                format="dd/MM/yyyy"
                                onChange={this.handleThrombinAddedDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item  lg={3} md={3}  sm={12} xs={12}>
                        <TextValidator
                            size="small"
                            className="w-100"
                            label={<span className="font">{t("SampleManagement.sample-list.VolumeAfterRemoveFibrin")}</span>}
                            onChange={this.handleChange}
                            type="number"
                            variant="outlined"
                            name="volumeAfterRemoveFibrin"
                            value={item.volumeAfterRemoveFibrin}
                        />
                    </Grid>
                    <Grid item  lg={3} md={3}  sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDateTimePicker
                                size="small"
                                margin="none"
                                label={<span className="font">{t("SampleManagement.sample-list.RemoveFibrinDate")}</span>}
                                inputVariant="outlined"
                                type="text"
                                value={item.removeFibrinDate}
                                name="removeFibrinDate"
                                fullWidth
                                format="dd/MM/yyyy"
                                onChange={this.handleRemoveFibrinDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item  lg={3} md={3}  sm={12} xs={12}>
                        <TextValidator
                            size="small"
                            className="w-100"
                            label={<span className="font">{t("SampleManagement.sample-list.VolumeAfterCentrifuge")}</span>}
                            onChange={this.handleChange}
                            type="number"
                            variant="outlined"
                            name="volumeAfterCentrifuge"
                            value={item.volumeAfterCentrifuge}
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDateTimePicker
                                size="small"
                                margin="none"
                                label={<span className="font">{t("SampleManagement.sample-list.CentrifugeDate")}</span>}
                                inputVariant="outlined"
                                type="text"
                                value={item.centrifugeDate}
                                name="centrifugeDate"
                                fullWidth
                                format="dd/MM/yyyy"
                                onChange={this.handleCentrifugeDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item lg={3} md={3}  sm={12} xs={12}>
                        <TextValidator
                            size="small"
                            className="w-100"
                            label={<span className="font">{t("SampleManagement.sample-list.VolumeOfProclinAdded")}</span>}
                            onChange={this.handleChange}
                            type="number"
                            variant="outlined"
                            name="volumeOfProclinAdded"
                            value={item.volumeOfProclinAdded}
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <TextValidator
                            size="small"
                            className="w-100"
                            label={<span className="font">{t("SampleManagement.sample-list.dilutionLevel")}</span>}
                            onChange={this.handleChange}
                            type="number"
                            variant="outlined"
                            name="dilutionLevel"
                            value={item.dilutionLevel}
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <TextValidator
                            size="small"
                            className="w-100"
                            label={<span className="font">{t("SampleManagement.sample-list.dilution")}</span>}
                            onChange={this.handleChange}
                            type="text"
                            variant="outlined"
                            name="dilution"
                            value={item.dilution}
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDateTimePicker
                                size="small"
                                margin="none"
                                label={<span className="font">{t("SampleManagement.sample-list.endDate")}</span>}
                                inputVariant="outlined"
                                type="text"
                                value={item.endDate}
                                name="endDate"
                                fullWidth
                                format="dd/MM/yyyy"
                                onChange={this.handleEndDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    {/* <Grid item lg={3} md={3}  sm={12} xs={12}>
                                <TextValidator
                                    size="small"
                                    className="w-100"
                                    label={t("SampleManagement.sample-list.performer")}
                                    onChange={this.handleChange}
                                    type = "text"
                                    name="performer"
                                    value={item.performer}
                                />
                            </Grid> */}
                   
                    <Grid item md = {12} sm={12} xs={12}>
                        <TextValidator
                            size="small"
                            className="w-100"
                            variant="outlined"
                            label={<span className="font">{t("SampleManagement.sample-list.Note")}</span>}
                            onChange={this.handleChange}
                            name="note"
                            value={item.note}
                        />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            className=" mr-16 align-bottom"
                            onClick={() => this.setState({ shouldOpenPopupSelectEQASerumBottle: true })}>
                            {t('SampleManagement.add_bottle')}
                        </Button>
                        {shouldOpenPopupSelectEQASerumBottle && (
                            <EQASerumBottleSelectMultiple t={t} i18n={i18n}
                                handleClose={this.handleClosePopupSelectEQASerumBottle}
                                open={shouldOpenPopupSelectEQASerumBottle}
                                handleSelect={this.handleSelectEQASerumBottle}
                                eQASerumBottle={item.eqaSampleBottles}
                            />
                        )}
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                        {item.eqaSampleBottles && item.eqaSampleBottles.length > 0 &&
                            (<MaterialTable title={t("SampleManagement.list_bottle")}
                                data={item.eqaSampleBottles}
                                columns={columns}
                                options={{
                                    selection: false,
                                    actionsColumnIndex: -1,
                                    paging: false,
                                    search: false,
                                    rowStyle: (rowData, index) => ({
                                        backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                                    }),
                                    headerStyle: {
                                        backgroundColor: '#358600',
                                        color: '#fff',
                                    },
                                    padding: 'dense',
                                    toolbar: false
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
                            />)}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export default EQASampleInformation;
