package com.example.demo;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotels")
//@CrossOrigin(origins = "http://localhost:5174")--corsconfig class added
public class HotelController {

	private final HotelService hotelService;
	
	public HotelController(HotelService hotelService) {
		this.hotelService = hotelService;
	}
	
	@GetMapping
	public List<Hotel> getAllHotels() {
		return hotelService.getAllHotels();
	}
	
	@GetMapping("/owner/{email}")
	public List<Hotel> getHotelsByOwner(@PathVariable String email) {
		return hotelService.getHotelsByOwner(email);
	}
	
	@PostMapping
	public Hotel saveHotel(@RequestBody Hotel hotel) {
		return hotelService.saveHotel(hotel);
	}
}
