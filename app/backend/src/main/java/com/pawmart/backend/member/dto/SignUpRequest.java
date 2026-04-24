package com.pawmart.backend.member.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignUpRequest(
    @NotBlank @Size(min = 4, max = 20) @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "아이디는 영문·숫자·언더스코어만 사용할 수 있습니다.") String loginId,
    @NotBlank @Size(min = 8, max = 30) String password,
    @NotBlank @Size(max = 50) String name,
    @NotBlank @Email @Size(max = 100) String email,
    @Pattern(regexp = "^[MF]?$", message = "성별은 M 또는 F만 허용됩니다.") String gender,
    LocalDate birthDate,
    @Pattern(regexp = "^[0-9-]{0,20}$", message = "전화번호 형식이 올바르지 않습니다.") String phone,
    Boolean smsAgreed,
    Boolean emailAgreed,
    @Size(max = 10) String postalCode,
    @Size(max = 255) String roadAddress,
    @Size(max = 255) String jibunAddress,
    @Size(max = 255) String detailAddress) {}
