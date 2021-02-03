import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQASampleSetTable = EgretLoadable({
  loader: () => import("./EQASampleSet")
});
const ViewComponent = withTranslation()(EQASampleSetTable);

const EQASampleSetRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"sample/eqa_sample_set",
    exact: true,
    component: ViewComponent
  }
];

export default EQASampleSetRoutes;
