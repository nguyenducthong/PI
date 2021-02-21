package com.globits.PI.functiondto;

import java.util.UUID;

public class TestResultDto {
	private UUID healthOrgId;//ID đơn vị XN
	
	private String sampleCode;//Mã mẫu
	
	private UUID sampleId;//Id mẫu
	
	private String reagent;//Sinh phẩm
	
	private UUID reagentId;//Id Sinh phẩm
	
	private Long totalNegativeResults;
	
	private Long totalPositiveResults;
	
	private Long totalIndertermineResults;
	
	private Long totalHealthOrg;
	
	private Long totalResults;
	
	private Long totalNonResults;
	
	private Integer resultSample;//Kết quả âm tính, dương tính, không xác định, không thực hiện
	
	private Integer resultPi;//Kết quả âm tính, dương tính, không xác định, không thực hiện
	
	private String percentNegativeResults;
	
	private String percentPositiveResults;
	
	private String percentIndertermineResults;
	
	private Integer typeMethod;

	public UUID getHealthOrgId() {
		return healthOrgId;
	}

	public void setHealthOrgId(UUID healthOrgId) {
		this.healthOrgId = healthOrgId;
	}

	public String getSampleCode() {
		return sampleCode;
	}

	public void setSampleCode(String sampleCode) {
		this.sampleCode = sampleCode;
	}

	public UUID getSampleId() {
		return sampleId;
	}

	public void setSampleId(UUID sampleId) {
		this.sampleId = sampleId;
	}

	public String getReagent() {
		return reagent;
	}

	public void setReagent(String reagent) {
		this.reagent = reagent;
	}

	public UUID getReagentId() {
		return reagentId;
	}

	public void setReagentId(UUID reagentId) {
		this.reagentId = reagentId;
	}

	public Long getTotalNegativeResults() {
		return totalNegativeResults;
	}

	public void setTotalNegativeResults(Long totalNegativeResults) {
		this.totalNegativeResults = totalNegativeResults;
	}

	public Long getTotalPositiveResults() {
		return totalPositiveResults;
	}

	public void setTotalPositiveResults(Long totalPositiveResults) {
		this.totalPositiveResults = totalPositiveResults;
	}

	public Long getTotalIndertermineResults() {
		return totalIndertermineResults;
	}

	public void setTotalIndertermineResults(Long totalIndertermineResults) {
		this.totalIndertermineResults = totalIndertermineResults;
	}

	public Long getTotalHealthOrg() {
		return totalHealthOrg;
	}

	public void setTotalHealthOrg(Long totalHealthOrg) {
		this.totalHealthOrg = totalHealthOrg;
	}

	public Integer getResultSample() {
		return resultSample;
	}

	public void setResultSample(Integer resultSample) {
		this.resultSample = resultSample;
	}

	public Integer getResultPi() {
		return resultPi;
	}

	public void setResultPi(Integer resultPi) {
		this.resultPi = resultPi;
	}

	public String getPercentNegativeResults() {
		return percentNegativeResults;
	}

	public void setPercentNegativeResults(String percentNegativeResults) {
		this.percentNegativeResults = percentNegativeResults;
	}

	public String getPercentPositiveResults() {
		return percentPositiveResults;
	}

	public void setPercentPositiveResults(String percentPositiveResults) {
		this.percentPositiveResults = percentPositiveResults;
	}

	public String getPercentIndertermineResults() {
		return percentIndertermineResults;
	}

	public void setPercentIndertermineResults(String percentIndertermineResults) {
		this.percentIndertermineResults = percentIndertermineResults;
	}

	public Long getTotalResults() {
		return totalResults;
	}

	public void setTotalResults(Long totalResults) {
		this.totalResults = totalResults;
	}

	public Long getTotalNonResults() {
		return totalNonResults;
	}

	public void setTotalNonResults(Long totalNonResults) {
		this.totalNonResults = totalNonResults;
	}

	public Integer getTypeMethod() {
		return typeMethod;
	}

	public void setTypeMethod(Integer typeMethod) {
		this.typeMethod = typeMethod;
	}

	public TestResultDto() {
		super();
	}
	
	public TestResultDto( UUID sampleId, String reagent,
			UUID reagentId,Long totalHealthOrg,String sampleCode,Integer resultSample,Integer typeMethod) {
		this.sampleId = sampleId;
		this.totalHealthOrg = totalHealthOrg;
		this.reagent = reagent;
		this.reagentId = reagentId;
		this.sampleCode = sampleCode;
		this.resultSample = resultSample;
		this.typeMethod = typeMethod;
	}
	
	public TestResultDto( UUID healthOrgId, UUID sampleId, String reagent,
			UUID reagentId,Long totalHealthOrg,String sampleCode) {
		this.healthOrgId = healthOrgId;
		this.sampleId = sampleId;
		this.totalHealthOrg = totalHealthOrg;
		this.reagent = reagent;
		this.reagentId = reagentId;
		this.sampleCode = sampleCode;
		
	}
	
}
