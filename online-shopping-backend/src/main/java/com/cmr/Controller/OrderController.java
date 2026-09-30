package com.cmr.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cmr.Model.Order;
import com.cmr.Service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;


    // PURCHASE PRODUCT

    @PostMapping("/purchase")
    public Map<String, Object> purchase(

            @RequestParam String email,

            @RequestParam Long productId,

            @RequestParam int quantity) {

        return orderService.purchase(
                email,
                productId,
                quantity
        );
    }


    // GET USER ORDERS

    @GetMapping
    public List<Order> getOrders(
            @RequestParam String email) {

        return orderService.getOrders(email);
    }
}
