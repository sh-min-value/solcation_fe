// 주소를 예쁘게 포맷팅하는 함수
export const formatAddress = (place) => {
  const addr = place.address;
  if (!addr) return place.display_name;

  const parts = [];
  
  // 건물명이나 장소명
  if (place.name) {
    parts.push(place.name);
  }
  
  // 도로명 주소
  if (addr.road) {
    if (addr.house_number) {
      parts.push(`${addr.house_number} ${addr.road}`);
    } else {
      parts.push(addr.road);
    }
  }
  
  // 지역 정보 (neighbourhood, suburb, city 중 우선순위)
  if (addr.neighbourhood) {
    parts.push(addr.neighbourhood);
  } else if (addr.suburb) {
    parts.push(addr.suburb);
  } else if (addr.city) {
    parts.push(addr.city);
  }
  
  // 국가 정보
  if (addr.country) {
    parts.push(addr.country);
  }

  return parts.join(', ');
};

// 장소명을 깔끔하게 가져오는 함수
export const getCleanPlaceName = (place) => {
  return place.name || place.display_name.split(',')[0];
};

// 국가 정보를 가져오는 함수
export const getCountryInfo = (place) => {
  const addr = place.address;
  if (!addr) return null;
  
  if (addr.country && addr.country !== '대한민국') {
    return addr.country;
  }
  return null;
};
