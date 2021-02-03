package com.globits.PI.domain;


import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.globits.core.domain.BaseObject;
import com.globits.security.domain.User;
/**
 * Người dùng trong đơn vị
 */
@Entity
@Table(name = "tbl_user_in_health_org")
@XmlRootElement
public class UserInHealthOrg extends BaseObject {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@ManyToOne( optional = true, fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", unique = false)
	private User user;
	
	@ManyToOne( optional = true, fetch = FetchType.EAGER)
	@JoinColumn(name = "health_org_id", unique = false)
	private HealthOrg healthOrg;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public HealthOrg getHealthOrg() {
		return healthOrg;
	}

	public void setHealthOrg(HealthOrg healthOrg) {
		this.healthOrg = healthOrg;
	}

	
}
