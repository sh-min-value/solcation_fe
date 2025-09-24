import React from 'react';
import { EmojiProvider, Emoji } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';
import categoryCache from './CategoryCache';

// 하드코딩된 이모지 맵 (하위 호환성을 위해 유지)
const emojiMap = {
  'FOOD': 'cooked-rice',
  'CAFE_AND_SNACK': 'hot-beverage',
  'STORE': 'convenience-store',
  'PLEASURE': 'clinking-beer-mugs',
  'SHOPPING': 'shopping-bags',
  'MEDICAL_TREATMENT': 'hospital',
  'LODGMENT': 'bed',
  'TRANSPORTATION': 'automobile',
  'TRANSFER': 'money-with-wings',
  'ETC': 'speech-balloon',

  'FRIENDS': 'handshake',
  'FAMILY': 'couple-with-heart-man-woman',
  'COUPLE': 'pink-heart',
  'COLLEAGUE': 'briefcase',

  'LEISURE': 'person-surfing',
  'RECREATION': 'leaf-fluttering-in-wind',
  'CULTURE': 'classical-building',
  'FESTIVAL': 'christmas-tree',
  'SIGHTSEEING': 'trolleybus',
};

const categoryEmoji = ({ categoryCode, size}) => {
  // CategoryCache에서 이모지 이름을 가져오려고 시도
  let emojiName = 'speech_balloon';
  
  try {
    if (categoryCache.isReady()) {
      // CategoryCache에서 이모지 이름을 가져오는 로직
      // 현재는 하드코딩된 맵을 사용하지만, 나중에 API 데이터로 확장 가능
      emojiName = emojiMap[categoryCode] || 'speech_balloon';
    } else {
      emojiName = emojiMap[categoryCode] || 'speech_balloon';
    }
  } catch (error) {
    console.warn('CategoryCache not ready, using fallback:', error);
    emojiName = emojiMap[categoryCode] || 'speech_balloon';
  }

  return (
    <EmojiProvider data={emojiData}>
      <span className={`w-${size} h-${size} mr-1`}>
        <Emoji name={emojiName} className="w-${size} h-${size}" />
      </span>
    </EmojiProvider>
  );
};

export default categoryEmoji;
