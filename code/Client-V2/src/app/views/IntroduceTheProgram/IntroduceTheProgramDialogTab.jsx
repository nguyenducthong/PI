import ConstantList from "../../appConfig";
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import PhoneIcon from '@material-ui/icons/Phone'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PersonPinIcon from '@material-ui/icons/PersonPin'
import HelpIcon from '@material-ui/icons/Help'
import ShoppingBasket from '@material-ui/icons/ShoppingBasket'
import ThumbDown from '@material-ui/icons/ThumbDown'
import ThumbUp from '@material-ui/icons/ThumbUp'
import moment from "moment";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Helmet } from 'react-helmet';
import Fab from "@material-ui/core/Fab";
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  Typography,
  Tabs,
  Box,
  Tab,
  AppBar,
  TextField,
  Checkbox,
  FormLabel,
  Button,
  Grid,
  FormControlLabel,
  IconButton,
  Icon,
  FormControl,
  RadioGroup,
  Radio,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import QRCode from 'qrcode.react'
import {
  MuiPickersUtilsProvider, DateTimePicker,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import AsynchronousAutocomplete from '../utilities/AsynchronousAutocomplete'
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import NumberFormat from 'react-number-format';
import IntroduceTheProgramDialogInfomation from "./IntroduceTheProgramDialogInfomation";
import IntroduceTheProgramDialogMessageContent from "./IntroduceTheProgramDialogMessageContent";
import IntroduceTheProgramDialogAttachment from "./IntroduceTheProgramDialogAttachment";
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    position: "absolute",
    top: '-10px',
    left: '-25px',
    width: '80px'
  }
}))(Tooltip);

function MaterialButton(props) {
  const { t, i18n } = props;
  const item = props.item;
  return (
    <span>
      {/* <LightTooltip title={t('Asset.reload_code')} placement="top" enterDelay={300} leaveDelay={200}> */}
      <IconButton onClick={() => props.onSelect(item, 1)}>
        <Icon color="primary">delete</Icon>
      </IconButton>
      {/* </LightTooltip> */}
    </span>
  )
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        props.onChange({
          target: {
            name: props.name,
            value: values.value,

          },
        });
      }}
      name={props.name}
      value={props.value}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <React.Fragment>
      <div role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )
        }
      </div>
    </React.Fragment>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    minHeight: "500px",
    maxHeight: "500px",
    backgroundColor: theme.palette.background.paper,
  },
  textHeader: { fontSize: '0.75rem', }
}))

// const textHeader = {
//   fontSize:{fontSize:'0.5rem',}


// }
//Thuộc bảng thông báo
export default function CreateStaff(props) {
  const t = props.t
  const i18n = props.i18n
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const [item, setItem] = React.useState({})
  const [v, setValueD] = React.useState('')
  const handleChangeValue = (event, newValue) => {
    setValue(newValue)
  }

  const searchObject = { pageIndex: 1, pageSize: 1000000 }

  let isEmpty = true;
  if (props.item != null && props.item.files != null) {
    isEmpty = props.item.files.length === 0;
    if (props.item.logoPath) {
      isEmpty = false
    }
  }

  return (
    <div className={classes.root} value={value} index={0} >

      <AppBar position="static" color="#ffffff">
        <Tabs orientation="horizontal"
          value={value}
          onChange={handleChangeValue}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >

          <Tab label={t('messContent')} />
          {/* <Tab label={t("messContent")} /> */}
          <Tab label={t('fileAttachment')} />
          {/* <Tab label={t('human_resources_information.working_process')} /> */}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} color="#ffffff">
        <IntroduceTheProgramDialogInfomation t={t}
          useStyles={useStyles}
          item={props.item ? props.item : {}}
          // isView = {props.isView ? props.isView : {}}
          isRoleAdmin={props.isRoleAdmin}
        //   listHealthOrgRound={props.listHealthOrgRound ? props.listHealthOrgRound : []}
        />
      </TabPanel>
      {/* <TabPanel value={value} index={1} color="#ffffff">
        <IntroduceTheProgramDialogMessageContent
          t={t}
          useStyles={useStyles}
          isRoleAdmin={props.isRoleAdmin}
          item={props.item ? props.item : {}} />
      </TabPanel> */}

      <TabPanel value={value} index={1} color="#ffffff">
        <IntroduceTheProgramDialogAttachment t={t}
          useStyles={useStyles}
          isRoleAdmin={props.isRoleAdmin}
          item={props.item ? props.item : {}} />
      </TabPanel>
    </div>
  )
}
