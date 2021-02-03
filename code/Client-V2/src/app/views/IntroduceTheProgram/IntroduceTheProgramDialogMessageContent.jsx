import React, { Component } from 'react';
import {
    Dialog,
    Button,
    Grid,
    DialogActions,
    FormControlLabel,
    Switch,
    DialogTitle,
    DialogContent,
    Icon,
    IconButton,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { generateRandomId } from "utils";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/views/_style.scss";
import EditorForm from "./EditorForm";
import { addNew, update } from "./IntroduceTheProgramService";
import IntroduceTheProgramDialogTab from "./IntroduceTheProgramDialogTab";
import Checkbox from '@material-ui/core/Checkbox';

class IntroduceTheProgramDialogMessageContent extends Component {
    componentWillMount() {
        let { open, handleClose, item, isRoleAdmin, isView } = this.props;
        this.setState({
            item: item,
        })
    }

    handleChangeContent = (messageContent) => {
        let { item } = this.state
        item["messageContent"] = messageContent;
        this.setState({ item: item });
    };
    render() {
        let { t } = this.props;
        let { item } = this.state;
        return (
            <div>
                <Grid className="mb-8" container spacing={4}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <EditorForm
                            content={item.messageContent ? item.messageContent : ""}
                            handleChangeContent={this.handleChangeContent}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default IntroduceTheProgramDialogMessageContent;