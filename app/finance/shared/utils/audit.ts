export interface AuditRecord {
  timestamp: Date;
  action: string;
  entityId: string;
  previousState?: string;
  newState: string;
  checksum: string;
}

async function hashData(data: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

class AuditTrail {
  private static records: AuditRecord[] = [];

  private static async createHash(data: any): Promise<string> {
    return await hashData(JSON.stringify(data));
  }

  static async addRecord(
    action: string,
    entityId: string,
    previousState: any,
    newState: any,
  ): Promise<void> {
    const record: AuditRecord = {
      timestamp: new Date(),
      action,
      entityId,
      previousState: JSON.stringify(previousState),
      newState: JSON.stringify(newState),
      checksum: "",
    };

    // Calculate checksum including previous record to create chain
    const previousChecksum =
      this.records[this.records.length - 1]?.checksum || "";
    record.checksum = await this.createHash(
      previousChecksum + JSON.stringify(record),
    );

    this.records.push(record);
  }

  static async verify(): Promise<boolean> {
    return (
      await Promise.all(
        this.records.map(async (record, index) => {
          if (index === 0) return true;

          const previousChecksum = this.records[index - 1].checksum;
          const calculatedChecksum = await this.createHash(
            previousChecksum + JSON.stringify({ ...record, checksum: "" }),
          );

          return calculatedChecksum === record.checksum;
        }),
      )
    ).every((result) => result);
  }

  static getRecords(): AuditRecord[] {
    return [...this.records];
  }
}

export default AuditTrail;
