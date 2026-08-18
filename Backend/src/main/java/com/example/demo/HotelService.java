package com.example.demo;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Hotel;
import com.example.demo.HotelRepo;

@Service
public class HotelService {

    private final HotelRepo hotelRepository;

    public HotelService(HotelRepo hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }
    
    public List<Hotel> getHotelsByOwner(String ownerEmail) {
        return hotelRepository.findByOwnerEmail(ownerEmail);
    }

    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }
}