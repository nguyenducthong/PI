import React, { useState, useEffect, useRef } from "react";
import { Grid, TextField } from "@material-ui/core";
import { Breadcrumb } from "egret";
import { Helmet } from "react-helmet";
import { getAllResultConclusionByRoundId,getListResultByRoundId } from "./EQARoundConclusionsServices";
import { searchByPage as getAllEQARound } from "../EQARound/EQARoundService.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "react-pivottable/pivottable.css";
import * as WebDataRocksReact from "../../component/webdatarocks.react";
// toast.configure({
//   autoClose: 2000,
//   draggable: false,
//   limit:3
//   //etc you get the idea
// });
const testData = [
  {
    healthOrgCode: "S-1",
    tubeCode: "ABC",
    result: 1,
    sampleCode: "Sample 1"
  },
  {
    healthOrgCode: "S-2",
    tubeCode: "ABC",
    result: 2,
    sampleCode: "Sample 1"
  },
  {
    healthOrgCode: "S-1",
    tubeCode: "ABCD",
    result: 0,
    sampleCode: "Sample 1"
  },
  {
    healthOrgCode: "S-2",
    tubeCode: "ABCD",
    result: 1,
    sampleCode: "Sample 1"
  },
  {
    healthOrgCode: "S-1",
    tubeCode: "DEF",
    result: 2,
    sampleCode: "Sample 1"
  },
  {
    healthOrgCode: "S-2",
    tubeCode: "DEF",
    result: 0,
    sampleCode: "Sample 1"
  },
  {
    healthOrgCode: "S-1",
    tubeCode: "GHI",
    result: 2,
    sampleCode: "Sample 1"
  },
  {
    healthOrgCode: "S-2",
    tubeCode: "GHI",
    result: 0,
    sampleCode: "Sample 1"
  },
  {
    healthOrgCode: "S-3",
    tubeCode: "ABC",
    result: 0,
    sampleCode: "Sample 2"
  },
  {
    healthOrgCode: "S-4",
    tubeCode: "ABC",
    result: 1,
    sampleCode: "Sample 2"
  },
  {
    healthOrgCode: "S-3",
    tubeCode: "ABCD",
    result: 2,
    sampleCode: "Sample 2"
  },
  {
    healthOrgCode: "S-4",
    tubeCode: "ABCD",
    result: 2,
    sampleCode: "Sample 2"
  },
  {
    healthOrgCode: "S-3",
    tubeCode: "GHI",
    result: 0,
    sampleCode: "Sample 2"
  },
  {
    healthOrgCode: "S-4",
    tubeCode: "GHI",
    result: 1,
    sampleCode: "Sample 2"
  },
  {
    healthOrgCode: "S-3",
    tubeCode: "DEF",
    result: 1,
    sampleCode: "Sample 2"
  },
  {
    healthOrgCode: "S-4",
    tubeCode: "DEF",
    result: 1,
    sampleCode: "Sample 2"
  }
];

const formatData = [
  { healthOrgCode: " ", tubeCode: " ", result: " ", sampleCode: " " }
];

const EQARoundConclusionsTable = ({ t, ...props }) => {
  const [tableData, setTableData] = useState(formatData);
  const [listEQARound, setListEQARound] = useState([]);
  const [currentRound, setCurrentRound] = useState({});
  const webDataRocksRef = useRef(null);

  useEffect(() => {
    const searchObject = { pageIndex: 0, pageSize: 1000000 };
    getAllEQARound(searchObject).then(res => {
      setListEQARound(res.data.content);
    });
  }, []);

  /* Comment this function out if you want to use testData */
  useEffect(() => {
    if (typeof currentRound?.id != "undefined") {
      getListResultByRoundId(currentRound.id).then(res => {
        if (res.data) {
          setTableData(res.data);
          webDataRocksRef.current.webdatarocks.updateData({
            data: res.data
          });
        } else {
          setTableData(formatData);
          webDataRocksRef.current.webdatarocks.updateData({
            data: formatData
          });
        }
      });
    }
  }, [currentRound]);

  return (
    <div className="m-sm-30">
      <Helmet>
        <title>
          {t("EQARoundConclusions.title")} | {t("web_site")}
        </title>
      </Helmet>
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[{ name: t("EQARoundConclusions.title") }]}
        />
      </div>
      <Grid container spacing={3}>
        <Grid item md={4} sm={4} xs={4}>
          <Autocomplete
            size="small"
            id="combo-box"
            options={listEQARound}
            className="flex-end"
            getOptionLabel={option =>
              option.code != null && typeof option.code != "undefined"
                ? option.code
                : ""
            }
            onChange={(event, newValue) => setCurrentRound(newValue)}
            value={currentRound}
            renderInput={params => (
              <TextField
                {...params}
                label={t("EQAResultReportConclusion.select_eqa_round")}
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <WebDataRocksReact.Pivot
            ref={webDataRocksRef}
            toolbar={true}
            report={{
              dataSource: {
                data: tableData //set {data: testData} if you want to use test data, {data: tableData} if you want to use real data
              },
              slice: {
                rows: [
                  {
                    uniqueName: "sampleCode",
                    caption: t("EQASampleSet.sample_code")
                  },
                  {
                    uniqueName: "tubeCode",
                    caption: t("EQARoundConclusions.tube_code")
                  }
                ],
                columns: [
                  {
                    uniqueName: "positiveAffirmativeRight",
                    caption: "PXN khẳng định"
                  },
                  {
                    uniqueName: "healthOrgCode",
                    caption: t("EQARoundConclusions.health_org_code")
                  }                  
                ],
                measures: [                  
                  {
                    uniqueName: "result",
                    caption: t("EQARoundConclusions.result")
                  }                  
                ],
                "expands": {
                  "expandAll": true
                }
              },
              options: {
                grid: {
                  "type": "classic",
                  showGrandTotals: "off",
                  showTotals: "off"
                }
              }
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default EQARoundConclusionsTable;
