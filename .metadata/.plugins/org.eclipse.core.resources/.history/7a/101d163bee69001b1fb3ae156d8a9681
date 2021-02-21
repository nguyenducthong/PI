package com.globits.PI.domain;

import com.globits.core.domain.BaseObject;

import java.util.Set;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "tbl_eqa_serum_bottle")
@XmlRootElement
public class EQASerumBottle extends BaseObject {

    private static final long serialVersionUID = -5100199485809565238L;
    @Column(name="code")
    private String code;
    
    @Column(name="note")
    private String note;

    @Column(name="hiv_status")//Tình trạng nhiễm HIV, âm tính hay dương tính, giá trị: PIConst.SampleStatus
	private int hivStatus;

    //Chât lượng ống
    @Column(name="bottle_quality")
    private String bottleQuality;

    //Thể tích ống chia
    @Column(name="bottle_volume")
    private Double bottleVolume;

    //Vị trí lưu mẫu
    @Column(name = "local_save_bottle")
    private Integer localSaveBottle;
    
    //Tình trạng ống chia còn hay hết
    @Column(name = "result_bottle")
    private Boolean resultBottle;
    
    //Tình trạng sử dụng ống chia.
    @Column(name = "bottle_status")
    private Boolean bottleStatus;
    
    //Ngân hàng huyết thanh
    @ManyToOne(fetch = FetchType.EAGER, cascade=CascadeType.PERSIST)
    @JoinColumn(name = "eqa_serum_bank_id")
    private EQASerumBank eqaSerumBank;
    
	//1 bottle có thể dùng trong nhiều sample
//	@OneToMany(fetch = FetchType.EAGER)
//	@JoinColumn(name = "eqa_sample_bottle_id")
//	private Set<EQASampleBottle> eqaSampleBottle;	
	
	@OneToMany(mappedBy = "eQASerumBottle", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("code ASC")
	private Set<EQASampleBottle> eqaSampleBottle;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getBottleQuality() {
        return bottleQuality;
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

    public EQASerumBank getEqaSerumBank() {
        return eqaSerumBank;
    }

    public void setEqaSerumBank(EQASerumBank eqaSerumBank) {
        this.eqaSerumBank = eqaSerumBank;
    }

    public int getHivStatus() {
		return hivStatus;
	}

	public void setHivStatus(int hivStatus) {
		this.hivStatus = hivStatus;
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

	public EQASerumBottle() {
        super();
    }
}
