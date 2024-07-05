# Next.js 14 Base Project

This is a base project template using Next.js 14, shadcn/ui, Zod, and AI SDK. It serves as a starting point for building modern, type-safe web applications with AI capabilities.

## Features

- **Next.js 14**: The latest version of the React framework for production.
- **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS.
- **Zod**: TypeScript-first schema declaration and validation library.
- **AI SDK**: Tools for building AI-powered applications.
- **TypeScript**: For type safety and improved developer experience.
- **ESLint**: For code linting and maintaining code quality.
- **Prettier**: For consistent code formatting.

## Getting Started

### Prerequisites

- Node.js 20 or later
- pnpm (recommended) or npm

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/nextjs-base-project.git
   cd nextjs-base-project
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Run the development server:
   ```
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
├── components/
│   └── ui/
├── lib/
├── pages/
│   └── api/
├── public/
├── styles/
├── types/
├── .eslintrc.json
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## Configuration

- **Next.js**: Configured in `next.config.js`
- **Tailwind CSS**: Configured in `tailwind.config.js`
- **TypeScript**: Configured in `tsconfig.json`
- **ESLint**: Configured in `.eslintrc.json`

## Using shadcn/ui Components

To add a shadcn/ui component, use the provided CLI:

```
pnpm dlx shadcn-ui@latest add button
```

This will add the button component to your project. Repeat for other components as needed.

## Zod Schema Example

Create type-safe schemas in your `lib` or `types` directory:

```typescript
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
});

export type User = z.infer<typeof UserSchema>;
```

## AI SDK Integration

To use AI SDK features, import and configure as needed in your components or API routes:

```typescript
import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Configuration and usage examples...
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.