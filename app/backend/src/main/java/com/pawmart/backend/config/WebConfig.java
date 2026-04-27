package com.pawmart.backend.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 업로드된 이미지를 외부에서 GET 으로 받을 수 있도록 정적 리소스 핸들러 등록. URL: GET {publicPrefix}/{filename} → 파일시스템:
 * {uploadDir}/{filename}
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Value("${app.upload.dir}")
  private String uploadDir;

  @Value("${app.upload.public-prefix}")
  private String publicPrefix;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String pattern = (publicPrefix.endsWith("/") ? publicPrefix : publicPrefix + "/") + "**";
    String location = "file:" + Paths.get(uploadDir).toAbsolutePath().normalize() + "/";
    registry.addResourceHandler(pattern).addResourceLocations(location);
  }
}
