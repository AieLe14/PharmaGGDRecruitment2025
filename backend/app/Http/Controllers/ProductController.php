<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        // Filter by active status
        if ($request->has('active_only') && $request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->get('category'));
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'category' => 'nullable|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Produit créé avec succès',
            'product' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $admin = auth()->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|string|max:255',
            'stock' => 'sometimes|required|integer|min:0',
            'is_active' => 'boolean',
            'category' => 'nullable|string|max:255',
            'sku' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'sku')->ignore($product->id)
            ],
        ]);

        // Vérifier les permissions pour la modification du prix
        if (isset($validated['price']) && $validated['price'] != $product->price) {
            $canUpdatePrice = $admin->role && (
                $admin->role->all_permissions || 
                $admin->role->permissions()->where('code', 'products.price.update')->exists()
            );

            if (!$canUpdatePrice) {
                return response()->json([
                    'error' => 'Vous n\'avez pas la permission de modifier les prix',
                    'required_permission' => 'products.price.update'
                ], 403);
            }
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Produit mis à jour avec succès',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès'
        ]);
    }
}
