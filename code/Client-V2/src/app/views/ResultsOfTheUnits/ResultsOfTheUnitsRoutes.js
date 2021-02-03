import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ResultsOfTheUnits = EgretLoadable({
  loader: () => import("./ResultsOfTheUnits")
});
const ViewComponent = withTranslation()(ResultsOfTheUnits);

const ResultsOfTheUnitsRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"report_result/results_of_the_units",
    exact: true,
    component: ViewComponent
  }
];

export default ResultsOfTheUnitsRoutes;
