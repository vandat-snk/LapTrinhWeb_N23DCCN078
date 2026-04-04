export default function BlogDetail({ params }: any) {
  return (
    <div className="ml-5 mt-5">
      <h1 className="text-xl font-bold text-black">
        Chi tiết bài viết
      </h1>

      <p className="mt-2 text-black">
        Slug: <span className="text-blue-600">{params.slug}</span>
      </p>
    </div>
  );
}