'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for the form data
const formSchema = z.object({
  quantity: z.number().int().positive(),
  discountAmount: z.number().min(0),
  studentGraduateId: z.number().int().positive(),
  token: z.string().min(1),
});

type CreateStudentQuotesParams = z.infer<typeof formSchema>;

export async function createStudentQuotesAction(formData: FormData) {
  // Parse and validate the form data
  const validatedData = formSchema.parse({
    quantity: parseInt(formData.get('quantity') as string),
    discountAmount: parseFloat(formData.get('discountAmount') as string),
    studentGraduateId: parseInt(formData.get('studentGraduateId') as string),
    token: formData.get('token'),
  });

  try {
    const result = await CreateStudentQuotes(validatedData);
    if (!result) {
      throw new Error('Failed to create student quotes');
    }
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      throw new Error('Invalid form data');
    }
    console.error('Error creating student quotes:', error);
    throw error;
  }
}

async function CreateStudentQuotes({
  quantity,
  discountAmount,
  studentGraduateId,
  token,
}: CreateStudentQuotesParams) {
  const body = {
    quantity,
    discountAmount,
    studentGraduateId,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quota/graduate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create quota: ${response.statusText}`);
    }

    const quotaGraduate = await response.json();
    console.log("Quota created:", quotaGraduate);
    revalidatePath(`/advice-dashboard/graduate`);
    return quotaGraduate;
  } catch (error) {
    console.error("Error creating quota graduate", error);
    throw error;
  }
}