import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAResultReportFastTestTable = EgretLoadable({
  loader: () => import("./EQAResultReportFastTest")
});
const ViewComponent = withTranslation()(EQAResultReportFastTestTable);

const EQAResultReportFastTestRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"result-report/fast_test",
    exact: true,
    component: ViewComponent
  }
];

export default EQAResultReportFastTestRoutes;
