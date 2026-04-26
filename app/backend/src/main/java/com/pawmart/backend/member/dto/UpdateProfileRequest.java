package com.pawmart.backend.member.dto;

import java.time.LocalDate;

public record UpdateProfileRequest(
    String name,
    String phone,
    String gender,
    LocalDate birthDate,
    String postalCode,
    String roadAddress,
    String jibunAddress,
    String detailAddress,
    Boolean smsAgreed,
    Boolean emailAgreed) {}
