package com.cmr.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmr.Model.User;
import com.cmr.Service.UserService;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	 @Autowired
	 UserService userService;


	 @PostMapping("/signup")
	 public Object signup(@RequestBody User u) {
	     return userService.signupservice(u);
	 }

	 @PostMapping("/signin")
	 public Object signin(@RequestBody User u) {
	     return userService.signinservice(u);
	 }

}
