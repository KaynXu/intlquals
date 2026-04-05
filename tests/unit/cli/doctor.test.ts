import { describe, expect, it } from "vitest";
import { buildDoctorCommand } from "../../../src/cli/commands/doctor.js";

describe("doctor command", () => {
  it("is named doctor", () => {
    expect(buildDoctorCommand().name()).toBe("doctor");
  });
});
