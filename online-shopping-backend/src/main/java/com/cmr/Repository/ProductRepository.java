package com.cmr.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cmr.Model.Product;

@Repository

public interface ProductRepository extends JpaRepository<Product, Long> {
}
