"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

type Product = {
  id: string
  nama_produk: string
  harga_satuan: number
  quantity: number
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ nama_produk: "", harga_satuan: 0, quantity: 0 })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState<number | "">("")
  const [maxPrice, setMaxPrice] = useState<number | "">("")
  const [minQty, setMinQty] = useState<number | "">("")
  const [maxQty, setMaxQty] = useState<number | "">("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*")
    if (error) {
      console.error("Failed to fetch products:", error.message)
    }
    if (data) setProducts(data)
  }

  const handleCreate = async () => {
    const { error } = await supabase.from("products").insert([newProduct])
    if (!error) {
      fetchProducts()
      setNewProduct({ nama_produk: "", harga_satuan: 0, quantity: 0 })
    }
  }

  const handleUpdate = async () => {
    if (!editingProduct) return
    const { error } = await supabase
      .from("products")
      .update({
        nama_produk: editingProduct.nama_produk,
        harga_satuan: editingProduct.harga_satuan,
        quantity: editingProduct.quantity
      })
      .eq("id", editingProduct.id)
    if (!error) {
      fetchProducts()
      setEditingProduct(null)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (!error) fetchProducts()
  }

  const filteredProducts = products.filter((p) => {
    const matchName = p.nama_produk.toLowerCase().includes(search.toLowerCase())
    const matchPrice =
      (minPrice === "" || p.harga_satuan >= minPrice) && (maxPrice === "" || p.harga_satuan <= maxPrice)
    const matchQty = (minQty === "" || p.quantity >= minQty) && (maxQty === "" || p.quantity <= maxQty)
    return matchName && matchPrice && matchQty
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h2>
      <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nama Produk"
            value={newProduct.nama_produk}
            onChange={(e) => setNewProduct({ ...newProduct, nama_produk: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Harga Satuan"
            value={newProduct.harga_satuan || ""}
            onChange={(e) => setNewProduct({ ...newProduct, harga_satuan: Number(e.target.value) })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.quantity || ""}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
            className="input-field"
          />
        </div>
        <button onClick={handleCreate} className="btn-primary mt-4 cursor-pointer">
          Add Product
        </button>
      </div>
      {editingProduct && (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Edit Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={editingProduct.nama_produk}
              onChange={(e) => setEditingProduct({ ...editingProduct, nama_produk: e.target.value })}
              className="input-field"
            />
            <input
              type="number"
              value={editingProduct.harga_satuan}
              onChange={(e) => setEditingProduct({ ...editingProduct, harga_satuan: Number(e.target.value) })}
              className="input-field"
            />
            <input
              type="number"
              value={editingProduct.quantity}
              onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
              className="input-field"
            />
          </div>
          <div className="mt-4 space-x-2">
            <button onClick={handleUpdate} className="btn-primary cursor-pointer">
              Save
            </button>
            <button onClick={() => setEditingProduct(null)} className="btn-secondary cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

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
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left text-gray-600 font-semibold">Nama Produk</th>
              <th className="p-4 text-left text-gray-600 font-semibold">Harga Satuan</th>
              <th className="p-4 text-left text-gray-600 font-semibold">Quantity</th>
              <th className="p-4 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr
                key={product.id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
              >
                <td className="p-4 border-t border-gray-200">{product.nama_produk}</td>
                <td className="p-4 border-t border-gray-200">Rp {product.harga_satuan.toLocaleString()}</td>
                <td className="p-4 border-t border-gray-200">{product.quantity}</td>
                <td className="p-4 border-t border-gray-200 space-x-2">
                  <button onClick={() => setEditingProduct(product)} className="btn-warning cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="btn-danger cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
