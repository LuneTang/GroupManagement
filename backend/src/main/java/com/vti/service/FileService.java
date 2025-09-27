package com.vti.service;

import java.io.IOException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vti.entity.User;
import com.vti.repository.UserRepository;
import com.vti.utils.FileManager;

@Service
public class FileService implements IFileService {

	@Autowired
	private UserRepository userRepository;
	
	private FileManager fileManager = new FileManager();
	private String linkFolder = "D:\\React-TypeScript-Exercises\\ManageDepartmentAndAccountSystem\\frontend\\public\\Avatars";

	@Override
	public String uploadImage(MultipartFile image, Authentication authentication) throws IOException {

		String nameImage = new Date().getTime() + "." + fileManager.getFormatFile(image.getOriginalFilename());

		String path = linkFolder + "\\" + nameImage;

		fileManager.createNewMultiPartFile(path, image);

		User user = userRepository.findByUserName(authentication.getName());
        if (user != null) {
            user.setAvatarUrl(nameImage);
            userRepository.save(user);
            return nameImage;
        }
        return null;
	}
}
