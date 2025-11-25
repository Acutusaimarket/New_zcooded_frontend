export interface OCRSpecification {
  key: string;
  value: string;
}

export interface OCRMetadata {
  key: string;
  value: string;
}

export interface OCRImageData {
  url: string;
  key: string;
}

export interface OCRExtractResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    product_name: string;
    description: string;
    price: number;
    currency: string;
    weight: string;
    dimensions: string;
    color: string;
    size: string;
    features: string;
    specifications: OCRSpecification[];
    metadata: OCRMetadata[];
    images: OCRImageData[];
  };
}

export interface OCRUploadRequest {
  images: File[];
}
