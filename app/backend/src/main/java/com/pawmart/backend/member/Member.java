package com.pawmart.backend.member;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "login_id", nullable = false, unique = true, length = 50)
  private String loginId;

  @Column(name = "password_hash", nullable = false, length = 60)
  private String passwordHash;

  @Column(nullable = false, length = 50)
  private String name;

  @Column(length = 1)
  private String gender;

  @Column(name = "birth_date")
  private LocalDate birthDate;

  @Column(length = 20)
  private String phone;

  @Column(nullable = false, unique = true, length = 100)
  private String email;

  @Column(name = "sms_agreed", nullable = false)
  private boolean smsAgreed;

  @Column(name = "email_agreed", nullable = false)
  private boolean emailAgreed;

  @Column(name = "postal_code", length = 10)
  private String postalCode;

  @Column(name = "road_address")
  private String roadAddress;

  @Column(name = "jibun_address")
  private String jibunAddress;

  @Column(name = "detail_address")
  private String detailAddress;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private MemberRole role = MemberRole.USER;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private MemberStatus status = MemberStatus.ACTIVE;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @Builder
  private Member(
      String loginId,
      String passwordHash,
      String name,
      String email,
      String gender,
      LocalDate birthDate,
      String phone,
      boolean smsAgreed,
      boolean emailAgreed,
      String postalCode,
      String roadAddress,
      String jibunAddress,
      String detailAddress) {
    this.loginId = loginId;
    this.passwordHash = passwordHash;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.birthDate = birthDate;
    this.phone = phone;
    this.smsAgreed = smsAgreed;
    this.emailAgreed = emailAgreed;
    this.postalCode = postalCode;
    this.roadAddress = roadAddress;
    this.jibunAddress = jibunAddress;
    this.detailAddress = detailAddress;
  }

  public void updateProfile(
      String name,
      String phone,
      String gender,
      LocalDate birthDate,
      String postalCode,
      String roadAddress,
      String jibunAddress,
      String detailAddress,
      Boolean smsAgreed,
      Boolean emailAgreed) {
    if (name != null) this.name = name;
    if (phone != null) this.phone = phone;
    if (gender != null) this.gender = gender;
    if (birthDate != null) this.birthDate = birthDate;
    if (postalCode != null) this.postalCode = postalCode;
    if (roadAddress != null) this.roadAddress = roadAddress;
    if (jibunAddress != null) this.jibunAddress = jibunAddress;
    if (detailAddress != null) this.detailAddress = detailAddress;
    if (smsAgreed != null) this.smsAgreed = smsAgreed;
    if (emailAgreed != null) this.emailAgreed = emailAgreed;
  }

  public void withdraw() {
    this.status = MemberStatus.WITHDRAWN;
  }

  public void changePassword(String newPasswordHash) {
    this.passwordHash = newPasswordHash;
  }
}
