"use server";

import { formSchema } from "./schema";

export async function registerUser(formData: unknown) {
  // Validate lại tại Server bằng safeParse
  const validatedFields = formSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { 
      success: false, 
      message: "Dữ liệu không hợp lệ từ Server!" 
    };
  }

  return { 
    success: true, 
    message: "Đăng ký thành công!" 
  };
}