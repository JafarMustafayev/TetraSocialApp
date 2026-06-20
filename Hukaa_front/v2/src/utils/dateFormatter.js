// src/utils/dateFormatter.js

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const formatMessageTime = (date) => {
  return dayjs(date).format("HH:mm");
};

export const getMessageDateGroup = (date) => {
  const target = dayjs(date);

  if (target.isSame(dayjs(), "day")) {
    return "Today";
  }

  if (target.isSame(dayjs().subtract(1, "day"), "day")) {
    return "Yesterday";
  }

  return target.format("D MMMM YYYY");
};

export const groupMessagesByDate = (messages) =>
  messages.reduce((groups, msg) => {
    const dateGroup = getMessageDateGroup(msg.createdAt);
    const lastGroup = groups[groups.length - 1];

    if (!lastGroup || lastGroup.date !== dateGroup) {
      groups.push({
        date: dateGroup,
        messages: [msg],
      });
    } else {
      lastGroup.messages.push(msg);
    }

    return groups;
  }, []);

export const formatUtcToLocal = (date) => {
  if (!date) return "";
  return dayjs.utc(date).local().format("DD.MM.YYYY HH:mm");
};

export const getTimeAgo = (date) => {
  if (!date) return "";
  return dayjs(date).fromNow();
};