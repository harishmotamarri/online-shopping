package com.cmr.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cmr.Model.User;

@Repository

public interface UserRepository extends JpaRepository<User, Long> {

User findByEmail(String email);
}
