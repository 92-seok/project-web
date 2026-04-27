import { apiClient } from './client';

export interface IUploadResponse {
  url: string;
}

/**
 * 이미지 업로드 — multipart/form-data
 * 백엔드는 파일 검증 후 정적 URL(`/uploads/...`) 반환
 *
 * @param file 이미지 파일 (jpg/jpeg/png/webp/gif, 최대 5MB)
 * @param subDir 분류용 서브디렉토리 (예: 'pet', 'review')
 */
export const uploadApi = {
  uploadImage: (file: File, subDir?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (subDir) formData.append('subDir', subDir);

    return apiClient
      .post<IUploadResponse>('/uploads/image', formData, {
        // FormData면 axios가 자동으로 multipart/form-data + boundary 설정
        // 글로벌 default('application/json') override
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
