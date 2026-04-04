import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="ml-5 mt-5 text-3xl font-bold text-black">
        Trang chủ Blog
      </h1>

      <ul className="list-disc ml-10 mt-2 text-black">
        <li>
          <a href="/blog" className="text-blue-500 hover:underline">
            Danh sách bài viết
          </a>
        </li>
        <li>
          <a href="/categories" className="text-blue-500 hover:underline">
            Danh mục bài viết
          </a>
        </li>
      </ul>
    </div>
  );
}