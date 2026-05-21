<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function loadProducts(Request $request)
    {
        $search = $request->input('search');

        $products = Product::where('is_deleted', false)
            ->orderBy('name', 'asc')
            ->orderBy('size', 'asc');

        if ($search) {
            $products->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('size', 'like', "%{$search}%")
                    ->orWhere('unit', 'like', "%{$search}%");
            });
        }

        $products = $products->paginate(15);

        $products->getCollection()->transform(function ($product) {
            $product->image = $product->image
                ? url('storage/public/img/product/' . $product->image)
                : null;
            return $product;
        });

        return response()->json([
            'products' => $products
        ], 200);
    }

    public function getProduct(Product $product)
    {
        $product->image = $product->image
            ? url('storage/public/img/product/' . $product->image)
            : null;

        return response()->json([
            'product' => $product
        ], 200);
    }

    public function storeProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image'               => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'name'                => ['required', 'max:100'],
            'size'                => ['required', Rule::in(['500ml', '1L', '5gal', 'custom'])],
            'unit'                => ['required', 'max:30'],
            'price'               => ['required', 'numeric', 'min:0'],
            'price_per_liter'     => ['nullable', 'numeric', 'min:0'],
            'custom_volume_ml'    => ['nullable', 'integer', 'min:1', Rule::requiredIf($request->size === 'custom')],
            'container_deposit'   => ['nullable', 'numeric', 'min:0'],
            'stock'               => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['required', 'integer', 'min:1'],
            'is_available'        => ['nullable', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $imageFilename = null;
        if ($request->hasFile('image')) {
            $file           = $request->file('image');
            $filename       = pathinfo($file, PATHINFO_FILENAME);
            $extension      = $file->getClientOriginalExtension();
            $imageFilename  = sha1($filename . '_' . time() . '.' . $extension);
            $file->storeAs('public/img/product', $imageFilename);
        }

        Product::create([
            'image'               => $imageFilename,
            'name'                => $validated['name'],
            'size'                => $validated['size'],
            'unit'                => $validated['unit'],
            'price'               => $validated['price'],
            'price_per_liter'     => $validated['price_per_liter'] ?? 0.00,
            'custom_volume_ml'    => $validated['custom_volume_ml'] ?? null,
            'container_deposit'   => $validated['container_deposit'] ?? 0.00,
            'stock'               => $validated['stock'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
            'is_available'        => $validated['is_available'] ?? true,
        ]);

        return response()->json([
            'message' => 'Product Successfully Saved.'
        ], 200);
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'image'               => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'name'                => ['required', 'max:100'],
            'size'                => ['required', Rule::in(['500ml', '1L', '5gal', 'custom'])],
            'unit'                => ['required', 'max:30'],
            'price'               => ['required', 'numeric', 'min:0'],
            'price_per_liter'     => ['nullable', 'numeric', 'min:0'],
            'custom_volume_ml'    => ['nullable', 'integer', 'min:1', Rule::requiredIf($request->size === 'custom')],
            'container_deposit'   => ['nullable', 'numeric', 'min:0'],
            'stock'               => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['required', 'integer', 'min:1'],
            'is_available'        => ['nullable', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Handle image removal
        if ($request->has('remove_image') && $request->remove_image == '1') {
            if ($product->image && Storage::exists('public/img/product/' . $product->image)) {
                Storage::delete('public/img/product/' . $product->image);
            }
            $product->image = null;
        } elseif ($request->hasFile('image')) {
            // Delete old image first
            if ($product->image && Storage::exists('public/img/product/' . $product->image)) {
                Storage::delete('public/img/product/' . $product->image);
            }
            $file          = $request->file('image');
            $filename      = pathinfo($file, PATHINFO_FILENAME);
            $extension     = $file->getClientOriginalExtension();
            $imageFilename = sha1($filename . '_' . time() . '.' . $extension);
            $file->storeAs('public/img/product', $imageFilename);
            $product->image = $imageFilename;
        }

        $product->update([
            'image'               => $product->image,
            'name'                => $validated['name'],
            'size'                => $validated['size'],
            'unit'                => $validated['unit'],
            'price'               => $validated['price'],
            'price_per_liter'     => $validated['price_per_liter'] ?? $product->price_per_liter,
            'custom_volume_ml'    => $validated['custom_volume_ml'] ?? null,
            'container_deposit'   => $validated['container_deposit'] ?? $product->container_deposit,
            'stock'               => $validated['stock'],
            'low_stock_threshold' => $validated['low_stock_threshold'],
            'is_available'        => $validated['is_available'] ?? $product->is_available,
        ]);

        $product->image = $product->image
            ? url('storage/public/img/product/' . $product->image)
            : null;

        return response()->json([
            'message' => 'Product Successfully Updated.',
            'product' => $product
        ], 200);
    }

    public function toggleAvailable(Product $product)
    {
        $product->update([
            'is_available' => !$product->is_available
        ]);

        return response()->json([
            'message'      => 'Product Availability Updated.',
            'is_available' => $product->is_available
        ], 200);
    }

    public function destroyProduct(Product $product)
    {
        if ($product->image && Storage::exists('public/img/product/' . $product->image)) {
            Storage::delete('public/img/product/' . $product->image);
        }

        $product->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Product Successfully Deleted.'
        ], 200);
    }
}
