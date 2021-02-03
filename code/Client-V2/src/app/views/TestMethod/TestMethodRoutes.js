import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const TestMethodTable = EgretLoadable({
  loader: () => import("./TestMethod")
});
const ViewComponent = withTranslation()(TestMethodTable);

const TestMethodRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"sample/test_method",
    exact: true,
    component: ViewComponent
  }
];

export default TestMethodRoutes;
