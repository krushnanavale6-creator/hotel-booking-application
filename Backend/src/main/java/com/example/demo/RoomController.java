package com.example.demo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.S3ServiceClientConfiguration;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
@RestController
@RequestMapping("/api")


//@CrossOrigin(origins = "http://localhost:5173")

		

public class RoomController {

	private final S3service s3Service;
	private final RoomService roomService;
	
	
	public RoomController(RoomService roomService, S3service s3Service) {
		this.roomService = roomService;
		this.s3Service = s3Service;
	}
	
	@GetMapping("/rooms")
	public List<Room> getALlRooms(){
		return roomService.getAllRooms();
		
	}
	@GetMapping("/rooms/{id}")
	public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
		return roomService.getRoomById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
	@GetMapping("/rooms/owner/{email}")
	public List<Room> getRoomsByOwner(@PathVariable String email) {
	    return roomService.getRoomByOwner(email);
	}
	
	@PostMapping("/rooms")
	public Room saveRoom(@RequestBody Room room) {
		return roomService.saveRoom(room);
	}
	
	@PatchMapping("/rooms/{id}/availability")
	public Room updateAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
	    return roomService.updateAvailability(id, body.get("available"));
	}
	
	@PostMapping(value = "/rooms/with-images", consumes = "multipart/form-data")
	public Room saveRoomWithImages(
	        @RequestPart("room") Room room,
	        @RequestPart(value = "images", required = false) List<MultipartFile> images) {

	    if (images != null) {
	        List<String> imageUrls = new ArrayList<>();
	        for (MultipartFile image : images) {
	            String url = s3Service.uploadFile(image);
	            imageUrls.add(url);
	        }
	        room.setImages(imageUrls);
	    }

	    return roomService.saveRoom(room);
	}
	@PutMapping(value = "/rooms/{id}", consumes = "multipart/form-data")
	public Room updateRoom(
			@PathVariable Long id,
			@RequestPart("room") Room room,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		List<String> imageUrls = null;
		
		if (images != null && !images.isEmpty()) {
			imageUrls = new ArrayList<>();
			for (MultipartFile image : images) {
				imageUrls.add(s3Service.uploadFile(image));
			}
		}
		
		return roomService.updateRoom(id, room, imageUrls);
	}
}
