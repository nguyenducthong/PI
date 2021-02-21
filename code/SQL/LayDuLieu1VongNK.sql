
select de.* 
FROM tbl_eqa_result_report_detail de INNER JOIN tbl_eqa_result_report re ON de.result_report_id=re.id
INNER JOIN tbl_health_org_eqaround hoer ON 
hoer.id=re.health_org_round_id WHERE 
hoer.eqa_round_id='6db2a84a-ea4b-4efd-9952-402256e4149a' ORDER BY re.type_method,de.sample_tube_id;
/*hoer.health_org_id IN ('1730d6cb-ca5e-4707-b14e-4e0074bc477a','6616f877-40a0-4e2d-8167-0d1b5cb01996');*/

SELECT re.* FROM tbl_eqa_result_report re INNER JOIN tbl_health_org_eqaround hoer 
ON hoer.id=re.health_org_round_id WHERE hoer.eqa_round_id='1730d6cb-ca5e-4707-b14e-4e0074bc477a';

/*hoer.health_org_id IN ('1730d6cb-ca5e-4707-b14e-4e0074bc477a','6616f877-40a0-4e2d-8167-0d1b5cb01996');*/

SELECT es.* FROM tbl_eqa_sample_tube es 
where  1=1 AND
es.eqa_round_id='1730d6cb-ca5e-4707-b14e-4e0074bc477a';
/*es.health_org_id IN ('1730d6cb-ca5e-4707-b14e-4e0074bc477a','6616f877-40a0-4e2d-8167-0d1b5cb01996');*/

select *  FROM  tbl_health_org_eqaround hoer 
WHERE  1=1 AND
hoer.eqa_round_id='1730d6cb-ca5e-4707-b14e-4e0074bc477a' ;
/*hoer.health_org_id IN ('1730d6cb-ca5e-4707-b14e-4e0074bc477a','6616f877-40a0-4e2d-8167-0d1b5cb01996');*/