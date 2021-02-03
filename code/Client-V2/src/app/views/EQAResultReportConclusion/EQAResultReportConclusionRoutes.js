import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from "react-i18next";
const EQAResultReportConclusionTable = EgretLoadable({
  loader: () => import("./EQAResultReportConclusionTable")
});
const ViewComponent = withTranslation()(EQAResultReportConclusionTable);

const eqaResultReportConclusion = [
  {
    path: ConstantList.ROOT_PATH + "result-report-conclusion",
    exact: true,
    component: ViewComponent
  }
];

export default eqaResultReportConclusion;
