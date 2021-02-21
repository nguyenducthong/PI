package com.globits.PI.functiondto;

import java.util.Date;
import java.util.UUID;
import java.util.List;

public class HealthOrgEQARoundSearchDto extends SearchDto {
	private UUID roundId;
	private UUID planningId;
	private Boolean isRunning;
	private Date currentDate;
	private Integer feeStatus;
	private List<Integer> listStatus;
	private Integer transferStatus;
	private UUID administrativeUnitId;
	private Boolean hasResult;
	private Boolean statusSentResults;
	private Boolean isExportExcel = false;
	private Boolean isViewDetails = false;
	private Boolean hasConclusion;
	private Boolean isCheckPoint = false;
	private Boolean isSampleTransferStatus = false;

	public Boolean getHasResult() {
		return hasResult;
	}

	public void setHasResult(Boolean hasResult) {
		this.hasResult = hasResult;
	}

	public Integer getTransferStatus() {
		return transferStatus;
	}

	public void setTransferStatus(Integer transferStatus) {
		this.transferStatus = transferStatus;
	}

	public UUID getRoundId() {
		return roundId;
	}

	public void setRoundId(UUID roundId) {
		this.roundId = roundId;
	}

	public Boolean getIsRunning() {
		return isRunning;
	}

	public void setIsRunning(Boolean isRunning) {
		this.isRunning = isRunning;
	}

	public Date getCurrentDate() {
		return currentDate;
	}

	public void setCurrentDate(Date currentDate) {
		this.currentDate = currentDate;
	}

	public List<Integer> getListStatus() {
		return listStatus;
	}

	public void setListStatus(List<Integer> listStatus) {
		this.listStatus = listStatus;
	}

	public UUID getAdministrativeUnitId() {
		return administrativeUnitId;
	}

	public void setAdministrativeUnitId(UUID administrativeUnitId) {
		this.administrativeUnitId = administrativeUnitId;
	}

	public UUID getPlanningId() {
		return planningId;
	}

	public void setPlanningId(UUID planningId) {
		this.planningId = planningId;
	}

	public Boolean getIsExportExcel() {
		return isExportExcel;
	}

	public void setIsExportExcel(Boolean isExportExcel) {
		this.isExportExcel = isExportExcel;
	}

	public Boolean getIsViewDetails() {
		return isViewDetails;
	}

	public void setIsViewDetails(Boolean isViewDetails) {
		this.isViewDetails = isViewDetails;
	}

	public Boolean getHasConclusion() {
		return hasConclusion;
	}

	public void setHasConclusion(Boolean hasConclusion) {
		this.hasConclusion = hasConclusion;
	}

	public Integer getFeeStatus() {
		return feeStatus;
	}

	public void setFeeStatus(Integer feeStatus) {
		this.feeStatus = feeStatus;
	}

	public Boolean getIsCheckPoint() {
		return isCheckPoint;
	}

	public void setIsCheckPoint(Boolean isCheckPoint) {
		this.isCheckPoint = isCheckPoint;
	}

	public Boolean getIsSampleTransferStatus() {
		return isSampleTransferStatus;
	}

	public void setIsSampleTransferStatus(Boolean isSampleTransferStatus) {
		this.isSampleTransferStatus = isSampleTransferStatus;
	}

	public Boolean getStatusSentResults() {
		return statusSentResults;
	}

	public void setStatusSentResults(Boolean statusSentResults) {
		this.statusSentResults = statusSentResults;
	}

}
