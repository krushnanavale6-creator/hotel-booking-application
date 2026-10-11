package com.example.demo.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface BookingRepository extends JpaRepository<Booking, Long>{
	List<Booking> findByGuestEmail(String guestEmail);
	List<Booking> findByRoomId(Long roomId);
	
	List<Booking> findByRoom_Hotel_OwnerEmail(String ownerEmail);
	
	Optional<Booking> findByPaymentSessionId(String paymentSessionId) ;
}
