async function getProduct() {
  const res = await fetch(
    "https://dummyjson.com/products/category/mens-shirts",
    { cache: "no-store" }
  );

  const data = await res.json();
  const products = data.products;

  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}

export default async function Home() {
  const product = await getProduct();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      {/* 👉 block center cả title + card */}
      <div className="flex flex-col items-center">
        
        {/* title */}
        <h1 className="text-xl font-bold mb-3">
          Fashion Trending 2026
        </h1>

        {/* card */}
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-80 overflow-hidden">
          
          {/* ảnh - nền xám */}
          <div className="bg-gray-100">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-64 object-contain p-4"
            />
          </div>

          {/* content */}
          <div className="p-4">
            
            <div className="flex items-center justify-between">
              <span className="bg-blue-50 text-blue-500 text-xs font-semibold px-3 py-1 rounded-full">
                New Arrival
              </span>

              <p className="text-red-500 font-bold">
                ${product.price}
              </p>
            </div>

            <h2 className="font-semibold mt-2 text-left">
              {product.title}
            </h2>

            <button className="mt-3 bg-black text-white px-4 py-2 rounded-lg w-full">
              Thêm vào giỏ hàng
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}