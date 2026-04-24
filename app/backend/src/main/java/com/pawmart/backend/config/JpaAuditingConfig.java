package com.pawmart.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA Auditing 활성화 전용 설정 클래스.
 *
 * <p>@EnableJpaAuditing 을 @SpringBootApplication 에 직접 붙이면 @WebMvcTest 등 슬라이스 테스트에서도 Auditing Bean 이
 * 요구되어 엔티티가 없는 컨텍스트에서는 "JPA metamodel must not be empty" 로 실패한다. 별도 Configuration 으로 분리해 슬라이스 테스트
 * 스캔 범위에서 자연스럽게 제외되도록 한다.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {}
