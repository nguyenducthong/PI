import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const TechnicianTable = EgretLoadable({
  loader: () => import("./Technician")
});
const ViewComponent = withTranslation()(TechnicianTable);

const TechnicianRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/technician",
    exact: true,
    component: ViewComponent
  }
];

export default TechnicianRoutes;
