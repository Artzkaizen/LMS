import { z } from "zod";

const EnvSchema = z
    .object({
        NODE_ENV: z.string().default("development"),
        PORT: z.coerce.number().default(9999),
        LOG_LEVEL: z.enum([
            "fatal",
            "error",
            "warn",
            "info",
            "debug",
            "trace",
            "silent",
        ]),
        VITE_DATABASE_URL: z.string().url(),
        VITE_DATABASE_AUTH_TOKEN: z.string().optional(),
    })
    .superRefine((input, ctx) => {
        if (input.NODE_ENV === "production" && !input.VITE_DATABASE_AUTH_TOKEN) {
            ctx.addIssue({
                code: z.ZodIssueCode.invalid_type,
                expected: "string",
                received: "undefined",
                path: ["VITE_DATABASE_AUTH_TOKEN"],
                message: "Must be set when NODE_ENV is 'production'",
            });
        }
    });

export type Env = z.infer<typeof EnvSchema>;

const envVariables = {
    NODE_ENV: import.meta.env.MODE,
    PORT: import.meta.env.VITE_PORT,
    LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL,
    VITE_DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
    VITE_DATABASE_AUTH_TOKEN: import.meta.env.VITE_DATABASE_AUTH_TOKEN,
};

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(envVariables);

if (error) {
    console.error("❌ Invalid env:");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    throw new Error("Invalid environment variables");
}

export default env;
