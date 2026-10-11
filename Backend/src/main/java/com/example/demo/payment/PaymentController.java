
package com.example.demo.payment;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createPaymentOrder(
            @RequestBody Map<String, Long> request) {

        try {
            Long bookingId = request.get("bookingId");

            if (bookingId == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "bookingId is required"));
            }

            Map<String, Object> order =
                    paymentService.createOrder(bookingId);

            return ResponseEntity.ok(order);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
        	e.printStackTrace(); 
        	
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Unable to create Razorpay order"
                    ));
        }
    }
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> request) {
        try {
            Long bookingId = Long.valueOf(request.get("bookingId").toString());

            String razorpayOrderId =
                    request.get("razorpay_order_id").toString();

            String razorpayPaymentId =
                    request.get("razorpay_payment_id").toString();

            String razorpaySignature =
                    request.get("razorpay_signature").toString();

            paymentService.verifyPayment(
                    bookingId,
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature
            );

            return ResponseEntity.ok(
                    Map.of("message", "Payment verified successfully")
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Payment verification failed"));
        }
    }
}
