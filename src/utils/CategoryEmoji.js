import React from 'react';
import { EmojiProvider, Emoji } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';

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
  'LOVER': 'pink-heart',
  'COLLEAGUE': 'briefcase',

  'LEISURE': 'kitesurfing',
  'RECREATION': 'tree',
  'CULTURE': 'building-columns',
  'FESTIVAL': 'festival',
  'SIGHTSEEING': 'bus',
};

const transactionCategoryEmoji = ({ categoryCode, size}) => {
  return (
    <EmojiProvider data={emojiData}>
        <Emoji name={emojiMap[categoryCode] || 'speech_balloon'} className="w-${size} h-${size} mr-1" />
    </EmojiProvider>
  );
};

export default transactionCategoryEmoji;
