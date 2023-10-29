declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string;
        DATABASE_URL: string;
        SECRET_KEY: string;
        REFRESH_TOKEN_SECRET:string;
        ACCESS_TOKEN_SECRET:string
      }
    }
  }

  export {}