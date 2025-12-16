export type Point = { x: number; y: number };

const EPS = 1e-9;

export function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function normalizeAngle(angle: number | undefined) {
  const raw = typeof angle === 'number' && Number.isFinite(angle) ? angle : 0;
  return ((raw % 360) + 360) % 360;
}

function dot(n: Point, p: Point) {
  return n.x * p.x + n.y * p.y;
}

export function getRectCorners(width: number, height: number): Point[] {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
}

function intersectSegmentWithLine(s: Point, e: Point, n: Point, p: number): Point | null {
  const ds = dot(n, s);
  const de = dot(n, e);
  const denom = de - ds;

  if (Math.abs(denom) < EPS) {
    return null;
  }

  const t = (p - ds) / denom;
  if (t < 0 || t > 1) {
    return null;
  }

  return { x: s.x + (e.x - s.x) * t, y: s.y + (e.y - s.y) * t };
}

export function clipPolygonHalfPlane(points: Point[], n: Point, p: number, keepLessEqual: boolean) {
  if (points.length === 0) {
    return [] as Point[];
  }

  const inside = (pt: Point) => {
    const v = dot(n, pt);
    return keepLessEqual ? v <= p + EPS : v >= p - EPS;
  };

  const output: Point[] = [];
  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const currentInside = inside(current);
    const nextInside = inside(next);

    if (currentInside && nextInside) {
      output.push(next);
    } else if (currentInside && !nextInside) {
      const intersection = intersectSegmentWithLine(current, next, n, p);
      if (intersection) {
        output.push(intersection);
      }
    } else if (!currentInside && nextInside) {
      const intersection = intersectSegmentWithLine(current, next, n, p);
      if (intersection) {
        output.push(intersection);
      }
      output.push(next);
    }
  }

  return output;
}

export function toClipPathPolygon(points: Point[], width: number, height: number) {
  if (width <= 0 || height <= 0 || points.length === 0) {
    return 'polygon(0 0, 0 0, 0 0)';
  }

  const formatted = points
    .map((pt) => {
      const x = clampNumber((pt.x / width) * 100, 0, 100);
      const y = clampNumber((pt.y / height) * 100, 0, 100);
      return `${x.toFixed(4)}% ${y.toFixed(4)}%`;
    })
    .join(', ');

  return `polygon(${formatted})`;
}

export function getLineSegmentInRect(
  width: number,
  height: number,
  n: Point,
  p: number
): [Point, Point] | null {
  if (width <= 0 || height <= 0) {
    return null;
  }

  const corners = getRectCorners(width, height);
  const edges: Array<[Point, Point]> = [
    [corners[0], corners[1]],
    [corners[1], corners[2]],
    [corners[2], corners[3]],
    [corners[3], corners[0]],
  ];

  const intersections: Point[] = [];
  for (const [s, e] of edges) {
    const ds = dot(n, s) - p;
    const de = dot(n, e) - p;

    if (Math.abs(ds) < EPS && Math.abs(de) < EPS) {
      intersections.push(s, e);
      continue;
    }

    if (Math.abs(ds) < EPS) {
      intersections.push(s);
      continue;
    }

    if (Math.abs(de) < EPS) {
      intersections.push(e);
      continue;
    }

    if ((ds < 0 && de > 0) || (ds > 0 && de < 0)) {
      const intersection = intersectSegmentWithLine(s, e, n, p);
      if (intersection) {
        intersections.push(intersection);
      }
    }
  }

  const unique: Point[] = [];
  for (const pt of intersections) {
    const exists = unique.some((u) => Math.abs(u.x - pt.x) < 0.5 && Math.abs(u.y - pt.y) < 0.5);
    if (!exists) {
      unique.push(pt);
    }
  }

  if (unique.length < 2) {
    return null;
  }

  let bestA = unique[0];
  let bestB = unique[1];
  let bestDist = -1;

  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      const dx = unique[i].x - unique[j].x;
      const dy = unique[i].y - unique[j].y;
      const dist = dx * dx + dy * dy;
      if (dist > bestDist) {
        bestDist = dist;
        bestA = unique[i];
        bestB = unique[j];
      }
    }
  }

  return [bestA, bestB];
}

export function projectCornersRange(width: number, height: number, normal: Point) {
  const corners = getRectCorners(width, height);
  const projections = corners.map((c) => dot(normal, c));
  const min = Math.min(...projections);
  const max = Math.max(...projections);
  return { corners, min, max };
}

export function getNormalFromAngle(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) } satisfies Point;
}

export function projectPoint(normal: Point, point: Point) {
  return dot(normal, point);
}
