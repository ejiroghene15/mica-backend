const EMOTION_COLORS: Record<string, string> = {
  calm: '#8FB8A8',
  growth: '#78A96B',
  joy: '#F2C14E',
  tender: '#D99A9A',
  rest: '#8EA7C2',
  heavy: '#6B7280',
};
 

export function formatEmotionBreakdown(grouped: any[]) {
  return grouped.map((group) => ({
    emotion: group.emotion,
    color: EMOTION_COLORS[group.emotion] ?? '#9CA3AF',
    count: group._count._all,
  }));
}