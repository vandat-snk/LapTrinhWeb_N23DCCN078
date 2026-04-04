export default function BlogPage() {
  return (
    <div className="ml-5 mt-5">
      <h1 className="text-xl font-bold text-black">
        Danh sách bài viết
      </h1>

      <ul className="mt-2 text-blue-600">
        <li>
          <a href="/blog/bai-viet-1" className="hover:underline">
            Bài viết 1
          </a>
        </li>
        <li>
          <a href="/blog/bai-viet-2" className="hover:underline">
            Bài viết 2
          </a>
        </li>
      </ul>
    </div>
  );
}