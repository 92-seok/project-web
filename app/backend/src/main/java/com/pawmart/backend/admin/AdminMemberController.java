package com.pawmart.backend.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pawmart.backend.admin.dto.AdminMemberPageResponse;
import com.pawmart.backend.admin.dto.AdminMemberResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

  private final AdminMemberService adminMemberService;

  @GetMapping
  public ResponseEntity<AdminMemberPageResponse> getMembers(
      @RequestParam(required = false) String keyword,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return ResponseEntity.ok(adminMemberService.getMembers(keyword, page, size));
  }

  @GetMapping("/{id}")
  public ResponseEntity<AdminMemberResponse> getMember(@PathVariable Long id) {
    return ResponseEntity.ok(adminMemberService.getMember(id));
  }
}
