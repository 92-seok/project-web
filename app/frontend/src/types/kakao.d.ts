interface IDaumPostcodeData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  apartment: string;
}

interface IDaumPostcodeOptions {
  oncomplete: (data: IDaumPostcodeData) => void;
  width?: string | number;
  height?: string | number;
}

interface IDaumPostcode {
  open: () => void;
  embed: (element: HTMLElement) => void;
}

interface Window {
  daum: {
    Postcode: new (options: IDaumPostcodeOptions) => IDaumPostcode;
  };
}
