import process from "node:process";

const NODE_ENVS = ["development", "production", "test"] as const;
type NodeEnv = (typeof NODE_ENVS)[number];

function nodeEnvFrom(raw: string | undefined): NodeEnv {
  if (raw === undefined || raw === "") return "development";
  if (!NODE_ENVS.includes(raw as NodeEnv)) {
    throw new Error(`NODE_ENV must be one of: ${NODE_ENVS.join(", ")} — received: "${raw}"`);
  }
  return raw as NodeEnv;
}

function numberEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === "") return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive integer — received: "${raw}"`);
  }
  return parsed;
}

const nodeEnv = nodeEnvFrom(process.env.NODE_ENV);

export const env = {
  nodeEnv,
  port: numberEnv("PORT", 3000),
  isProduction: nodeEnv === "production",
  isTest: nodeEnv === "test",
} as const;
