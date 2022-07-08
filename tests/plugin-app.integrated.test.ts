import { App, CorePlugin, createApp, Plugin } from "../lib";
import { createPlugin } from "../lib/hooks/plugin.hooks";
import { createCorePlugin } from "../lib/hooks/core-plugin.hooks";

it("create a plugin and install it", () => {
  let installed = false;
  const plugin: Plugin = createPlugin({
    name: "test",
    multiple: true,
    install(app: App, ...options: any[]) {
      installed = true;
    },
  });
  const app = createApp();
  app.use(plugin);
  expect(installed).toBe(true);
});

it("create a core plugin and install it", async () => {
  let installed = false;
  const plugin: CorePlugin = createCorePlugin({
    name: "test",
    version: "1.0.0",
    install(app: App, ...options: any[]) {
      installed = true;
    },
  });
  const app = createApp();
  app.register(plugin);
  expect(installed).toBe(false);
  await app.start();
  expect(installed).toBe(true);
});

it("create a core plugin and start it", async () => {
  let started = false;
  const plugin: CorePlugin = createCorePlugin({
    name: "test",
    version: "1.0.0",
    install(app: App, ...options: any[]) {},
  });
  plugin.onAppStarted(() => {
    started = true;
  });
  const app = createApp();
  app.register(plugin);
  await app.start();
  expect(started).toBe(true);
});

it("create a async module and try install", async () => {
  let time = new Date().getTime();
  let finishTime = 0;
  const app = createApp();
  const plugin: CorePlugin = createCorePlugin({
    name: "test",
    version: "1.0.0",
    install: async (app: App, ...options: any[]): Promise<void> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          finishTime = new Date().getTime();
          resolve();
        }, 120);
      });
    },
  });
  app.register(plugin);
  await app.start();
  expect(finishTime - time).toBeGreaterThan(100);
  expect(finishTime).toBeGreaterThan(100);
  expect(time === 0).toBe(false);
  expect(finishTime === 0).toBe(false);
});
