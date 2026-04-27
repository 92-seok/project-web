package com.pawmart.backend.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.pawmart.backend.admin.dto.AdminMemberPageResponse;
import com.pawmart.backend.admin.dto.AdminMemberResponse;
import com.pawmart.backend.common.exception.BusinessException;
import com.pawmart.backend.common.exception.ErrorCode;
import com.pawmart.backend.member.Member;
import com.pawmart.backend.member.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminMemberService {

  private final MemberRepository memberRepository;

  public AdminMemberPageResponse getMembers(String keyword, int page, int size) {
    PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    String kw = StringUtils.hasText(keyword) ? keyword : null;

    Page<Member> memberPage = memberRepository.searchMembers(kw, pageable);

    return new AdminMemberPageResponse(
        memberPage.getContent().stream().map(AdminMemberResponse::from).toList(),
        memberPage.getNumber(),
        memberPage.getSize(),
        memberPage.getTotalElements(),
        memberPage.getTotalPages(),
        memberPage.isLast());
  }

  public AdminMemberResponse getMember(Long id) {
    Member member =
        memberRepository
            .findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    return AdminMemberResponse.from(member);
  }
}
