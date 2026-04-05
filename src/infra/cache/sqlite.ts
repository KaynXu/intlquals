import Database from "better-sqlite3";

export class SqliteCache {
  private readonly db: Database.Database;

  constructor(path: string) {
    this.db = new Database(path);
    this.db.exec(
      "create table if not exists cache (key text primary key, value text not null)"
    );
  }

  get(key: string): string | null {
    const row = this.db
      .prepare("select value from cache where key = ?")
      .get(key) as { value: string } | undefined;

    return row?.value ?? null;
  }

  set(key: string, value: string): void {
    this.db
      .prepare("insert or replace into cache (key, value) values (?, ?)")
      .run(key, value);
  }
}
