import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAPlanningTable = EgretLoadable({
  loader: () => import("./EQAPlanningTable")
});
const ViewComponent = withTranslation()(EQAPlanningTable);

const EQAPlanningRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/eqaplanning",
    exact: true,
    component: ViewComponent // component giống với trong jsx    
  }
];

export default EQAPlanningRoutes;