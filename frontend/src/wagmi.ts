import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: import.meta.env.VITE_WC_PROJECT_ID, // or infuraId
    walletConnectProjectId: import.meta.env.VITE_WC_PROJECT_ID,

    appName: "ghobet",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
