// 백엔드 에러 응답 처리 유틸리티

export interface BackendError {
  success: false;
  message: string;
  errors?: { [key: string]: string[] };
}

// 에러 메시지 추출
export function extractErrorMessage(error: any): string {
  // Axios 에러인 경우
  if (error.response?.data) {
    const data = error.response.data;
    
    // 백엔드에서 온 에러 메시지
    if (data.message) {
      return data.message;
    }
    
    // 필드별 에러가 있는 경우 첫 번째 에러 반환
    if (data.errors) {
      const firstField = Object.keys(data.errors)[0];
      const firstError = data.errors[firstField][0];
      return firstError || '입력값을 확인해주세요.';
    }
  }
  
  // 네트워크 에러
  if (error.code === 'NETWORK_ERROR') {
    return '네트워크 연결을 확인해주세요.';
  }
  
  // 타임아웃 에러
  if (error.code === 'ECONNABORTED') {
    return '요청 시간이 초과되었습니다.';
  }
  
  // 기본 에러 메시지
  return error.message || '알 수 없는 오류가 발생했습니다.';
}

// 필드별 에러 추출
export function extractFieldErrors(error: any): { [key: string]: string } {
  if (error.response?.data?.errors) {
    const fieldErrors: { [key: string]: string } = {};
    const errors = error.response.data.errors;
    
    Object.keys(errors).forEach(field => {
      fieldErrors[field] = errors[field][0] || '입력값을 확인해주세요.';
    });
    
    return fieldErrors;
  }
  
  return {};
}

// HTTP 상태 코드별 메시지
export function getStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return '잘못된 요청입니다.';
    case 401:
      return '인증이 필요합니다.';
    case 403:
      return '접근 권한이 없습니다.';
    case 404:
      return '요청한 리소스를 찾을 수 없습니다.';
    case 409:
      return '이미 존재하는 데이터입니다.';
    case 422:
      return '입력값을 확인해주세요.';
    case 429:
      return '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.';
    case 500:
      return '서버 오류가 발생했습니다.';
    case 502:
      return '서버 연결에 문제가 있습니다.';
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
}
