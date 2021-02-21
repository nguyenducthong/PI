import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Tabs = EgretLoadable({
  loader: () => import("./Tabs")
});
const ViewComponent = withTranslation()(Tabs);

const CheckPointRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"report_result/check_point",
    exact: true,
    component: ViewComponent
  }
];

export default CheckPointRoutes;