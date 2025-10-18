# 🧩 type-safe-env

[![npm version](https://img.shields.io/npm/v/type-safe-env.svg)](https://www.npmjs.com/package/type-safe-env)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, zero-dependency library to load, validate, and safely use environment variables in TypeScript — with full type inference and runtime validation.

### 🧠 Why

Working with `process.env` is unsafe — everything is a string, values can be missing, and bugs often appear too late in production. **type-safe-env** ensures your environment configuration is **predictable, validated, and fully typed** from the start.

---

### ✨ Features

-   **Automatic Environment Loading**: Loads variables from `.env` and `.env.[NODE_ENV]` files automatically.
-   **Type Inference**: Automatically detects `string`, `number`, and `boolean` types from your `.env` files.
-   **Type Generation**: Generates a `types.d.ts` file, providing full TypeScript autocompletion and type checking for your environment variables.
-   **Runtime Validation**: Throws an error on startup if any environment variable is empty, ensuring no missing variables in production.
-   **Zero Dependencies**: Lightweight and easy to integrate into any project.

---

### 🧑‍💻 Installation

```bash
npm install type-safe-env
```

---

### 🚀 Usage Example

1.  **Create a `.env` file** in the root of your project:

    ```env
    # .env
    APP_NAME="My Awesome App"
    PORT=3000
    DEBUG_MODE=true
    API_KEY=abc-123-def-456
    ```

2.  **Instantiate `TsEnv`** in your project's entry point (e.g., `index.ts`):

    ```typescript
    import createEnv from 'type-safe-env';

    // This will load the .env file, validate the variables,
    // and generate a `src/types.d.ts` file.
    const env = createEnv();

    export default env;
    ```

3.  **Automatic Type Generation**: The library will create a `src/types.d.ts` file for you:

    ```typescript
    // src/types.d.ts (auto-generated)
    declare type Env = {
        readonly APP_NAME: string;
        readonly PORT: number;
        readonly DEBUG_MODE: boolean;
        readonly API_KEY: string;
    };
    ```

4.  **Access Your Typed Variables**: Now you can import and use your environment variables with full type safety and autocompletion.

    ```typescript
    import env from './env-setup'; // Assuming you put the createEnv call in `env-setup.ts`

    console.log(env.get('APP_NAME')); // "My Awesome App" (string)
    console.log(env.get('PORT'));     // 3000 (number)
    console.log(env.get('DEBUG_MODE')); // true (boolean)

    // TypeScript will catch typos!
    // console.log(env.get('API_KEYY')); // Error: Argument of type '"API_KEYY"' is not assignable to parameter of type 'keyof Env'.
    ```

---

### ⚙️ API

#### `createEnv(options?: TsEnvOptions): TsEnv`

A factory function that creates and returns a `TsEnv` instance.

#### `TsEnvOptions`

You can pass an options object to `createEnv` to customize its behavior:

| Option      | Description                                                                                                 | Default                                      |
|-------------|-------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| `dir`       | The directory to search for `.env` files.                                                                   | `process.cwd()`                              |
| `env`       | The environment to load (e.g., 'production'). Loads `.env.[env]`.                                           | `process.env.NODE_ENV`                       |
| `typesPath` | Path for the generated `.d.ts` file. Set to `null` to disable.                                              | `path.join(process.cwd(), "src/types.d.ts")` |

---

### 📄 License

This project is licensed under the MIT License.
