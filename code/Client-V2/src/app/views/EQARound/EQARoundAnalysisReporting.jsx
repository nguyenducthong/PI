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
    autoClose: 2000,
    draggable: false,
    limit: 3
    //etc you get the idea
});

//Phân tích, gửi kết quả
class EQARoundAnalysisReporting extends React.Component {
    state = {

    }

    componentDidMount() {

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

    componentWillMount() {
        let { item, listPersonnel } = this.props;

        this.setState({ item: item, listPersonnel: listPersonnel }, () => {
            this.state.item = item
        });
    }
    render() {
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
            sampleNumber,
            sampleSetNumber,
            healthOrgNumber,
            executionTime,
        } = this.state.item;
        let { listPersonnel } = this.state;
        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <fieldset className="mt-16" style={{ width: "100%" }}>
                        <span className="title">{t("EQARound.preliminaryReport")}</span>
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
                                        value={this.state.item?.detailRound[16] ? this.state.item?.detailRound[16].startDate ? this.state.item?.detailRound[16].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(16, event, "startDate")
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
                                        value={this.state.item?.detailRound[16] ? this.state.item?.detailRound[16].endDate ? this.state.item?.detailRound[16].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(16, event, "endDate")
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
                                        value={this.state.item?.detailRound[16]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(16, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {/* {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>} */}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font">{t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(16, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[16]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.dataDoubleEntries")}</span>
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
                                        value={this.state.item?.detailRound[17] ? this.state.item?.detailRound[17].startDate ? this.state.item?.detailRound[17].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(17, event, "startDate")
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
                                        value={this.state.item?.detailRound[17] ? this.state.item?.detailRound[17].endDate ? this.state.item?.detailRound[17].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(17, event, "endDate")
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
                                        value={this.state.item?.detailRound[17]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(17, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {/* {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>} */}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font">{t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(17, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[17]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.dataCheckingAndClearing")}</span>
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
                                        value={this.state.item?.detailRound[18] ? this.state.item?.detailRound[18].startDate ? this.state.item?.detailRound[18].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(18, event, "startDate")
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
                                        value={this.state.item?.detailRound[18] ? this.state.item?.detailRound[18].endDate ? this.state.item?.detailRound[18].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(18, event, "endDate")
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
                                        value={this.state.item?.detailRound[18]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(18, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {/* {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>} */}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font">{t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(18, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[18]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.dataAnalysis")}</span>
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
                                        value={this.state.item?.detailRound[19] ? this.state.item?.detailRound[19].startDate ? this.state.item?.detailRound[19].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(19, event, "startDate")
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
                                        value={this.state.item?.detailRound[19] ? this.state.item?.detailRound[19].endDate ? this.state.item?.detailRound[19].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(19, event, "endDate")
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
                                        value={this.state.item?.detailRound[19]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(19, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {/* {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>} */}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font">{t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(19, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[19]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.finalReport")}</span>

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
                                        value={this.state.item?.detailRound[20] ? this.state.item?.detailRound[20].startDate ? this.state.item?.detailRound[20].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(20, event, "startDate")
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
                                        value={this.state.item?.detailRound[20] ? this.state.item?.detailRound[20].endDate ? this.state.item?.detailRound[20].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(20, event, "endDate")
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
                                        value={this.state.item?.detailRound[20]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(20, event)}
                                        inputProps={{
                                            name: "personnel",
                                            id: "personnel-simple"
                                        }}
                                    >
                                        {listPersonnel.map(item => {
                                            return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                                        })}
                                    </Select>
                                    {/* {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>} */}
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <TextValidator
                                    className="w-100"
                                    label={<span className="font">{t("EQARound.detail.note")}</span>}
                                    onChange={event => this.handleChangeDetailRound(20, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[20]?.note}
                                />
                            </Grid>
                        </Grid>
                    </fieldset>
                </Grid>
            </React.Fragment>
        )

    }
}

export default EQARoundAnalysisReporting;