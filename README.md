# Emma AI - Customer Success Manager

Emma AI is an intelligent customer success manager that automates client communications, generates SOPs, provides training materials, and identifies upsell opportunities.

## Features

- **Personalized Communications**: Automatically generate nurturing emails, follow-ups, SMS reminders, and call scripts tailored to each client's specific situation.
- **SOP Generation**: Create comprehensive standard operating procedures for internal teams and clients with step-by-step instructions.
- **Upsell Detection**: Identify high-value upsell opportunities by analyzing usage patterns and client needs for well-timed, relevant offers.
- **Training Materials**: Generate customized training content for clients at different stages of their journey, with exercises and knowledge checks.
- **Client Onboarding**: Streamline the onboarding process with automated welcome emails, resource sharing, and setup guidance.

## Project Structure

```
/app
  - /dashboard
    - page.tsx  // Main client dashboard
  - /api
    - /agent
      - route.ts  // API route for agent requests
    - /comms
      - route.ts  // Handles communication prompt-based API routing
/components
  - AgentChat.tsx      // Chat interface
  - ClientSummaryCard.tsx
/lib
  - openai.ts          // LLM setup
  - clientData.ts      // Mock or real client usage data
/prompts
  - nurturePrompt.ts         // System prompt for AI behavior
  - sopPrompt.ts             // SOP creator prompt
  - upsellPrompt.ts          // Prompt to identify and recommend upsells
  - trainingPrompt.ts        // Prompt to deliver or recommend training workflows
  - onboardingPrompt.ts      // Prompt to generate onboarding emails/sequences
  - followUpPrompt.ts        // Prompt for follow-up messages
  - emailPrompt.ts           // Universal email structure for tone and format
  - smsPrompt.ts             // Prompt for concise SMS reminders and messages
  - callPrompt.ts            // Prompt to prepare or simulate intelligent phone calls
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js (App Router)
- OpenAI API
- Tailwind CSS
- TypeScript

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
