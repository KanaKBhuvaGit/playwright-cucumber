export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BROWSER: "chrome" | "firefox" | "webkit",
            ENV: "staging" | "prod" | "test",
            BASEURL: string,
            BASEURL_TODO: string,
            HEAD: "true" | "false"
        }
    }
}