package com.example.demo.Booking;

import jakarta.persistence.Entity;

import java.time.LocalDate;

import com.example.demo.Room;


import jakarta.persistence.*;

@Entity
public class Booking {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "room_id")
	private Room room;
	
	private String guestName; // simple for now
	private String guestEmail;
	
	private LocalDate checkInDate;
	private LocalDate checkOutDate;
	private Integer guests;
	
	private Double totalPrice;
	
	private String status = "PENDING";
	private String paymentStatus = "UNPAID";
	private String paymentSessionId;
	//getters and setters
	

    public Long getId(){ 
    	return id;
    	
    }
    public void setId(Long id) {
    	this.id = id;
    	
    }

    public Room getRoom() { 
    	return room; 
    	
    }
    public void setRoom(Room room) { 
    	this.room = room;
    	
    }

    public String getGuestName() {
    	return guestName; 
    	
    }
    public void setGuestName(String guestName) {
    	this.guestName = guestName;
    	
    }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public Integer getGuests() { return guests; }
    public void setGuests(Integer guests) { this.guests = guests; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    public String getPaymentSessionId() {
    	return paymentSessionId;
    }
    public void setPaymentSessionId(String paymentSessionId) {
    	this.paymentSessionId = paymentSessionId;
    }
	
}
