import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const TestPurposeTable = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./TestPurposeTable")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(TestPurposeTable);

const testPurposeRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/test_purpose",
    exact: true,
    component: ViewComponent
  }
];

export default testPurposeRoutes;
