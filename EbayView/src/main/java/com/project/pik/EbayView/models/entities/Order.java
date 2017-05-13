package com.project.pik.EbayView.models.entities;

import java.sql.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
@Entity
@Table(name="Orders")
public class Order {
	@Id
	@Column(name = "ORDER_ID", nullable = false, unique = true, length = 11)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID", nullable = false)
	private User user;
	
	@Column(name = "REGISTRATION_DATE", nullable = false)
	private Date date;
	
	@Column(name = "IS_HIRTORY_LOG", nullable = false)
	private boolean isHistoryLog;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "order")
	private Set<Offer> offers = new HashSet<>();

	public Integer getOrderId() {
		return orderId;
	}

	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public boolean isHistoryLog() {
		return isHistoryLog;
	}

	public void setHistoryLog(boolean isHistoryLog) {
		this.isHistoryLog = isHistoryLog;
	}

	public Set<Offer> getOffers() {
		return offers;
	}

	public void setOffers(Set<Offer> offers) {
		this.offers = offers;
	}
	
	
	
}
