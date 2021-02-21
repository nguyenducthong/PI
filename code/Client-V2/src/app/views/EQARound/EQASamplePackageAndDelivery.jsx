import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,MenuItem,
  FormControl, InputLabel, Select,
  Switch,FormHelperText,
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
import { MuiPickersUtilsProvider, DatePicker,KeyboardDatePicker } from "@material-ui/pickers";
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


//ĐÓNG GÓI VÀ GỬI MẪU 
class SamplePackageAndDelivery extends React.Component {
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
        let { item,listPersonnel } = this.props;

        this.setState({ item: item, listPersonnel: listPersonnel}, () => {
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
          let { listPersonnel } = this.state
        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <fieldset className="mt-16" style={{ width: "100%" }}>
                        {/* <legend><span className="styleColor mb-32">{t("EQARound.printingDocument")}</span></legend> */}
                        <span className="title">{t("EQARound.printingDocument")}</span>
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
                                        value={this.state.item?.detailRound[9] ? this.state.item?.detailRound[9].startDate ? this.state.item?.detailRound[9].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(9, event, "startDate")
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
                                        value={this.state.item?.detailRound[9] ? this.state.item?.detailRound[9].endDate ? this.state.item?.detailRound[9].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(9, event, "endDate")
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
                                        value={this.state.item?.detailRound[9]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(9, event)}
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
                                    onChange={event => this.handleChangeDetailRound(9, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[9]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.samplePakage1")}</span>
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
                                        value={this.state.item?.detailRound[10] ? this.state.item?.detailRound[10].startDate ? this.state.item?.detailRound[10].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(10, event, "startDate")
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
                                        value={this.state.item?.detailRound[10] ? this.state.item?.detailRound[10].endDate ? this.state.item?.detailRound[10].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(10, event, "endDate")
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
                                        value={this.state.item?.detailRound[10]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(10, event)}
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
                                    onChange={event => this.handleChangeDetailRound(10, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[10]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.samplePakage2")}</span>
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
                                        value={this.state.item?.detailRound[11] ? this.state.item?.detailRound[11].startDate ? this.state.item?.detailRound[11].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(11, event, "startDate")
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
                                        value={this.state.item?.detailRound[11] ? this.state.item?.detailRound[11].endDate ? this.state.item?.detailRound[11].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(11, event, "endDate")
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
                                        value={this.state.item?.detailRound[11]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(11, event)}
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
                                    onChange={event => this.handleChangeDetailRound(11, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[11]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.packingSamples")}</span>
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
                                        value={this.state.item?.detailRound[12] ? this.state.item?.detailRound[12].startDate ? this.state.item?.detailRound[12].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(12, event, "startDate")
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
                                        value={this.state.item?.detailRound[12] ? this.state.item?.detailRound[12].endDate ? this.state.item?.detailRound[12].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(12, event, "endDate")
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
                                        value={this.state.item?.detailRound[12]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(12, event)}
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
                                    onChange={event => this.handleChangeDetailRound(12, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[12]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.sendingThePanel")}</span>

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
                                        value={this.state.item?.detailRound[13] ? this.state.item?.detailRound[13].startDate ? this.state.item?.detailRound[13].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(13, event, "startDate")
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
                                        value={this.state.item?.detailRound[13] ? this.state.item?.detailRound[13].endDate ? this.state.item?.detailRound[13].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(13, event, "endDate")
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
                                        value={this.state.item?.detailRound[13]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(13, event)}
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
                                    onChange={event => this.handleChangeDetailRound(13, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[13]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.collectionReportForm")}</span>
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
                                        value={this.state.item?.detailRound[14] ? this.state.item?.detailRound[14].startDate ? this.state.item?.detailRound[14].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(14, event, "startDate")
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
                                        value={this.state.item?.detailRound[14] ? this.state.item?.detailRound[14].endDate ? this.state.item?.detailRound[14].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(14, event, "endDate")
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
                                        value={this.state.item?.detailRound[14]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(14, event)}
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
                                    onChange={event => this.handleChangeDetailRound(14, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[14]?.note}
                                />
                            </Grid>
                        </Grid>
                        <span className="title">{t("EQARound.feedbackToParticipant")}</span>
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
                                        value={this.state.item?.detailRound[15] ? this.state.item?.detailRound[15].startDate ? this.state.item?.detailRound[15].startDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(15, event, "startDate")
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
                                        value={this.state.item?.detailRound[15] ? this.state.item?.detailRound[15].endDate ? this.state.item?.detailRound[15].endDate : null : null}
                                        onChange={
                                            event => this.handleChangeDetailRound(15, event, "endDate")
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
                                        value={this.state.item?.detailRound[15]?.personnel}
                                        onChange={event => this.handleChangeDetailRound(15, event)}
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
                                    onChange={event => this.handleChangeDetailRound(15, event)}
                                    type="text"
                                    name="note"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.item?.detailRound[15]?.note}
                                />
                            </Grid>
                        </Grid>
                    </fieldset>
                </Grid>
            </React.Fragment>
        )
    }

}
export default SamplePackageAndDelivery