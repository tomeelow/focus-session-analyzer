export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

export const formatEventType = (type) => {
  switch (type) {
    case 'distraction': return 'Distraction';
    case 'flow': return 'Entered Flow';
    case 'milestone': return 'Milestone Reached';
    case 'break_start': return 'Started Break';
    case 'break_end': return 'Ended Break';
    default: return type;
  }
};
