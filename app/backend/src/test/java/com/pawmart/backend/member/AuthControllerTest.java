package com.pawmart.backend.member;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.common.exception.GlobalExceptionHandler;
import com.pawmart.backend.config.SecurityConfig;
import com.pawmart.backend.member.dto.LoginRequest;
import com.pawmart.backend.member.dto.LoginResponse;
import com.pawmart.backend.member.dto.SignUpRequest;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class AuthControllerTest {

  @Autowired private MockMvc mockMvc;

  // Boot 4 의 @WebMvcTest 슬라이스에는 JacksonAutoConfiguration 이 기본 포함되지 않아
  // ObjectMapper 빈이 없다. 테스트 내부에서 직접 생성하여 컨텍스트 의존을 피한다.
  private final ObjectMapper objectMapper = new ObjectMapper();

  @MockitoBean private MemberService memberService;

  // ─── 회원가입 ─────────────────────────────────────────────

  @Test
  void signUp_success_returns201AndMemberId() throws Exception {
    given(memberService.signUp(any(SignUpRequest.class))).willReturn(42L);

    mockMvc
        .perform(
            post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleSignUpRequest())))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.memberId").value(42));
  }

  @Test
  void signUp_validationFailure_returns400WithFieldErrors() throws Exception {
    // password 가 8자 미만 → @Size(min=8) 위반 → GlobalExceptionHandler 의 Bind 핸들러가 처리
    SignUpRequest invalid =
        new SignUpRequest(
            "validUser",
            "short",
            "홍길동",
            "a@b.com",
            "M",
            null,
            null,
            true,
            true,
            null,
            null,
            null,
            null);

    mockMvc
        .perform(
            post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("C001"))
        .andExpect(jsonPath("$.path").value("/api/auth/signup"))
        .andExpect(jsonPath("$.fieldErrors[0].field").value("password"));
  }

  @Test
  void signUp_duplicateLoginId_returns409() throws Exception {
    willThrow(new BusinessException(ErrorCode.DUPLICATE_LOGIN_ID))
        .given(memberService)
        .signUp(any(SignUpRequest.class));

    mockMvc
        .perform(
            post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleSignUpRequest())))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("M001"));
  }

  // ─── 로그인 ───────────────────────────────────────────────

  @Test
  void login_success_returnsMemberInfo() throws Exception {
    given(memberService.login(any(LoginRequest.class)))
        .willReturn(new LoginResponse(1L, "validUser", "홍길동", MemberRole.USER));

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(new LoginRequest("validUser", "password1"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.memberId").value(1))
        .andExpect(jsonPath("$.loginId").value("validUser"))
        .andExpect(jsonPath("$.role").value("USER"));
  }

  @Test
  void login_failure_returns401() throws Exception {
    given(memberService.login(any(LoginRequest.class)))
        .willThrow(new BusinessException(ErrorCode.LOGIN_FAILED));

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("validUser", "wrong"))))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("M003"));
  }

  // ─── helper ───────────────────────────────────────────────

  private SignUpRequest sampleSignUpRequest() {
    return new SignUpRequest(
        "validUser",
        "password1",
        "홍길동",
        "hong@example.com",
        "M",
        null,
        "010-0000-0000",
        true,
        true,
        "12345",
        "도로명",
        "지번",
        "상세");
  }
}
