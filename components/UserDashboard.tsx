"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

type Product = {
  id: string
  nama_produk: string
  harga_satuan: number
  quantity: number
}

export default function UserDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState<number | "">("")
  const [maxPrice, setMaxPrice] = useState<number | "">("")
  const [minQty, setMinQty] = useState<number | "">("")
  const [maxQty, setMaxQty] = useState<number | "">("")

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*")
      if (data) setProducts(data)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchName = p.nama_produk.toLowerCase().includes(search.toLowerCase())
    const matchPrice =
      (minPrice === "" || p.harga_satuan >= minPrice) && (maxPrice === "" || p.harga_satuan <= maxPrice)
    const matchQty = (minQty === "" || p.quantity >= minQty) && (maxQty === "" || p.quantity <= maxQty)
    return matchName && matchPrice && matchQty
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-xl shadow-md text-blue-800 font-semibold">
          Total Produk: {products.length}
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow-md text-green-800 font-semibold">
          Total Stok: {products.reduce((a, b) => a + b.quantity, 0)}
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow-md text-yellow-800 font-semibold">
          Total Nilai: Rp {products.reduce((a, b) => a + b.harga_satuan * b.quantity, 0).toLocaleString()}
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Cari Produk.."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="number"
            placeholder="Harga Min."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Harga Max."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Qty Min."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Qty Max."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {filteredProducts.length === 0 ? (
          <p className="text-center py-6 text-gray-500">Tidak ada produk ditemukan.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-4 text-left text-gray-700 font-medium">Nama Produk</th>
                <th className="p-4 text-left text-gray-700 font-medium">Harga Satuan</th>
                <th className="p-4 text-left text-gray-700 font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                >
                  <td className="p-4 border-t border-gray-200">{product.nama_produk}</td>
                  <td className="p-4 border-t border-gray-200">Rp {product.harga_satuan.toLocaleString()}</td>
                  <td className="p-4 border-t border-gray-200">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
