package com.cmr.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmr.Model.Product;
import com.cmr.Service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ADD PRODUCT
    @PostMapping
    public Map<String, Object> addProduct(
            @RequestBody Product product) {

        return productService.addProduct(product);
    }

    // GET ALL PRODUCTS
    @GetMapping
    public List<Product> getProducts() {

        return productService.getProducts();
    }

    // GET PRODUCT BY ID
    @GetMapping("/{id}")
    public Map<String, Object> getProduct(
            @PathVariable Long id) {

        return productService.getProduct(id);
    }

    // UPDATE PRODUCT
    @PutMapping("/{id}")
    public Map<String, Object> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        return productService.updateProduct(id, product);
    }

    // DELETE PRODUCT
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteProduct(
            @PathVariable Long id) {

        return productService.deleteProduct(id);
    }

   
    
 
}