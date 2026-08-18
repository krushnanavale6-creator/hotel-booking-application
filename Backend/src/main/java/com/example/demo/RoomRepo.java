package com.example.demo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepo extends JpaRepository<Room, Long>{
	List<Room> findByHotel_OwnerEmail(String ownerEmail);

}
