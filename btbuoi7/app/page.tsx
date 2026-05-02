"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormType } from "./schema";
import { registerUser } from "./actions";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur", // Validate ngay khi người dùng click ra ngoài input
  });

  const onSubmit = async (data: FormType) => {
    // Gọi hàm chạy ngầm trên Server
    const result = await registerUser(data);
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng ký thành viên</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Input Tên */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên</label>
            <input 
              {...register("name")} 
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Nhập tên của bạn" 
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              {...register("email")} 
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Nhập email" 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Input Mật khẩu */}
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input 
              type="password" 
              {...register("password")} 
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Ít nhất 8 ký tự, 1 chữ hoa, 1 số" 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Input Xác nhận Mật khẩu */}
          <div>
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              {...register("confirmPassword")} 
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Nhập lại mật khẩu" 
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Nút Submit */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </button>

        </form>
      </div>
    </main>
  );
}