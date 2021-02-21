package com.globits.PI.dto;

import com.globits.PI.domain.EQASerumBottle;
import com.globits.core.dto.BaseObjectDto;

public class EQASerumBottleDto extends BaseObjectDto{
	 private String code;
	    private String note;
	    private int hivStatus;
	    private String bottleQuality;
	    private Double bottleVolume;
	    private Integer localSaveBottle;
	    private Boolean resultBottle;
	    private Boolean bottleStatus;
	    private String serumCode;
		private EQASerumBankDto eqaSerumBank;
		private Boolean isManualSetCode=false; // cho phép nhập tay. mã code
	    public String getCode() {
	        return code;
	    }

	    public void setCode(String code) {
	        this.code = code;
	    }

	    public String getBottleQuality() {
	        return bottleQuality;
	    }

	    public int getHivStatus() {
			return hivStatus;
		}

		public void setHivStatus(int hivStatus) {
			this.hivStatus = hivStatus;
		}

		public void setBottleQuality(String bottleQuality) {
	        this.bottleQuality = bottleQuality;
	    }

	    public Double getBottleVolume() {
	        return bottleVolume;
	    }

	    public void setBottleVolume(Double bottleVolume) {
	        this.bottleVolume = bottleVolume;
	    }

	    public Integer getLocalSaveBottle() {
	        return localSaveBottle;
	    }

	    public void setLocalSaveBottle(Integer localSaveBottle) {
	        this.localSaveBottle = localSaveBottle;
	    }

	    public EQASerumBankDto getEqaSerumBank() {
	        return eqaSerumBank;
	    }

	    public void setEqaSerumBank(EQASerumBankDto eqaSerumBank) {
	        this.eqaSerumBank = eqaSerumBank;
	    }
	    public String getSerumCode() {
			return serumCode;
		}

		public void setSerumCode(String serumCode) {
			this.serumCode = serumCode;
		}

	    public String getNote() {
			return note;
		}

		public void setNote(String note) {
			this.note = note;
		}

		public Boolean getResultBottle() {
			return resultBottle;
		}

		public void setResultBottle(Boolean resultBottle) {
			this.resultBottle = resultBottle;
		}

		public Boolean getBottleStatus() {
			return bottleStatus;
		}

		public void setBottleStatus(Boolean bottleStatus) {
			this.bottleStatus = bottleStatus;
		}

		public Boolean getIsManualSetCode() {
			return isManualSetCode;
		}

		public void setIsManualSetCode(Boolean isManualSetCode) {
			this.isManualSetCode = isManualSetCode;
		}

		public EQASerumBottleDto() {
	    }

	    public EQASerumBottleDto(EQASerumBottle entity, boolean simple) {
	        if (entity != null){
	        	if(!simple) {
	        		this.id = entity.getId();
	                this.code = entity.getCode();
	                this.note = entity.getNote();
	                this.hivStatus = entity.getHivStatus();
	                this.bottleQuality = entity.getBottleQuality();
	                this.bottleVolume = entity.getBottleVolume();
	                this.resultBottle = entity.getResultBottle();
	                this.localSaveBottle = entity.getLocalSaveBottle();
	                this.bottleStatus = entity.getBottleStatus();
	                if (entity.getEqaSerumBank() != null) {
	                    this.eqaSerumBank = new EQASerumBankDto(entity.getEqaSerumBank(), false);
	                    this.serumCode = entity.getEqaSerumBank().getSerumCode();
	                }
	                
	        	}
	        	else {
	        		this.id = entity.getId();
	                this.code = entity.getCode();
	                this.note = entity.getNote();
	                this.hivStatus = entity.getHivStatus();
	                this.bottleQuality = entity.getBottleQuality();
	                this.bottleVolume = entity.getBottleVolume();
	                this.localSaveBottle = entity.getLocalSaveBottle();
	                this.resultBottle = entity.getResultBottle();
	                this.bottleStatus = entity.getBottleStatus();
	                if (entity.getEqaSerumBank() != null) {
	                    this.serumCode = entity.getEqaSerumBank().getSerumCode();
	                }
	        	}            
	        }
	    }

	    public EQASerumBottleDto(EQASerumBottle entity) {
	        if (entity != null){
	            this.id = entity.getId();
	            this.code = entity.getCode();
	            this.note = entity.getNote();
	            this.hivStatus = entity.getHivStatus();
	            this.bottleQuality = entity.getBottleQuality();
	            this.bottleVolume = entity.getBottleVolume();
	            this.localSaveBottle = entity.getLocalSaveBottle();
	            this.resultBottle = entity.getResultBottle();
	            this.bottleStatus = entity.getBottleStatus();
	            if (entity.getEqaSerumBank() != null) {
	                this.eqaSerumBank = new EQASerumBankDto(entity.getEqaSerumBank(),true);
	                this.serumCode = entity.getEqaSerumBank().getSerumCode();
	            }
	        }

	    }
}
