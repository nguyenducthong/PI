import { EgretLoadable } from "egret";
import { authRoles } from "../../auth/authRoles";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';

const EQAReferenceDocument = EgretLoadable({
    loader: () => import("./EQAReferenceDocument")
})

const ViewEQAReferenceDocument = withTranslation()(EQAReferenceDocument);

const EQAReferenceDocumentRoutes = [
    {
        path: ConstantList.ROOT_PATH + "dashboard/reference_document",
        exact: true,
        component: ViewEQAReferenceDocument
    }
];

export default EQAReferenceDocumentRoutes;
