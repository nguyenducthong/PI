import React from "react";
import { Redirect } from "react-router-dom";
import homeRoutes from "./views/home/HomeRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import administrativeUnitRoutes from "./views/AdministrativeUnit/AdministrativeUnitRoutes";
import otherRoutes from "./views/others/OtherRoutes";
import UserRoutes from "./views/User/UserRoutes";
import departmentRoutes from "./views/Department/DepartmentRoutes";
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
import technicianRoutes from "./views/Technician/TechnicianRoutes";
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
import roundConclusionsRoutes from "./views/EQARoundConclusions/EQARoundConclusionsRoutes";
import EQAActivityLogRoutes from "./views/EQAActivityLog/EQAActivityLogRoutes";
import ReferenceResultsRoutes from "./views/ReferenceResults/ReferenceResultsRoutes";
import ReportSimilarityReagentRoutes from "./views/ReportSimilarityReagent/ReportSimilarityReagentRoutes";
import ResultsOfUnitsByReagentGroupRoutes from "./views/ResultsOfUnitsByReagentGroup/ResultsOfUnitsByReagentGroupRoutes";
import ReferenceResultRoutes from "./views/ReferenceResult/ReferenceResultRoutes";
import EQAReferenceDocument from "./views/EQAReferenceDocument/EQAReferenceDocumentRoutes";

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
  ...departmentRoutes,
  ...pageLayoutRoutes,
  ...eQASampleSetRoutes,
  ...reagentRoutes,
  ...eQASerumBankRoutes,
  ...ResultsOfUnitsByReagentGroupRoutes,
  ...eQAHealthOrgRoutes,
  ...eQAHealthOrgRoundRegisterRoutes,
  ...healthOrgRegisterFormRoutes,
  ...eqaResultReportElisaRoute,
  ...eQAResultReportSerodiaRoutes,
  ...eQAResultReportFastTestRoutes,
  ...roundConclusionsRoutes,
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
  ...technicianRoutes,
  ...allocationSampleSet,
  ...UserRoutes,
  ...roleRoutes,
  ...MenuRoutes,
  ...resultsOfTheUnitsRoutes,
  ...redirectRoute,
  ...EQAActivityLogRoutes,
  ...ReferenceResultsRoutes,
  ...ReportSimilarityReagentRoutes,
  ...ReferenceResultRoutes,
  ...EQAReferenceDocument,
  ...errorRoute

];

export default routes;
