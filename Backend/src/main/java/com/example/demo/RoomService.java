package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class RoomService {

	private final RoomRepo roomRepo;
	
	public RoomService(RoomRepo roomRepo) {
		this.roomRepo = roomRepo;
	}
	
	public List<Room> getAllRooms(){
		return roomRepo.findAll();
	}
	public List<Room> getRoomByOwner(String ownerEmail) {
		return roomRepo.findByHotel_OwnerEmail(ownerEmail);
	}
	
	public Room saveRoom(Room room) {
		return roomRepo.save(room);
	}
	public Optional<Room> getRoomById(Long id) {
	    return roomRepo.findById(id);
	}
	
	public Room updateAvailability(Long roomId, boolean available) {
	    Room room = roomRepo.findById(roomId)
	            .orElseThrow(() -> new RuntimeException("Room not found"));
	    room.setAvailable(available);
	    return roomRepo.save(room);
	}
	public Room updateRoom(Long id, Room updateData, List<String> newImageUrls) {
		Room room = roomRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Room not found"));
		
		room.setRoomType(updateData.getRoomType());
		room.setPricePerNight(updateData.getPricePerNight());
		room.setAmenities(updateData.getAmenities());
		
		if (newImageUrls != null && !newImageUrls.isEmpty()) {
			room.setImages(newImageUrls);
		}
		
		return roomRepo.save(room);
	}
}
