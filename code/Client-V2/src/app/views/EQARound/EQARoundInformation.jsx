import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    FormControlLabel, MenuItem,
    FormControl, InputLabel, Select,
    Switch, FormHelperText,
    InputAdornment,
    Checkbox,
    Icon,
    IconButton
} from "@material-ui/core";
import {
    ValidatorForm,
    TextValidator,
    TextField
} from "react-material-ui-form-validator";
import {
    getByPage,
    deleteItem,
    saveItem,
    getItemById,
    checkCode
} from "./EQARoundService";
import EQARoundDialog from "./EQARoundDialog";
import { generateRandomId } from "utils";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { getAll } from "../Personnel/PresonnelService";
import { search as searchByPage } from "../EQAPlanning/EQAPlanningService";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import EQAPlanningSearchDialog from "./EQAPlanningSearchDialog";
import '../../../styles/views/_style.scss';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({
    autoClose: 1000,
    draggable: false,
    limit: 3
})
class EQARoundInformation extends React.Component {
    constructor(props) {
        super(props);
        getAll().then(result => {
            let listPersonnel = result.data;
            this.setState({ listPersonnel: listPersonnel });
        })
    }
    state = {
        name: "",
        code: "",
        level: 0,
        parent: {},
        shouldOpenSearchDialog: false,
        shouldOpenConfirmationDialog: false,
        startDate: new Date(), //thời gian bắt đầu vòng ngoại kiểm
        endDate: new Date(), //thời gian kết thúc vòng ngoại kiểm
        registrationStartDate: new Date(), //thời gian bắt đầu đăng ký tham gia vòng ngoại kiểm
        registrationExpiryDate: new Date(), //thời gian kết thúc đăng ký tham gia vòng ngoại kiểm
        sampleSubmissionDeadline: new Date(),
        isManualSetCode: false,
        isActive: true,
        isView: false,
        sampleNumber: null,//số mẫu
        sampleSetNumber: null,//số bộ mẫu
        executionTime: new Date(),//thời gian thực hiện
        healthOrgNumber: null,//Số đơn vị tham gia
        detailRound: [],
        listPersonnel: []
    };

    handleChange = (event, source) => {
        let { item } = this.state;
        event.persist();
        if (source === "switch") {
            this.setState({ isActive: event.target.checked });
            return;
        }
        if (source === "isManualSetCode") {
            item["isManualSetCode"] = event.target.checked
            this.setState({ item : item})
        }
        let name =  event.target.name;
        let value = event.target.value;
        item[name] = value;
        this.setState({
           item : item
        });
    };
    handleDateChange = (date, name) => {
        let { item } = this.state;
        if(name === "startDate" && date != null){
          date.setHours("00");
          date.setMinutes("00");
          date.setSeconds("00");
        }
        if(name === "endDate" && date != null){
          date.setHours("23");
          date.setMinutes("59");
          date.setSeconds("00");
        }
        if(name === "registrationStartDate" && date != null){
          date.setHours("00");
          date.setMinutes("00");
          date.setSeconds("00");
        }
        if(name === "registrationExpiryDate" && date != null){
          date.setHours("23");
          date.setMinutes("59");
          date.setSeconds("00");
        }
        if(name === "sampleSubmissionDeadline" && date != null){
          date.setHours("23");
          date.setMinutes("59");
          date.setSeconds("00");
        } 
        if(name === "executionTime" && date != null){
          date.setHours("00");
          date.setMinutes("00");
          date.setSeconds("00");
        }
        item[name] = date
        this.setState({
         item : item
        });
      };
    componentWillMount() {
        let { open, handleClose, item , listPersonnel } = this.props;
        if(!(item != null && item.detailRound != null && item.detailRound.length > 0)){
            item.detailRound = []
        }
        this.setState({ item: item, listPersonnel: listPersonnel }, () => {
            this.state.item = item
        });
    }

    handleChangeDetailRound = (number, event, name) => {
        let { detailRound } = this.state.item;
        let p = {}
        if (name === "startDate" || name === "endDate") {
            if (name === "startDate" && event != null) {
                event.setHours("00");
                event.setMinutes("00");
                event.setSeconds("00");
            }
            if (name === "endDate" && event != null) {
                event.setHours("23");
                event.setMinutes("59");
                event.setSeconds("00");
            }
            p = {
                ...detailRound[number],
                [name]: event,
            };
            p.type = number
        } else {
            p = {
                ...detailRound[number],
                [event.target.name]: event.target.value,
            };
            p.type = number
        }
        detailRound.splice(number, 1, p)
        this.setState({ detailRound })
    }
    handleSelect = (planning) => {
        let {item} = this.state
        if(item == null){
          item = {}
        }
        if(planning != null  && planning.id != null){
            item["eqaPlanning"] = planning
            this.setState({ item: item });
        }
    };

    render() {
        let {
            id,
            name,
            code,
            level,
            isActive,
            hasErrorPerson,
            startDate,
            isManualSetCode,
            endDate,
            sampleSubmissionDeadline,
            registrationStartDate,
            registrationExpiryDate,
            parent,
            isView,
            shouldOpenDialog,
            shouldOpenConfirmationDialog,
            shouldOpenSearchDialog,
            shouldPlanningSearchDialog,
            eqaPlanning,
            detailRound,
            sampleNumber,
            sampleSetNumber,
            healthOrgNumber,
            executionTime,
        } = this.state.item;
        let {  listPersonnel} = this.state
        let searchObject = { pageIndex: 0, pageSize: 1000000 };
        const {
            t,
            i18n,
            handleClose,
            handleSelect,
            isRoleAdmin,
            selectedItem,
            open,
            item,
        } = this.props;
        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <Grid container item spacing={2}>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <AsynchronousAutocomplete
                                label={<span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQARound.ChoosePlaning")}
                                </span>
                                }
                                size="small"
                                searchFunction={searchByPage}
                                searchObject={searchObject}
                                defaultValue={this.state.item?.eqaPlanning}
                                value={this.state.item?.eqaPlanning}
                                displayLable={"name"}
                                variant="outlined"
                                valueTextValidator={this.state.item?.eqaPlanning}
                                onSelect={this.handleSelect}
                                validators={["required"]}
                                errorMessages={[t("general.errorMessages_required")]}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <TextValidator
                                className="w-100"
                                label={<span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQARound.Name")}
                                </span>
                                }
                                onChange={this.handleChange}
                                type="text"
                                name="name"
                                size="small"
                                variant="outlined"
                                value={this.state.item?.name}
                                validators={["required"]}
                                errorMessages={[t("general.errorMessages_required")]}
                            />
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={6}>
                            <FormControlLabel
                                label={<span className="font">{t('EQARound.isManualSetCode')}</span>}
                                control={<Checkbox checked={this.state.item?.isManualSetCode}
                                    onChange={(isManualSetCode) =>
                                        this.handleChange(isManualSetCode, "isManualSetCode")
                                    }
                                />}

                            />
                        </Grid>
                        {this.state.item?.isManualSetCode && <Grid item lg={3} md={3} sm={6} xs={6}>
                            <TextValidator
                                className="w-100"
                                label={<span className="font">{t("EQARound.Code")}</span>}
                                onChange={this.handleChange}
                                type="text"
                                size="small"
                                name="code"
                                variant="outlined"
                                value={this.state.item?.code}
                                validators={["required"]}
                                errorMessages={[t("general.errorMessages_required")]}
                            />
                        </Grid>}
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                className="w-100"
                                margin="none"
                                id="mui-pickers-date"
                                label={<span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQARound.startDate")}
                                </span>
                                }
                                inputVariant="outlined"
                                size="small"
                                type="text"
                                autoOk={false}
                                format="dd/MM/yyyy"
                                invalidDateMessage={t("Invalid_Date_Format")}
                                value={this.state.item?.startDate}
                                onChange={date => this.handleDateChange(date, "startDate")}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                className="w-100"
                                margin="none"
                                id="mui-pickers-date"
                                label={<span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQARound.endDate")}
                                </span>
                                }
                                inputVariant="outlined"
                                size="small"
                                type="text"
                                autoOk={false}
                                format="dd/MM/yyyy"
                                invalidDateMessage={t("Invalid_Date_Format")}
                                value={this.state.item?.endDate}
                                onChange={date => this.handleDateChange(date, "endDate")}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                className="w-100"
                                margin="none"
                                id="mui-pickers-date"
                                label={<span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQARound.registrationStartDate")}
                                </span>
                                }
                                inputVariant="outlined"
                                size="small"
                                type="text"
                                autoOk={false}
                                format="dd/MM/yyyy"
                                name={"registrationStartDate"}
                                value={this.state.item?.registrationStartDate}
                                invalidDateMessage={t("Invalid_Date_Format")}
                                onChange={date =>
                                    this.handleDateChange(date, "registrationStartDate")
                                }
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                className="w-100"
                                margin="none"
                                id="mui-pickers-date"
                                label={<span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQARound.registrationExpiryDate")}
                                </span>
                                }
                                inputVariant="outlined"
                                type="text"
                                size="small"
                                autoOk={false}
                                format="dd/MM/yyyy"
                                invalidDateMessage={t("Invalid_Date_Format")}
                                name={"registrationExpiryDate"}
                                value={this.state.item?.registrationExpiryDate}
                                onChange={date =>
                                    this.handleDateChange(date, "registrationExpiryDate")
                                }
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                className="w-100"
                                margin="none"
                                id="mui-pickers-date"
                                label={<span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQARound.sample_submission_deadline")}
                                </span>
                                }
                                inputVariant="outlined"
                                type="text"
                                size="small"
                                autoOk={false}
                                format="dd/MM/yyyy"
                                invalidDateMessage={t("Invalid_Date_Format")}
                                value={this.state.item?.sampleSubmissionDeadline}
                                onChange={date =>
                                    this.handleDateChange(date, "sampleSubmissionDeadline")
                                }
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>


                    <fieldset className="mt-8" style={{ width: "100%" }}>
                        <legend><span className="styleColor mb-32">{t("EQAPlanning.detail_planning")}</span></legend>
                        <Grid container className="mt-8" sm={12} xs={12} spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={
                                        <span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("EQARound.healthOrgNumber")}
                                        </span>
                                    }
                                    onChange={this.handleChange}
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    name="healthOrgNumber"
                                    value={this.state.item?.healthOrgNumber}
                                    validators={["required"]}
                                    errorMessages={[t("general.errorMessages_required")]}
                                />
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={
                                        <span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("EQARound.sampleNumber")}
                                        </span>
                                    }
                                    onChange={this.handleChange}
                                    type="number"
                                    name="sampleNumber"
                                    value={this.state.item?.sampleNumber}
                                    variant="outlined"
                                    size="small"
                                    validators={["required"]}
                                    errorMessages={[t("general.errorMessages_required")]}
                                />
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={
                                        <span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("EQARound.sampleSetNumber")}
                                        </span>
                                    }
                                    onChange={this.handleChange}
                                    type="number"
                                    name="sampleSetNumber"
                                    value={this.state.item?.sampleSetNumber}
                                    variant="outlined"
                                    size="small"
                                    validators={["required"]}
                                    errorMessages={[t("general.errorMessages_required")]}
                                />
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("EQARound.executionTime")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        size="small"
                                        type="text"
                                        autoOk={false}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.executionTime}
                                        onChange={event =>
                                            this.handleDateChange(event, "executionTime")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                    </fieldset>
                    <fieldset className="mt-16" style={{ width: "100%" }}>
                        <legend><span className="styleColor">{t("EQAPlanning.details")}</span></legend>
                        <span className="title">{t("EQAPlanning.sending_invitation_letter")}</span>
                        <Grid item className="mb-16 mt-8" container sm={12} xs={12} spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("EQARound.detail.startDate")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        size="small"
                                        type="text"
                                        name="startDate"
                                        autoOk={false}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.detailRound[0] ? this.state.item?.detailRound[0].startDate ? this.state.item?.detailRound[0].startDate : null : null}
                                        onChange={event =>
                                            this.handleChangeDetailRound(0, event, "startDate")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("EQARound.detail.endDate")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        type="text"
                                        name="endDate"
                                        autoOk={false}
                                        size="small"
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.detailRound[0] ? this.state.item?.detailRound[0].endDate ? this.state.item?.detailRound[0].endDate : null : null}
                                        onChange={event =>
                                            this.handleChangeDetailRound(0, event, "endDate")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <FormControl fullWidth={true} error={hasErrorPerson} variant="outlined"
                                    size="small">
                                    <InputLabel htmlFor="personnel-simple">{<span className="font"><span style={{ color: "red" }}> * </span> {t('EQARound.detail.responsible_by')} </span>}</InputLabel>
                                    <Select
                                        label={<span className="font"><span style={{ color: "red" }}> * </span> {t('EQARound.detail.responsible_by')} </span>}
                                        value={this.state.item?.detailRound[0]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(0, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font"> {t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(0, event)}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    name="note"
                                    value={this.state.item?.detailRound[0]?.note}
                                />
                            </Grid>
                        </Grid>

                        <span className="title">{t("EQARound.collecting_registration_files")}</span>
                        <Grid item className="mb-16 mt-8" container sm={12} xs={12} spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("EQARound.detail.startDate")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        size="small"
                                        type="text"
                                        name="startDate"
                                        autoOk={false}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.detailRound[1] ? this.state.item?.detailRound[1].startDate ? this.state.item?.detailRound[1].startDate : null : null}
                                        onChange={event => this.handleChangeDetailRound(1, event, "startDate")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> *</span>
                                                {t("EQARound.detail.endDate")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        size="small"
                                        type="text"
                                        name="endDate"
                                        autoOk={false}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.detailRound[1] ? this.state.item?.detailRound[1].endDate ? this.state.item?.detailRound[1].endDate : null : null}
                                        onChange={event => this.handleChangeDetailRound(1, event, "endDate")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <FormControl fullWidth={true} error={hasErrorPerson} variant="outlined"
                                    size="small">
                                    <InputLabel htmlFor="personnel-simple"  >{<span className="font"><span style={{ color: "red" }}> * </span> {t('EQARound.detail.responsible_by')} </span>}</InputLabel>
                                    <Select
                                        label={<span className="font"><span style={{ color: "red" }}> * </span> {t('EQARound.detail.responsible_by')} </span>}
                                        value={this.state.item?.detailRound[1]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(1, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font">{t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(1, event)}
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    name="note"
                                    value={this.state.item?.detailRound[1]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.prepare_supplies")}</span>
                        <Grid item className="mb-16 mt-8" container sm={12} xs={12} spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("EQARound.detail.startDate")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        size="small"
                                        type="text"
                                        name="startDate"
                                        autoOk={false}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.detailRound[2] ? this.state.item?.detailRound[2].startDate ? this.state.item?.detailRound[2].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(2, event, "startDate")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("EQARound.detail.endDate")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        size="small"
                                        type="text"
                                        name="endDate"
                                        autoOk={false}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.detailRound[2] ? this.state.item?.detailRound[2].endDate ? this.state.item?.detailRound[2].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(2, event, "endDate")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <FormControl fullWidth={true} error={hasErrorPerson} variant="outlined"
                                    size="small">
                                    <InputLabel htmlFor="personnel-simple"  >{<span className="font"><span style={{ color: "red" }}> * </span> {t('EQARound.detail.responsible_by')} </span>}</InputLabel>
                                    <Select
                                        label={<span className="font"><span style={{ color: "red" }}> * </span> {t('EQARound.detail.responsible_by')} </span>}
                                        value={this.state.item?.detailRound[2]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(2, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font">{t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(2, event)}
                                    type="text"
                                    name="note"
                                    value={this.state.item?.detailRound[2]?.note}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <span className="title">{t("EQARound.sample_characterization")}</span>
                        <Grid item className="mb-16 mt-8" container sm={12} xs={12} spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("EQARound.detail.startDate")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        size="small"
                                        type="text"
                                        name="startDate"
                                        autoOk={false}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.detailRound[3] ? this.state.item?.detailRound[3].startDate ? this.state.item?.detailRound[3].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(3, event, "startDate")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        className="w-100"
                                        margin="none"
                                        id="mui-pickers-date"
                                        label={
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("EQARound.detail.endDate")}
                                            </span>
                                        }
                                        inputVariant="outlined"
                                        size="small"
                                        type="text"
                                        name="endDate"
                                        autoOk={false}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage={t("Invalid_Date_Format")}
                                        value={this.state.item?.detailRound[3] ? this.state.item?.detailRound[3].endDate ? this.state.item?.detailRound[3].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(3, event, "endDate")
                                        }
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <FormControl fullWidth={true} error={hasErrorPerson} variant="outlined"
                                    size="small">
                                    <InputLabel htmlFor="personnel-simple">{<span className="font"><span style={{ color: "red" }}> * </span> {t('EQARound.detail.responsible_by')} </span>}</InputLabel>
                                    <Select
                                        label={<span className="font"><span style={{ color: "red" }}> * </span> {t('EQARound.detail.responsible_by')} </span>}
                                        value={this.state.item?.detailRound[3]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(3, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font">{t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(3, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[3]?.note}
                                />
                            </Grid>
                        </Grid>
                    </fieldset>

                </Grid>

            </React.Fragment>
        )
    }

}
export default EQARoundInformation;