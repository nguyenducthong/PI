import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from "react-i18next";
const ReferenceResults = EgretLoadable({
  loader: () => import("./ReferenceResults")
});
const ViewComponent = withTranslation()(ReferenceResults);

const ReferenceResultsRoutes = [
  {
    path: ConstantList.ROOT_PATH + "report_result/reference_results",
    exact: true,
    component: ViewComponent
  }
];

export default ReferenceResultsRoutes;