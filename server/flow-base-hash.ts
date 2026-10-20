import { createHash } from 'node:crypto';

import { isPlainObject } from './client-helpers.js';

const toCanonicalJson = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(toCanonicalJson).join(',')}]`;

  if (isPlainObject(value)) {
    const entries = Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${toCanonicalJson(value[key])}`);
    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value) ?? 'null';
};

// Content fingerprint of the flow body a caller edited from. Key order is ignored so live API reads and browser
// snapshots of the same flow hash identically.
export const computeFlowBaseHash = ({
  connectionReferences,
  definition,
}: {
  connectionReferences: Record<string, unknown>;
  definition: Record<string, unknown>;
}): string => createHash('sha256').update(toCanonicalJson({ connectionReferences, definition })).digest('hex');
