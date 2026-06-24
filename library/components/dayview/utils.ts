export interface DayEventInput {
  id: string;
  date: Date;
  endDate?: Date;
  [key: string]: any;
}

export interface ProcessedEvent<T extends DayEventInput> {
  event: T;
  top: number;
  height: number;
  left: number;
  width: number;
}

interface ClusterItem<T> {
  event: T;
  start: number;
  end: number;
  col: number;
  maxCols: number;
}

export function processOverlappingEvents<T extends DayEventInput>(
  events: T[],
  hourHeight: number
): ProcessedEvent<T>[] {
  if (!events || events.length === 0) return [];

  // Sort events by start time, then by end time (longer events first)
  const sortedEvents = [...events].sort((a, b) => {
    if (a.date.getTime() === b.date.getTime()) {
      const aEnd = a.endDate?.getTime() || a.date.getTime() + 10 * 60000;
      const bEnd = b.endDate?.getTime() || b.date.getTime() + 10 * 60000;
      return bEnd - aEnd;
    }
    return a.date.getTime() - b.date.getTime();
  });

  const processed: Array<ClusterItem<T>> = [];

  let currentCluster: Array<ClusterItem<T>> = [];
  let clusterEnd = -1;

  for (const evt of sortedEvents) {
    const startHour = evt.date.getHours() + evt.date.getMinutes() / 60;
    let durationHours = 10 / 60; // default 10 mins
    if (evt.endDate) {
      durationHours = (evt.endDate.getTime() - evt.date.getTime()) / (1000 * 60 * 60);
    }
    const endHour = startHour + durationHours;

    // If the event starts after the current cluster ends, flush the cluster
    if (currentCluster.length > 0 && startHour >= clusterEnd) {
      const maxCols = calculateColumns(currentCluster);
      currentCluster.forEach((item) => (item.maxCols = maxCols));
      processed.push(...currentCluster);
      currentCluster = [];
      clusterEnd = -1;
    }

    currentCluster.push({ event: evt, start: startHour, end: endHour, col: 0, maxCols: 1 });
    clusterEnd = Math.max(clusterEnd, endHour);
  }

  // Flush remaining
  if (currentCluster.length > 0) {
    const maxCols = calculateColumns(currentCluster);
    currentCluster.forEach((item) => (item.maxCols = maxCols));
    processed.push(...currentCluster);
  }

  return processed.map((item) => ({
    event: item.event,
    top: item.start * hourHeight,
    height: Math.max((item.end - item.start) * hourHeight, 24), // min 24px height
    left: (item.col / item.maxCols) * 100,
    width: (1 / item.maxCols) * 100,
  }));
}

function calculateColumns<T>(cluster: ClusterItem<T>[]): number {
  const columns: number[] = [];
  let maxCols = 0;

  for (const item of cluster) {
    let col = 0;
    // Find the first column where the event doesn't overlap
    // Note: It doesn't overlap if the column's end time is <= item's start time
    while (columns[col] !== undefined && columns[col] > item.start) {
      col++;
    }
    item.col = col;
    columns[col] = item.end;
    maxCols = Math.max(maxCols, col + 1);
  }
  return maxCols;
}

export function getContrastColor(color: string | undefined): string {
  if (!color) return 'var(--color-text-inverse)';

  let r = 0, g = 0, b = 0;
  
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    if (hex.length === 3) {
      r = parseInt(hex.substring(0, 1).repeat(2), 16);
      g = parseInt(hex.substring(1, 2).repeat(2), 16);
      b = parseInt(hex.substring(2, 3).repeat(2), 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0], 10);
      g = parseInt(match[1], 10);
      b = parseInt(match[2], 10);
    }
  } else {
    // If we cannot parse the color (e.g., CSS variable or named color), default to inverse text
    return 'var(--color-text-inverse)';
  }

  // Relative luminance calculation
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;

  return luminance > 0.179 ? '#000000' : '#ffffff';
}
