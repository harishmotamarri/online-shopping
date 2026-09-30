package com.cmr.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmr.Model.Product;

@Service
public class ProductService {

    @Autowired
    com.cmr.Repository.ProductRepository productRepository;

    @Autowired
    com.cmr.Repository.UserRepository userRepository;


    // ADD PRODUCT
    public Map<String, Object> addProduct(com.cmr.Model.Product product) {

        Map<String, Object> response = new HashMap<>();

        com.cmr.Model.Product savedProduct = productRepository.save(product);

        response.put("code", 200);
        response.put("message", "Product added successfully");
        response.put("product", savedProduct);

        return response;
    }


    // GET ALL PRODUCTS
    public List<com.cmr.Model.Product> getProducts() {

        return productRepository.findAll();
    }


    // GET PRODUCT BY ID
    public Map<String, Object> getProduct(Long id) {

        Map<String, Object> response = new HashMap<>();

        com.cmr.Model.Product product =
                productRepository.findById(id).orElse(null);

        if (product == null) {

            response.put("code", 404);
            response.put("message", "Product not found");

            return response;
        }

        response.put("code", 200);
        response.put("product", product);

        return response;
    }


    // UPDATE PRODUCT
    public Map<String, Object> updateProduct(
            Long id, com.cmr.Model.Product product) {

        Map<String, Object> response = new HashMap<>();

        com.cmr.Model.Product existingProduct =
                productRepository.findById(id).orElse(null);

        if (existingProduct == null) {

            response.put("code", 404);
            response.put("message", "Product not found");
        }
        
        else {

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setImageUrl(product.getImageUrl());

        Product updatedProduct =
                productRepository.save(existingProduct);

        response.put("code", 200);
        response.put("message", "Product updated successfully");
        response.put("product", updatedProduct);
        }

        return response;
    }


    // DELETE PRODUCT
    public Map<String, Object> deleteProduct(Long id) {

        Map<String, Object> response = new HashMap<>();

        Product product =
                productRepository.findById(id).orElse(null);

        if (product == null) {

            response.put("code", 404);
            response.put("message", "Product not found");

            return response;
        }

        productRepository.deleteById(id);

        response.put("code", 200);
        response.put("message", "Product deleted successfully");

        return response;
    }
 
}

