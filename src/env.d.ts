/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "@fontsource/*" {}
declare module "@fontsource-variable/*" {}

interface Window {
	__portfolioLanguageSelectorListenersInitialized?: boolean
	__portfolioScrollUiInitialized?: boolean
	__portfolioThemeListenersInitialized?: boolean
}
