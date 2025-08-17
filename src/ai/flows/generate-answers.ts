// This file holds the Genkit flow for generating answers based on a PDF document and a selected mode.

'use server';

/**
 * @fileOverview An AI agent that generates answers based on a PDF document and a selected mode.
 *
 * - generateAnswers - A function that handles the PDF question answering process.
 * - GenerateAnswersInput - The input type for the generateAnswers function.
 * - GenerateAnswersOutput - The return type for the generateAnswers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswersInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question to be answered from the PDF document.'),
  mode: z.string().describe('The mode to use for generating the answer.'),
});
export type GenerateAnswersInput = z.infer<typeof GenerateAnswersInputSchema>;

const GenerateAnswersOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the PDF document and selected mode.'),
});
export type GenerateAnswersOutput = z.infer<typeof GenerateAnswersOutputSchema>;

export async function generateAnswers(input: GenerateAnswersInput): Promise<GenerateAnswersOutput> {
  return generateAnswersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnswersPrompt',
  input: {schema: GenerateAnswersInputSchema},
  output: {schema: GenerateAnswersOutputSchema},
  prompt: `You are an expert at answering questions based on PDF documents.

You will use the following PDF document to answer the question, using the specified mode.

PDF Document: {{media url=pdfDataUri}}
Question: {{{question}}}
Mode: {{{mode}}}

Answer:`, // Modified to include the mode.
});

const generateAnswersFlow = ai.defineFlow(
  {
    name: 'generateAnswersFlow',
    inputSchema: GenerateAnswersInputSchema,
    outputSchema: GenerateAnswersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
