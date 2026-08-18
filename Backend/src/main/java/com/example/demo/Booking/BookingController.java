package com.example.demo.Booking;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class BookingController {

	private final BookingService bookingService;
	
	public BookingController (BookingService bookingService) {
		this.bookingService = bookingService;
	}
	
	@GetMapping("/bookings")
	public List<Booking> getAllBookings() {
		return bookingService.getAllBookings();
	}
	
	@GetMapping("/bookings/{id}")
	public ResponseEntity<Booking> getBookingsById(@PathVariable Long id) {
		return bookingService.getBookingById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
	
	@GetMapping("bookings/user/{email}")
	public List<Booking> getBookingsByEmail(@PathVariable String email ) {
		return bookingService.getBookingByEmail(email);
	}
	
	@GetMapping("/bookings/owner/{email}")
	public List<Booking> getBookingsByOwner(@PathVariable String email) {
	    return bookingService.getBookingsByOwner(email);
	}
	
	@GetMapping("/bookings/check-availability")
	public ResponseEntity<Map<String, Boolean>> checkAvailability(
			@RequestParam Long roomId,
	        @RequestParam String checkIn,
	        @RequestParam String checkOut) {

	    boolean available = bookingService.isRoomAvailable(
	            roomId, LocalDate.parse(checkIn), LocalDate.parse(checkOut));

	    return ResponseEntity.ok(Map.of("available", available));
	}
	
	
	@PostMapping("/bookings")
    public Booking saveBooking(@RequestBody Booking booking) {
        return bookingService.saveBooking(booking);
    }
}
