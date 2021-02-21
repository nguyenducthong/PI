import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ResultsOfUnitsByReagentGroup = EgretLoadable({
  loader: () => import("./ResultsOfUnitsByReagentGroup")
});
const ViewComponent = withTranslation()(ResultsOfUnitsByReagentGroup);

const ResultsOfUnitsByReagentGroupRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"report_result/results_of_units_by_reagent_group",
    exact: true,
    component: ViewComponent
  }
];

export default ResultsOfUnitsByReagentGroupRoutes;