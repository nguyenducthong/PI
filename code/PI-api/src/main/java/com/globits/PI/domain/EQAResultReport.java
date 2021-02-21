package com.globits.PI.domain;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;

@Entity
@Table(name = "tbl_eqa_result_report")
@XmlRootElement
public class EQAResultReport extends BaseObject {
	private static final long serialVersionUID = -5100199485809565238L;
	
	//giá trị trong  PIConst.EQAResultReportTypeMethod
	//Elisa(1),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Elisa
	//FastTest(2),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Xét Nghiệm Nhanh
	//SERODIA(3)//Kết Quả Xét Nghiệm Bằng Kỹ Thuật SERODIA
	//ECL(4)//Điện hóa phát quang
	//Conclusion(5) //Kết luận
	@Column(name="type_method")
	private Integer typeMethod;//Loại báo cáo kết quả 
	
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "reagent_id")//Sinh phẩm sử dụng
	//@NotFound(action = NotFoundAction.IGNORE)
	private Reagent reagent;
	
	@Column(name="supply_of_reagent")//Nguồn cung cấp sinh phẩm
	private String supplyOfReagent;
	
	@Column(name="person_buy_reagent")//Người mua sinh phẩm
	private String personBuyReagent; 
	
	@Column(name="reagent_lot")//Số lô sinh phẩm
	private String reagentLot;
	
	@Column(name="reagent_expiry_date")//Hạn sử dụng sinh phẩm
	private Date reagentExpiryDate;
	
	@Column(name="order_test")//Thứ tự xét nghiệm
	private String orderTest;
	
	@Column(name="test_date")//Ngày xét nghiệm
	private Date testDate; 
	
	@Column(name="date_submit_results")//Nộp kết quả cuối cùng
	private Date dateSubmitResults;
	
	@Column(name="reagent_used_date")//Ngày mở hộp sinh phẩm
	private Date reagentUnBoxDate;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "health_org_round_id")//Phòng xét nghiệm thực hiện
	private HealthOrgEQARound healthOrgRound;
	
	@Column(name="note")
	private String note;//Ghi chú
	
	@OneToMany(mappedBy = "resultReport", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("orderNumber ASC")
	private Set<EQAResultReportDetail> details;//Danh sách chi tiết kết quả các mẫu
	
	@Column(name="is_final_result")//Có phải kết quả cuối cùng
	private Boolean isFinalResult ;

	public Reagent getReagent() {
		return reagent;
	}

	public void setReagent(Reagent reagent) {
		this.reagent = reagent;
	}

	public String getReagentLot() {
		return reagentLot;
	}

	public void setReagentLot(String reagentLot) {
		this.reagentLot = reagentLot;
	}

	public Date getReagentExpiryDate() {
		return reagentExpiryDate;
	}

	public void setReagentExpiryDate(Date reagentExpiryDate) {
		this.reagentExpiryDate = reagentExpiryDate;
	}

	public Date getReagentUnBoxDate() {
		return reagentUnBoxDate;
	}

	public void setReagentUnBoxDate(Date reagentUnBoxDate) {
		this.reagentUnBoxDate = reagentUnBoxDate;
	}

	public HealthOrgEQARound getHealthOrgRound() {
		return healthOrgRound;
	}

	public void setHealthOrgRound(HealthOrgEQARound healthOrgRound) {
		this.healthOrgRound = healthOrgRound;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public Set<EQAResultReportDetail> getDetails() {
		return details;
	}

	public void setDetails(Set<EQAResultReportDetail> details) {
		this.details = details;
	}

	public String getSupplyOfReagent() {
		return supplyOfReagent;
	}

	public void setSupplyOfReagent(String supplyOfReagent) {
		this.supplyOfReagent = supplyOfReagent;
	}

	public String getPersonBuyReagent() {
		return personBuyReagent;
	}

	public void setPersonBuyReagent(String personBuyReagent) {
		this.personBuyReagent = personBuyReagent;
	}

	public String getOrderTest() {
		return orderTest;
	}

	public void setOrderTest(String orderTest) {
		this.orderTest = orderTest;
	}

	public Date getTestDate() {
		return testDate;
	}

	public void setTestDate(Date testDate) {
		this.testDate = testDate;
	}

	public Integer getTypeMethod() {
		return typeMethod;
	}

	public void setTypeMethod(Integer typeMethod) {
		this.typeMethod = typeMethod;
	}

	public Boolean getIsFinalResult() {
		return isFinalResult;
	}

	public void setIsFinalResult(Boolean isFinalResult) {
		this.isFinalResult = isFinalResult;
	}

	public Date getDateSubmitResults() {
		return dateSubmitResults;
	}

	public void setDateSubmitResults(Date dateSubmitResults) {
		this.dateSubmitResults = dateSubmitResults;
	}


	public EQAResultReport() {
		super();
	}
}
