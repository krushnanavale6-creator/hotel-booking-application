package com.example.demo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepo extends JpaRepository<Hotel, Long>{
	List<Hotel> findByOwnerEmail(String ownerEmail);

}
