
package com.example.demo.payment;

import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.Booking.Booking;
import com.example.demo.Booking.BookingRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.Map;


@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final BookingRepository bookingRepository;

    public PaymentService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Map<String, Object> createOrder(Long bookingId) throws Exception {

        Optional<Booking> optionalBooking =
                bookingRepository.findById(bookingId);

        if (optionalBooking.isEmpty()) {
            throw new IllegalArgumentException("Booking not found");
        }

        Booking booking = optionalBooking.get();

        if ("PAID".equals(booking.getPaymentStatus())) {
            throw new IllegalStateException("Booking is already paid");
        }

        if (booking.getRoom() == null
                || booking.getCheckInDate() == null
                || booking.getCheckOutDate() == null) {
            throw new IllegalStateException("Booking details are incomplete");
        }

        long nights = ChronoUnit.DAYS.between(
                booking.getCheckInDate(),
                booking.getCheckOutDate());

        if (nights <= 0) {
            throw new IllegalStateException("Invalid booking dates");
        }

        double totalAmount =
                booking.getRoom().getPricePerNight() * nights;

        if (!Double.isFinite(totalAmount) || totalAmount <= 0) {
            throw new IllegalStateException("Invalid booking amount");
        }

        long amountInPaise = Math.round(totalAmount * 100);

        RazorpayClient razorpayClient =
                new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + booking.getId());

        Order order = razorpayClient.orders.create(orderRequest);
        
        booking.setRazorpayOrderId(order.get("id"));
        bookingRepository.save(booking);
        
        Map<String, Object> result = new HashMap<>();
        result.put("keyId", razorpayKeyId);
        result.put("orderId", order.get("id"));
        result.put("amount", order.get("amount"));
        result.put("currency", order.get("currency"));
        result.put("bookingId", booking.getId());

        return result;
    }
    public boolean verifyPayment(
            Long bookingId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) throws Exception {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (razorpayOrderId == null
                || razorpayPaymentId == null
                || razorpaySignature == null) {
            throw new IllegalArgumentException("Payment details are required");
        }

        if (!razorpayOrderId.equals(booking.getRazorpayOrderId())) {
            throw new IllegalArgumentException("Order does not belong to this booking");
        }

        String payload = razorpayOrderId + "|" + razorpayPaymentId;

        javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
        mac.init(new javax.crypto.spec.SecretKeySpec(
                razorpayKeySecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"));

        byte[] expectedBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        StringBuilder expectedSignature = new StringBuilder();

        for (byte b : expectedBytes) {
            expectedSignature.append(String.format("%02x", b & 0xff));
        }

        boolean valid = MessageDigest.isEqual(
                expectedSignature.toString().getBytes(StandardCharsets.UTF_8),
                razorpaySignature.getBytes(StandardCharsets.UTF_8));

        if (!valid) {
            throw new IllegalArgumentException("Invalid payment signature");
        }

        // Signature is valid, but payment capture/status must also be confirmed.
        com.razorpay.RazorpayClient client =
                new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);

        com.razorpay.Payment payment = client.payments.fetch(razorpayPaymentId);

        if (!razorpayOrderId.equals(payment.get("order_id"))) {
            throw new IllegalArgumentException("Payment order mismatch");
        }

        String paymentStatus = payment.get("status");

        if (!"captured".equals(paymentStatus)) {
            throw new IllegalStateException(
                    "Payment is not captured yet. Current status: " + paymentStatus);
        }

        booking.setPaymentStatus("PAID");
        bookingRepository.save(booking);

        return true;
    }
}
