package com.cmr.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmr.Model.Order;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    @Autowired
    private com.cmr.Repository.OrderRepository orderRepository;

    @Autowired
    private com.cmr.Repository.ProductRepository productRepository;

    @Autowired
    private com.cmr.Repository.UserRepository userRepository;


    // PURCHASE PRODUCT

    @Transactional
    public Map<String, Object> purchase(
            String email,
            Long productId,
            int quantity) {

        Map<String, Object> response =
                new HashMap<>();


        // 1. Find user

        com.cmr.Model.User user =
                userRepository.findByEmail(email);

        if (user == null) {

            response.put("code", 404);
            response.put("message",
                    "User not found");

            return response;
        }


        // 2. Check role

        if (!user.getRole().equals("user")) {

            response.put("code", 403);
            response.put("message",
                    "Only users can purchase");

            return response;
        }


        // 3. Check quantity

        if (quantity <= 0) {

            response.put("code", 400);
            response.put("message",
                    "Invalid quantity");

            return response;
        }


        // 4. Find product

        com.cmr.Model.Product product =
                productRepository
                .findById(productId)
                .orElse(null);

        if (product == null) {

            response.put("code", 404);
            response.put("message",
                    "Product not found");

            return response;
        }


        // 5. Check stock

        if (product.getQuantity() < quantity) {

            response.put("code", 400);
            response.put("message",
                    "Insufficient stock");

            return response;
        }


        // 6. Reduce product quantity

        product.setQuantity(
                product.getQuantity() - quantity
        );

        productRepository.save(product);


        // 7. Create order object

        com.cmr.Model.Order order = new Order();

        order.setEmail(email);

        order.setProductId(
                product.getId()
        );

        order.setProductName(
                product.getName()
        );

        order.setPrice(
                product.getPrice()
        );

        order.setQuantity(quantity);
        
        order.setOrderDateTime(LocalDateTime.now());


        // 8. Save order

        orderRepository.save(order);


        // 9. Send response

        response.put("code", 200);

        response.put("message",
                "Product purchased successfully");


        return response;
    }


    // GET ORDERS OF USER

    public List<com.cmr.Model.Order> getOrders(String email) {

        return orderRepository.findByEmail(email);
    }
}
