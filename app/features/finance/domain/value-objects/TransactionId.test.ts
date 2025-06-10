import { describe, expect, it } from "vitest";

import { TransactionId } from "~/features/finance/domain/value-objects/TransactionId";

describe("TransactionId", () => {
  describe("create", () => {
    it("should create valid TransactionId with string value", () => {
      const id = TransactionId.create("test-id-123");
      expect(id.getValue()).toBe("test-id-123");
    });

    it("should throw error for empty string", () => {
      expect(() => TransactionId.create("")).toThrow(
        "Transaction ID cannot be empty",
      );
    });

    it("should throw error for whitespace only", () => {
      expect(() => TransactionId.create("   ")).toThrow(
        "Transaction ID cannot be empty",
      );
    });
  });

  describe("generate", () => {
    it("should generate unique IDs", () => {
      const id1 = TransactionId.generate();
      const id2 = TransactionId.generate();

      expect(id1.getValue()).not.toBe(id2.getValue());
      expect(id1.getValue()).toMatch(/^txn_/);
      expect(id2.getValue()).toMatch(/^txn_/);
    });

    it("should generate IDs with correct format", () => {
      const id = TransactionId.generate();
      expect(id.getValue()).toMatch(/^txn_[a-z0-9]+_[a-z0-9]+$/);
    });
  });

  describe("equals", () => {
    it("should return true for same ID values", () => {
      const id1 = TransactionId.create("test-123");
      const id2 = TransactionId.create("test-123");

      expect(id1.equals(id2)).toBe(true);
    });

    it("should return false for different ID values", () => {
      const id1 = TransactionId.create("test-123");
      const id2 = TransactionId.create("test-456");

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      const id = TransactionId.create("test-id");
      expect(id.toString()).toBe("test-id");
    });
  });
});
