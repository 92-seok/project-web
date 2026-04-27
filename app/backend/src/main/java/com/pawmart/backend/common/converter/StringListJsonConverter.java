package com.pawmart.backend.common.converter;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * List&lt;String&gt; ↔ JSON 문자열 변환.
 *
 * <p>Hibernate 7의 {@code @JdbcTypeCode(SqlTypes.JSON)} 은 MySQL 8 의 네이티브 JSON 만 지원하고 MariaDB(JSON =
 * LONGTEXT 별칭) 에서는 {@code cast(? as json)} 문법 오류로 실패한다. 그래서 직접 직렬화/역직렬화하는 컨버터로 모든 DB에서 동일하게 동작하게
 * 한다.
 */
@Converter
public class StringListJsonConverter implements AttributeConverter<List<String>, String> {

  private static final ObjectMapper MAPPER = new ObjectMapper();
  private static final TypeReference<List<String>> TYPE_REF = new TypeReference<>() {};

  @Override
  public String convertToDatabaseColumn(List<String> attribute) {
    if (attribute == null || attribute.isEmpty()) return null;
    try {
      return MAPPER.writeValueAsString(attribute);
    } catch (Exception e) {
      throw new IllegalArgumentException("List<String> JSON 직렬화 실패", e);
    }
  }

  @Override
  public List<String> convertToEntityAttribute(String dbData) {
    if (dbData == null || dbData.isBlank()) return new ArrayList<>();
    try {
      return MAPPER.readValue(dbData, TYPE_REF);
    } catch (Exception e) {
      // 잘못된 JSON 데이터일 경우 빈 리스트 반환 (조회는 깨지지 않게)
      return new ArrayList<>();
    }
  }
}
