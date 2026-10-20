import { describe, expect, it } from 'vitest';

import { computeFlowBaseHash } from '../server/flow-base-hash.js';

describe('flow base hash', () => {
  it('computes a flow base hash that ignores key order but tracks content changes', () => {
    const base = {
      connectionReferences: { shared_office365: { connectionName: 'abc' } },
      definition: { actions: { Compose: { inputs: 'hello', type: 'Compose' } }, triggers: {} },
    };
    const reordered = {
      definition: { triggers: {}, actions: { Compose: { type: 'Compose', inputs: 'hello' } } },
      connectionReferences: { shared_office365: { connectionName: 'abc' } },
    };
    const changed = {
      ...base,
      definition: { actions: { Compose: { inputs: 'changed', type: 'Compose' } }, triggers: {} },
    };

    expect(computeFlowBaseHash(base)).toMatch(/^[0-9a-f]{64}$/);
    expect(computeFlowBaseHash(reordered)).toBe(computeFlowBaseHash(base));
    expect(computeFlowBaseHash(changed)).not.toBe(computeFlowBaseHash(base));
  });
});
