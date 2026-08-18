package com.example.demo.Booking;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class BookingService {
	
	private final BookingRepository bookingRepository;
	
	public BookingService(BookingRepository bookingRepository) {
		this.bookingRepository = bookingRepository;
	}
	
	public List<Booking> getAllBookings() {
		return bookingRepository.findAll();
	}
	
	public Optional<Booking> getBookingById(Long id) {
		return bookingRepository.findById(id);
		
	}

	public List<Booking> getBookingByEmail(String email) {
		return bookingRepository.findByGuestEmail(email);
	}
	
	public List<Booking> getBookingsByOwner(String ownerEmail) {
	    return bookingRepository.findByRoom_Hotel_OwnerEmail(ownerEmail);
	}
	
	public Booking saveBooking(Booking booking) {
		return bookingRepository.save(booking);
	}
	
	public boolean isRoomAvailable(Long RoomId, LocalDate checkIn, LocalDate checkOut) {
	    List<Booking> existingBookings = bookingRepository.findByRoomId(RoomId);

	    for (Booking booking : existingBookings) {
	        if ("CANCELLED".equals(booking.getStatus())) {
	            continue; // cancelled bookings don't block availability
	        }

	        boolean overlaps = checkIn.isBefore(booking.getCheckOutDate())
	                && checkOut.isAfter(booking.getCheckInDate());

	        if (overlaps) {
	            return false;
	        }
	    }

	    return true;
	}
}
