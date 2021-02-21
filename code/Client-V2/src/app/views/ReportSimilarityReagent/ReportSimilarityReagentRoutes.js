import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from "react-i18next";
const ReportSimilarityReagent = EgretLoadable({
  loader: () => import("./ReportSimilarityReagent")
});
const ViewComponent = withTranslation()(ReportSimilarityReagent);

const ReportSimilarityReagentRoutes = [
  {
    path: ConstantList.ROOT_PATH + "report_result/report_similarity_reagent",
    exact: true,
    component: ViewComponent
  }
];

export default ReportSimilarityReagentRoutes;