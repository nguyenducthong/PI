import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQASerumBottle = EgretLoadable({
  loader: () => import("./EQASerumBottle")
});
const ViewComponent = withTranslation()(EQASerumBottle);

const eQASerumBottleRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"sample/serum_bottle",
    exact: true,
    component: ViewComponent
  }
];

export default eQASerumBottleRoutes;
