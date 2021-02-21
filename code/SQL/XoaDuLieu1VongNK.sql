
DELETE de FROM tbl_eqa_result_report_detail de INNER JOIN tbl_eqa_result_report re ON de.result_report_id=re.id
INNER JOIN tbl_health_org_eqaround hoer ON hoer.id=re.health_org_round_id WHERE hoer.eqa_round_id='6db2a84a-ea4b-4efd-9952-402256e4149a';

DELETE re FROM tbl_eqa_result_report re INNER JOIN tbl_health_org_eqaround hoer ON hoer.id=re.health_org_round_id WHERE hoer.eqa_round_id='6db2a84a-ea4b-4efd-9952-402256e4149a';
DELETE es FROM tbl_eqa_sample_tube es where es.eqa_round_id='6db2a84a-ea4b-4efd-9952-402256e4149a';

DELETE hoer FROM  tbl_health_org_eqaround hoer WHERE hoer.eqa_round_id='6db2a84a-ea4b-4efd-9952-402256e4149a';