package com.vti.dto;

import lombok.Data;

@Data
public class ChangePublicProfileDTO {

	// TODO validate
	private String email;
	
	private String username;
	
	private String firstName;
	
	private String lastName;

	public ChangePublicProfileDTO() {
	}
	
}
