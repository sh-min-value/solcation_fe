import React, { useState, useEffect } from 'react';

const countriesData = {
  '전체': ['전체'],
  '한국': [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '강릉', '속초', '제주', '여수', '전주', '경주', '포항', '춘천', '수원', '청주', '목포', '안동'
  ],
  '일본': [
    '도쿄', '오사카', '교토', '요코하마', '나고야', '삿포로', '후쿠오카', '고베',
    '센다이', '히로시마', '가나자와', '오키나와', '나가사키', '구마모토', '가고시마'
  ],
  '미국': [
    '뉴욕', '로스앤젤레스', '시카고', '휴스턴', '피닉스', '필라델피아', '샌안토니오',
    '샌디에이고', '댈러스', '샌호세', '마이애미', '라스베이거스', '보스턴', '샌프란시스코',
    '워싱턴 D.C.', '올랜도', '시애틀', '디트로이트'
  ],
  '중국': [
    '베이징', '상하이', '광저우', '선전', '청두', '항저우', '우한', '시안',
    '난징', '톈진', '충칭', '쑤저우', '하얼빈', '칭다오', '다롄', '구이린'
  ],
  '유럽': [
    '파리', '런던', '로마', '마드리드', '베를린', '암스테르담', '비엔나', '프라하',
    '바르셀로나', '아테네', '리스본', '브뤼셀', '부다페스트', '코펜하겐', '스톡홀름',
    '오슬로', '취리히', '두브로브니크', '피렌체'
  ],
  '동남아시아': [
    '방콕', '치앙마이', '푸껫', '하노이', '호치민', '다낭', '세부', '마닐라',
    '쿠알라룸푸르', '싱가포르', '발리', '자카르타'
  ],
  '중동': [
    '두바이', '아부다비', '도하', '이스탄불', '텔아비브', '예루살렘', '리야드'
  ],
  '오세아니아': [
    '시드니', '멜버른', '브리즈번', '퍼스', '오클랜드', '퀸스타운', '웰링턴'
  ],
  '남미': [
    '리우데자네이루', '상파울루', '부에노스아이레스', '산티아고', '리마', '보고타', '멕시코시티', '쿠스코'
  ],
  '아프리카': [
    '카이로', '케이프타운', '요하네스버그', '마라케시', '나이로비', '잔지바르'
  ]
};


const popularCities = ['서울', '도쿄', '뉴욕', '베이징', '파리'];

const SelectLocation = ({ onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState('전체');
  const [selectedCity, setSelectedCity] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  const countries = Object.keys(countriesData);
  const cities = selectedCountry && selectedCountry !== '전체' 
    ? countriesData[selectedCountry] 
    : ['전체', ...Object.values(countriesData).flat().filter(city => city !== '전체')];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedCity('전체');
    
    if (country === '전체') {
      const firstCountry = Object.keys(countriesData).find(key => key !== '전체');
      const firstCity = countriesData[firstCountry]?.[0];
      onChange({ country: firstCountry, city: firstCity });
    } else {
      onChange({ country, city: '전체' });
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    
    if (city !== '전체') {
      for (const [country, cities] of Object.entries(countriesData)) {
        if (cities.includes(city)) {
          if (selectedCountry === '전체') {
            // 전체 탭에서 도시 선택 - 탭 변경하지 않음
            onChange({ country, city });
          } else {
            // 특정 나라 탭에서 도시 선택 - 탭 변경
            setSelectedCountry(country);
            onChange({ country, city });
          }
          return;
        }
      }
    } else {
      // 전체 도시 선택
      const firstCountry = Object.keys(countriesData).find(key => key !== '전체');
      const firstCity = countriesData[firstCountry]?.[0];
      setSelectedCountry('전체');
      onChange({ country: firstCountry, city: firstCity });
    }
  };

  const filteredCities = searchTerm.trim().length >= 2
    ? Object.values(countriesData).flat().filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
    : cities;

  return (
    <div className="w-full max-w-md">
      {/* 검색바 */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-sm mb-4">
        <input
          type="text"
          placeholder="장소 검색"
          className="w-full text-lg border-none outline-none bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 나라 선택 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => handleCountrySelect(country)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCountrySelect(country);
              }
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCountry === country ? 'bg-secondary text-third' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {country}
          </button>
        ))}
      </div>

      {/* 도시 목록 */}
      <div className="bg-white/20 rounded-2xl p-4 shadow-sm max-h-80 overflow-y-auto">
        {searchTerm.trim().length >= 2 ? (
          filteredCities.map(city => (
            <div
              key={city}
              role="button"
              tabIndex={0}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedCity === city ? 'bg-secondary text-third' : ''
              }`}
              onClick={() => handleCitySelect(city)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCitySelect(city);
                }
              }}
            >
              <span>{city}</span>
            </div>
          ))
        ) : selectedCountry === '전체' ? (
          <div>
            <h3 className="text-lg font-semibold mb-3">인기 도시</h3>
            {popularCities.map(city => (
              <div
                key={city}
                role="button"
                tabIndex={0}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedCity === city ? 'bg-secondary text-third' : ''
                }`}
                onClick={() => {
                  // 인기 도시 선택 시 나라도 자동 설정
                  const country = Object.keys(countriesData).find(c => countriesData[c].includes(city));
                  handleCountrySelect(country);
                  handleCitySelect(city);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const country = Object.keys(countriesData).find(c => countriesData[c].includes(city));
                    handleCountrySelect(country);
                    handleCitySelect(city);
                  }
                }}
              >
                <span>{city}</span>
              </div>
            ))}
          </div>
        ) : (
          filteredCities.map(city => (
            <div
              key={city}
              role="button"
              tabIndex={0}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedCity === city ? 'bg-secondary text-third' : ''
              }`}
              onClick={() => handleCitySelect(city)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCitySelect(city);
                }
              }}
            >
              <span>{city}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectLocation;
