import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import ConstantList from "../../appConfig";
const IntroduceTheProgram = EgretLoadable({
  loader: () => import("./IntroduceTheProgram")
});
const ViewComponent = withTranslation()(IntroduceTheProgram);
const IntroduceTheProgramRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/intro",
    exact: true,
    component: ViewComponent // component giống với trong jsx    
  }
];

export default IntroduceTheProgramRoutes;