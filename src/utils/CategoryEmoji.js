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
  'ETC': 'speech-balloon'
};

const CategoryEmoji = ({ categoryCode, size}) => {
  return (
    <EmojiProvider data={emojiData}>
      <span className={`w-${size} h-${size} mr-1`}>
        <Emoji name={emojiMap[categoryCode] || 'speech_balloon'} />
      </span>
    </EmojiProvider>
  );
};

export default CategoryEmoji;
