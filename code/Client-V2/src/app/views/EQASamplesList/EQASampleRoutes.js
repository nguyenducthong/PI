import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQASampleList = EgretLoadable({
  loader: () => import("./EQASamplesList")
});
const ViewComponent = withTranslation()(EQASampleList);

const EQASampleRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"sample/sample-list",
    exact: true,
    component: ViewComponent
  }
];

export default EQASampleRoutes;
