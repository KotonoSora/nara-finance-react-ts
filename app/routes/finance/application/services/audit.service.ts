export interface AuditRecord {
  timestamp: Date;
  action: string;
  entityId: string;
  previousState?: string;
  newState: string;
  checksum: string;
  userId?: string;
}

export interface AuditQuery {
  entityId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

/**
 * Application Service for audit trail management
 * Provides data integrity and compliance tracking for financial operations
 */
export class AuditService {
  private static records: AuditRecord[] = [];

  private static async hashData(data: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  private static async createHash(data: any): Promise<string> {
    return await this.hashData(JSON.stringify(data));
  }

  /**
   * Add a new audit record with blockchain-like integrity
   */
  static async addRecord(
    action: string,
    entityId: string,
    previousState: any,
    newState: any,
    userId?: string,
  ): Promise<void> {
    const record: AuditRecord = {
      timestamp: new Date(),
      action,
      entityId,
      previousState: previousState ? JSON.stringify(previousState) : undefined,
      newState: JSON.stringify(newState),
      checksum: "",
      userId,
    };

    // Calculate checksum including previous record to create chain
    const previousChecksum =
      this.records[this.records.length - 1]?.checksum || "";
    record.checksum = await this.createHash(
      previousChecksum + JSON.stringify({ ...record, checksum: "" }),
    );

    this.records.push(record);
  }

  /**
   * Verify the integrity of the audit trail
   */
  static async verify(): Promise<boolean> {
    if (this.records.length === 0) return true;

    const verificationResults = await Promise.all(
      this.records.map(async (record, index) => {
        if (index === 0) return true;

        const previousChecksum = this.records[index - 1].checksum;
        const calculatedChecksum = await this.createHash(
          previousChecksum + JSON.stringify({ ...record, checksum: "" }),
        );

        return calculatedChecksum === record.checksum;
      }),
    );

    return verificationResults.every((result) => result);
  }

  /**
   * Get audit records with optional filtering
   */
  static getRecords(query?: AuditQuery): AuditRecord[] {
    let filteredRecords = [...this.records];

    if (query) {
      if (query.entityId) {
        filteredRecords = filteredRecords.filter(
          (record) => record.entityId === query.entityId,
        );
      }

      if (query.action) {
        filteredRecords = filteredRecords.filter(
          (record) => record.action === query.action,
        );
      }

      if (query.userId) {
        filteredRecords = filteredRecords.filter(
          (record) => record.userId === query.userId,
        );
      }

      if (query.startDate) {
        filteredRecords = filteredRecords.filter(
          (record) => record.timestamp >= query.startDate!,
        );
      }

      if (query.endDate) {
        filteredRecords = filteredRecords.filter(
          (record) => record.timestamp <= query.endDate!,
        );
      }
    }

    return filteredRecords;
  }

  /**
   * Get audit summary for a specific entity
   */
  static getEntityAuditSummary(entityId: string): {
    totalRecords: number;
    firstActivity: Date | null;
    lastActivity: Date | null;
    actions: Record<string, number>;
  } {
    const entityRecords = this.getRecords({ entityId });

    const actions = entityRecords.reduce(
      (acc, record) => {
        acc[record.action] = (acc[record.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalRecords: entityRecords.length,
      firstActivity:
        entityRecords.length > 0 ? entityRecords[0].timestamp : null,
      lastActivity:
        entityRecords.length > 0
          ? entityRecords[entityRecords.length - 1].timestamp
          : null,
      actions,
    };
  }

  /**
   * Clear audit records (use with caution)
   */
  static clearRecords(): void {
    this.records = [];
  }

  /**
   * Export audit records for compliance reporting
   */
  static exportRecords(query?: AuditQuery): {
    records: AuditRecord[];
    exportedAt: Date;
    totalRecords: number;
    verified: boolean;
  } {
    const records = this.getRecords(query);

    return {
      records,
      exportedAt: new Date(),
      totalRecords: records.length,
      verified: false, // Will be set asynchronously
    };
  }
}

// Audit action constants
export const AUDIT_ACTIONS = {
  TRANSACTION_CREATED: "transaction.created",
  TRANSACTION_UPDATED: "transaction.updated",
  TRANSACTION_DELETED: "transaction.deleted",
  CATEGORY_CREATED: "category.created",
  CATEGORY_UPDATED: "category.updated",
  CATEGORY_DELETED: "category.deleted",
  BUDGET_CREATED: "budget.created",
  BUDGET_UPDATED: "budget.updated",
  BUDGET_DELETED: "budget.deleted",
  DATA_IMPORTED: "data.imported",
  DATA_EXPORTED: "data.exported",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
