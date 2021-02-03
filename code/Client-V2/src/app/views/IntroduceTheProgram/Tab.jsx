import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { getCurrentUser } from "../page-layouts/UserProfileService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IntroduceTheProgramTable from "./IntroduceTheProgramTable";
import IntroduceTheProgramDemo from "./IntroduceTheProgramDemo";
import MessageManagementTable from "./MessageManagementTable";
import {getItemActive}  from "./IntroduceTheProgramService";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3,
});
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TabsHealthOrgRegisterForm(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { t, i18n } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <div className="">
      {/* <div className="mb-sm-30">
        <Breadcrumb routeSegments={[{ name: t("HealthOrgRegisterForm.title") }]} />
      </div> */}
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label={t("Intro.title")} {...a11yProps(0)} />
            {/* <Tab label={t('HealthOrgRegisterForm.tab1')} {...a11yProps(1)} /> */}
            <Tab label={t("messageManagement")} {...a11yProps(1)} />
            <Tab label={t("management")} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <IntroduceTheProgramDemo t={t} i18n={i18n} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <IntroduceTheProgramTable t={t} i18n={i18n} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <MessageManagementTable t={t} i18n={i18n} />
        </TabPanel>
      </div>
    </div>
  );
}
