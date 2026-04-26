package com.pawmart.backend.config;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pawmart.backend.member.MemberRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String token = resolveToken(request);

    if (StringUtils.hasText(token)) {
      try {
        Claims claims = jwtUtil.parseClaims(token);
        Long memberId = jwtUtil.getMemberId(claims);
        String loginId = jwtUtil.getLoginId(claims);
        String name = jwtUtil.getName(claims);
        MemberRole role = jwtUtil.getRole(claims);

        JwtPrincipal principal = new JwtPrincipal(memberId, loginId, name, role);
        UsernamePasswordAuthenticationToken auth =
            new UsernamePasswordAuthenticationToken(
                principal, null, List.of(new SimpleGrantedAuthority("ROLE_" + role.name())));
        SecurityContextHolder.getContext().setAuthentication(auth);

      } catch (JwtException | IllegalArgumentException ignored) {
        // 유효하지 않은 토큰은 SecurityContextHolder를 비워두고 체인 통과
        // 보호된 엔드포인트는 SecurityConfig의 .authenticated() 설정이 401 반환
      }
    }

    filterChain.doFilter(request, response);
  }

  private String resolveToken(HttpServletRequest request) {
    String bearer = request.getHeader("Authorization");
    if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
      return bearer.substring(7);
    }
    return null;
  }
}
