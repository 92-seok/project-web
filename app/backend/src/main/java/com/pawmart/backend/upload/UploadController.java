package com.pawmart.backend.upload;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

/**
 * 인증된 사용자만 호출 가능. SecurityConfig anyRequest().authenticated() 에 걸림. subDir 로 'pet', 'review' 등을 명시해
 * 디렉토리 분리.
 */
@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

  private final FileStorageService fileStorageService;

  @PostMapping(value = "/image")
  public Map<String, String> uploadImage(
      @RequestParam("file") MultipartFile file,
      @RequestParam(value = "subDir", required = false) String subDir) {
    String url = fileStorageService.storeImage(file, subDir);
    return Map.of("url", url);
  }
}
