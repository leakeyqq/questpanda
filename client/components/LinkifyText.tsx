'use client';

import React from 'react';

const LinkifyText = ({ text }: { text: string }) => {
  // Updated regex to include @ mentions
  const combinedRegex = /(https?:\/\/[^\s]+)|(@\w+)|(#\w+)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) { // URL
      parts.push(
        <a
          key={lastIndex}
          href={match[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {match[1]}
        </a>
      );
    } else if (match[2]) { // @ mention
      parts.push(
        <span key={lastIndex} className="text-purple-600">
          {match[2]}
        </span>
      );
    } else if (match[3]) { // Hashtag
      parts.push(
        <span key={lastIndex} className="text-blue-600">
          {match[3]}
        </span>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};

export default LinkifyText;