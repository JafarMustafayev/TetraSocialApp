// src/utils/dateFormatter.js
export const formatMessageTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const getMessageDateGroup = (isoString) => {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentGroup = null;

  messages.forEach(msg => {
    const groupName = getMessageDateGroup(msg.createdAt);
    
    if (!currentGroup || currentGroup.date !== groupName) {
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = {
        date: groupName,
        messages: []
      };
    }
    
    currentGroup.messages.push(msg);
  });

  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups;
};

export const formatUtcToLocal = (dateString) => {
  if (!dateString) return '';
  let formattedString = dateString.trim().replace(' ', 'T');
  if (!/Z|[+-]\d{2}:?\d{2}$/i.test(formattedString)) {
    formattedString += 'Z';
  }
  const date = new Date(formattedString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleString();
};
