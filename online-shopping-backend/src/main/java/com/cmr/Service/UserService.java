package com.cmr.Service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

         @Autowired
        com.cmr.Repository.UserRepository repo;

        public Object signupservice(com.cmr.Model.User u) {

            Map<String, Object> response = new HashMap<>();

            com.cmr.Model.User user = repo.findByEmail(u.getEmail());

            if (user != null) {

                response.put("code", 501);
                response.put("message", "Email already exists");

            } else {

                u.setRole("user");

                repo.save(u);

                response.put("code", 200);
                response.put("message", "Signup successful");
            }

            return response;
        }
        
    public Object signinservice(com.cmr.Model.User u) {

        Map<String, Object> response = new HashMap<>();

        com.cmr.Model.User user = repo.findByEmail(u.getEmail());

        if (user == null ||
            !user.getPassword().equals(u.getPassword())) {

            response.put("code", 501);
            response.put("message", "Authentication Failed");

        } else {

            response.put("code", 200);
            response.put("message", "Authentication successful");
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
        }

        return response;
    }
}
