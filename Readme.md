### 🧩 **type-safe-env** — Typed & Secure Environment Variables for TypeScript

> A lightweight, zero-dependency library to load, validate, and safely use environment variables in TypeScript — with full type inference and runtime validation.

#### 🧠 Why

Working with `process.env` is unsafe — everything is a string, missing variables fail silently, and production bugs appear too late.
**type-safe-env** ensures your environment configuration is **predictable, validated, and fully typed** from development to deployment.

#### ⚙️ Features

* 🧾 Load `.env`, `.env.local`, `.env.development`, etc. automatically
* 🧩 Merge and prioritize env files based on `NODE_ENV`
* 🔒 Expose a **readonly**, immutable `ts-env` object
* 🧰 Schema validation using **Zod** (or any validator)
* 💥 Early runtime errors for missing or invalid variables
* 🧠 Full TypeScript type inference
* ⚡ Zero dependencies and framework-agnostic

#### 🧪 Example

```ts
import { createEnv } from "type-safe-env";
import { z } from "zod";

export const env = createEnv({
    schema: {
        NODE_ENV: z.enum(["development", "production", "test"]),
        PORT: z.coerce.number().default(3000),
        DATABASE_URL: z.string().url(),
    },
});

// Fully typed access
console.log(env.DATABASE_URL);
```

#### 🧱 Roadmap

* [ ] Load `.env` and `.env.*` files
* [ ] Type-safe schema validation
* [ ] CLI for validation and type generation
* [ ] `.env.example` consistency check
* [ ] Framework integrations (Next.js, Vite, NestJS)
* [ ] Public/client-side variable export

---

#### 💡 Philosophy

Simple. Explicit. Type-safe.
**type-safe-env** helps you treat your environment configuration as real code — validated, documented, and predictable.

---

#### 🧑‍💻 Installation

```bash
npm install type-safe-env
```