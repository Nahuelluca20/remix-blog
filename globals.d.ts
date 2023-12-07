export {};
declare global {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
  }
  interface Process {
    cwd(): string;
    env: ProcessEnv;
  }
  let process: Process;
}
