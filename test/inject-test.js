var assert = require('assert');
var deeq = require('../');

describe('deeq', () => {
  describe('#inject', () => {
    beforeEach(() => {
      deeq.inject();
    });
    afterEach(() => {
      deeq.restore();
    });

    describe('assert.deepEqual', () => {
      it('does not throw for same sets', () => {
        assert.deepEqual(new Set([1]), new Set([1]));
      });

      it('does not throw for same sets strictly', () => {
        assert.deepEqual(new Set([1]), new Set(['1']));
      });

      it('throws for different sets', () => {
        assert.throws(() => {
          assert.deepEqual(new Set([1]), new Set([2]));
        });
      });
    });

    describe('assert.deepStrictEqual', () => {
      it('does not throw for same sets', () => {
        assert.deepEqual(new Set([1]), new Set([1]));
      });

      it('throws for different sets strictly', () => {
        assert.throws(() => {
          assert.deepStrictEqual(new Set([1]), new Set(['1'], true));
        });
      });
    });
  });
  describe('#restore', () => {
    it('restores original assert', () => {
      // does not throw
      assert.deepEqual(new Set([1]), new Set([2]));
      assert.deepStrictEqual(new Set([1]), new Set(['1'], true));

      deeq.inject();
      assert.throws(() => {
        assert.deepEqual(new Set([1]), new Set([2]));
      });
      assert.throws(() => {
        assert.deepStrictEqual(new Set([1]), new Set(['1'], true));
      });

      deeq.restore();
      // does not throw
      assert.deepEqual(new Set([1]), new Set([2]));
      assert.deepStrictEqual(new Set([1]), new Set(['1'], true));
    });

    it('restores original assert after inject twice', () => {
      deeq.inject();
      deeq.inject();
      assert.throws(() => {
        assert.deepEqual(new Set([1]), new Set([2]));
      });
      assert.throws(() => {
        assert.deepStrictEqual(new Set([1]), new Set(['1'], true));
      });

      deeq.restore();
      // does not throw
      assert.deepEqual(new Set([1]), new Set([2]));
      assert.deepStrictEqual(new Set([1]), new Set(['1'], true));
    });
  });
});
