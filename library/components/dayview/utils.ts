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

  const processed: Array<{ event: T; start: number; end: number; col: number; maxCols: number }> = [];

  let currentCluster: Array<{ event: T; start: number; end: number; col: number; maxCols: number }> = [];
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

function calculateColumns(cluster: any[]): number {
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
