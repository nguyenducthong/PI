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
        let { open, handleClose, item  } = this.props;
      
        this.setState({ item: item}, () => {
            this.state.item = item
        });
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
                </Grid>

            </React.Fragment>
        )
    }

}
export default EQARoundInformation;