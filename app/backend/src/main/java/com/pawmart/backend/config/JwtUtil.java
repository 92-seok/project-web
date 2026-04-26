package com.pawmart.backend.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.pawmart.backend.member.MemberRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

  private final SecretKey key;
  private final long accessTokenExpiry;
  private final long refreshTokenExpiry;

  public JwtUtil(
      @Value("${jwt.secret}") String secret,
      @Value("${jwt.access-token-expiry}") long accessTokenExpiry,
      @Value("${jwt.refresh-token-expiry}") long refreshTokenExpiry) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessTokenExpiry = accessTokenExpiry;
    this.refreshTokenExpiry = refreshTokenExpiry;
  }

  public String generateAccessToken(Long memberId, String loginId, String name, MemberRole role) {
    Date now = new Date();
    return Jwts.builder()
        .subject(String.valueOf(memberId))
        .claim("loginId", loginId)
        .claim("name", name)
        .claim("role", role.name())
        .issuedAt(now)
        .expiration(new Date(now.getTime() + accessTokenExpiry))
        .signWith(key)
        .compact();
  }

  public String generateRefreshToken(Long memberId) {
    Date now = new Date();
    return Jwts.builder()
        .subject(String.valueOf(memberId))
        .issuedAt(now)
        .expiration(new Date(now.getTime() + refreshTokenExpiry))
        .signWith(key)
        .compact();
  }

  public Claims parseClaims(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
  }

  public boolean isExpired(String token) {
    try {
      parseClaims(token);
      return false;
    } catch (ExpiredJwtException e) {
      return true;
    }
  }

  public boolean isValid(String token) {
    try {
      parseClaims(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public Long getMemberId(Claims claims) {
    return Long.valueOf(claims.getSubject());
  }

  public String getLoginId(Claims claims) {
    return claims.get("loginId", String.class);
  }

  public String getName(Claims claims) {
    return claims.get("name", String.class);
  }

  public MemberRole getRole(Claims claims) {
    return MemberRole.valueOf(claims.get("role", String.class));
  }
}
