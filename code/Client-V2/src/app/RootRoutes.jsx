import React from "react";
import { Redirect } from "react-router-dom";
import homeRoutes from "./views/home/HomeRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import administrativeUnitRoutes from "./views/AdministrativeUnit/AdministrativeUnitRoutes";
import UserRoutes from "./views/User/UserRoutes";
import roleRoutes from "./views/Role/RoleRoutes";
import ConstantList from "./appConfig";
import MenuRoutes from "./views/Menus/MenuRoutes";
import pageLayoutRoutes from "./views/page-layouts/PageLayoutRoutees";
import eqaPlanningRoutes from "./views/EQAPlanning/EQAPlanningRoutes";
import eqaRoundRoutes from "./views/EQARound/EQARoundRoutes";
import eQAHealthOrgRoutes from "./views/EQAHealthOrg/EQAHealthOrgRoutes";
import eQAHealthOrgRoundRegisterRoutes from "./views/EQAHealthOrgRoundRegister/EQAHealthOrgRoundRegisterRoutes";
import healthOrgRegisterFormRoutes from "./views/HealthOrgRegisterForm/HealthOrgRegisterFormRoutes";
import reagentRoutes from "./views/Reagent/ReagentRoutes";
import personnelRoutes from "./views/Personnel/PersonnelRoutes";
import eQASerumBankRoutes from "./views/EQASerumBank/EQASerumBankRoutes";
import eQASampleRoutes from "./views/EQASamplesList/EQASampleRoutes";
import eQASampleSetRoutes from "./views/EQASampleSet/EQASampleSetRoutes";
import testMethodRoutes from "./views/TestMethod/TestMethodRoutes";
import eQASerumBottleRoutes from "./views/EQASerumBottle/EQASerumBottleRoutes";
import eqaHealthOrgSampleTransferStatusRoutes from "./views/EQAHealthOrgSampleTransferStatus/EQAHealthOrgSampleTransferStatusRoutes";
import labelPrintingRoutes from "./views/LabelPrinting/LabelPrintingRoutes";
import eqaResultReportElisaRoute from "./views/EQAResultReportElisa/EQAResultReportElisaRoutes";
import eQAResultReportSerodiaRoutes from "./views/EQAResultReportSerodia/EQAResultReportSerodiaRoutes";
import eQAResultReportFastTestRoutes from "./views/EQAResultReportFastTest/EQAResultReportFastTestRoutes";
import eQAResultReportEcliaRoutes from "./views/EQAResultReportEclia/EQAResultReportEcliaRoutes";
import eqaResultReportConclusionRoutes from "./views/EQAResultReportConclusion/EQAResultReportConclusionRoutes";
import eqaResultReportConclusionAllRoutes from "./views/EQAResultReportConclusionAll/EQAResultReportConclusionAllRoutes";
import resultsOfTheUnitsRoutes from "./views/ResultsOfTheUnits/ResultsOfTheUnitsRoutes";
import allocationSampleSet from "./views/AllocationSampleSet/AllocationSampleSetRoutes";
import ReferenceResultsRoutes from "./views/ReferenceResults/ReferenceResultsRoutes";
import ReportSimilarityReagentRoutes from "./views/ReportSimilarityReagent/ReportSimilarityReagentRoutes";
import ReferenceResultRoutes from "./views/ReferenceResult/ReferenceResultRoutes";
import EQAReferenceDocument from "./views/EQAReferenceDocument/EQAReferenceDocumentRoutes";
import Contact from "./views/Contact/ContactRoutes";

const redirectRoute = [
  {
    path: ConstantList.ROOT_PATH,
    exact: true,
    component: () => <Redirect to={ConstantList.HOME_PAGE} /> //Luôn trỏ về HomePage được khai báo trong appConfig
  }
];

const errorRoute = [
  {
    component: () => <Redirect to={ConstantList.ROOT_PATH + "session/404"} />
  }
];

const routes = [
  ...homeRoutes,
  ...sessionRoutes,
  ...dashboardRoutes,
  ...administrativeUnitRoutes,
  ...pageLayoutRoutes,
  ...eQASampleSetRoutes,
  ...reagentRoutes,
  ...eQASerumBankRoutes,
  ...eQAHealthOrgRoutes,
  ...eQAHealthOrgRoundRegisterRoutes,
  ...healthOrgRegisterFormRoutes,
  ...eqaResultReportElisaRoute,
  ...eQAResultReportSerodiaRoutes,
  ...eQAResultReportFastTestRoutes,
  ...eQAResultReportEcliaRoutes,
  ...eqaResultReportConclusionRoutes,
  ...eqaHealthOrgSampleTransferStatusRoutes,
  ...eqaResultReportConclusionAllRoutes,
  ...personnelRoutes,
  ...eqaRoundRoutes,
  ...eqaPlanningRoutes,
  ...eQASampleRoutes,
  ...labelPrintingRoutes,
  ...eQASerumBottleRoutes,
  ...testMethodRoutes,
  ...allocationSampleSet,
  ...UserRoutes,
  ...roleRoutes,
  ...MenuRoutes,
  ...resultsOfTheUnitsRoutes,
  ...redirectRoute,
  ...ReferenceResultsRoutes,
  ...ReportSimilarityReagentRoutes,
  ...ReferenceResultRoutes,
  ...EQAReferenceDocument,
  ...Contact,
  ...errorRoute

];

export default routes;
