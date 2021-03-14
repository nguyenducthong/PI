import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Contact = EgretLoadable({
  loader: () => import("./Contact")
});

const ViewComponent = withTranslation()(Contact);

const ContactRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/contact",
    exact: true,
    component: ViewComponent // component giống với trong jsx    
  },

];

export default ContactRoutes;