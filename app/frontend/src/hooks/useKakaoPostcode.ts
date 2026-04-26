import { useCallback, useEffect, useRef } from 'react';

const SCRIPT_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
const SCRIPT_ID = 'kakao-postcode-script';

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('카카오 우편번호 스크립트 로드 실패'));
    document.head.appendChild(script);
  });
}

export interface IAddressResult {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
}

export function useKakaoPostcode(onSelect: (result: IAddressResult) => void) {
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    loadScript().catch(console.error);
  }, []);

  const openPostcode = useCallback(async () => {
    await loadScript();
    new window.daum.Postcode({
      oncomplete: (data: IDaumPostcodeData) => {
        onSelectRef.current({
          zonecode: data.zonecode,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
        });
      },
    }).open();
  }, []);

  return { openPostcode };
}
