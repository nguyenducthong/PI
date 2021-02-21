import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import ConstantList from "../../appConfig";
const EqaRound = EgretLoadable({
  loader: () => import("./EQARound")
});
const ViewComponent = withTranslation()(EqaRound);
const EqaRoundRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/eqaround",
    exact: true,
    component: ViewComponent // component giống với trong jsx    
  }
];

export default EqaRoundRoutes;
