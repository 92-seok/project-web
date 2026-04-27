package com.pawmart.backend.upload;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;

@Service
public class FileStorageService {

  private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

  private static final Set<String> ALLOWED_CONTENT_TYPES =
      Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
  private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");

  private final Path rootDir;
  private final String publicPrefix;

  public FileStorageService(
      @Value("${app.upload.dir}") String uploadDir,
      @Value("${app.upload.public-prefix}") String publicPrefix) {
    this.rootDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    this.publicPrefix =
        publicPrefix.endsWith("/")
            ? publicPrefix.substring(0, publicPrefix.length() - 1)
            : publicPrefix;
    try {
      Files.createDirectories(this.rootDir);
      log.info("[Upload] 저장 디렉토리: {}", this.rootDir);
    } catch (IOException e) {
      throw new IllegalStateException("업로드 디렉토리를 생성할 수 없습니다: " + this.rootDir, e);
    }
  }

  /**
   * 이미지 저장 후 외부 노출용 URL(/uploads/{filename}) 반환. 프론트는 이 URL을 그대로 DB에 저장하면 되고, 클라이언트는 동일 origin으로
   * GET 가능.
   */
  public String storeImage(MultipartFile file, String subDir) {
    if (file == null || file.isEmpty()) {
      throw new BusinessException(ErrorCode.EMPTY_FILE);
    }
    String contentType = file.getContentType();
    if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
      throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
    }

    String ext = getExtension(file.getOriginalFilename());
    if (!ALLOWED_EXTENSIONS.contains(ext)) {
      throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
    }

    String filename = UUID.randomUUID() + "." + ext;
    Path targetDir = subDir == null || subDir.isBlank() ? rootDir : rootDir.resolve(subDir);
    Path target = targetDir.resolve(filename).normalize();

    // path traversal 방지: target이 rootDir 하위인지 검증
    if (!target.startsWith(rootDir)) {
      throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
    }

    try {
      Files.createDirectories(targetDir);
      file.transferTo(target.toFile());
    } catch (IOException e) {
      log.error("[Upload] 파일 저장 실패", e);
      throw new BusinessException(ErrorCode.FILE_STORAGE_ERROR);
    }

    String publicPath =
        subDir == null || subDir.isBlank()
            ? publicPrefix + "/" + filename
            : publicPrefix + "/" + subDir + "/" + filename;
    log.info("[Upload] 저장 완료: {}", publicPath);
    return publicPath;
  }

  private String getExtension(String filename) {
    if (filename == null) return "";
    int dot = filename.lastIndexOf('.');
    if (dot < 0 || dot == filename.length() - 1) return "";
    return filename.substring(dot + 1).toLowerCase();
  }
}
