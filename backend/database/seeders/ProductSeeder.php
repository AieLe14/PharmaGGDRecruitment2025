<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Paracétamol 500mg',
                'description' => 'Antalgique et antipyrétique. Soulage la douleur et fait baisser la fièvre.',
                'price' => 3.50,
                'image' => 'https://via.placeholder.com/300x200?text=Paracétamol',
                'stock' => 100,
                'is_active' => true,
                'category' => 'Antalgiques',
                'sku' => 'PARA-500-001'
            ],
            [
                'name' => 'Ibuprofène 400mg',
                'description' => 'Anti-inflammatoire non stéroïdien. Soulage la douleur et l\'inflammation.',
                'price' => 4.20,
                'image' => 'https://via.placeholder.com/300x200?text=Ibuprofène',
                'stock' => 75,
                'is_active' => true,
                'category' => 'Anti-inflammatoires',
                'sku' => 'IBUP-400-001'
            ],
            [
                'name' => 'Vitamine D3 1000 UI',
                'description' => 'Complément alimentaire pour renforcer les os et le système immunitaire.',
                'price' => 12.90,
                'image' => 'https://via.placeholder.com/300x200?text=Vitamine+D3',
                'stock' => 50,
                'is_active' => true,
                'category' => 'Vitamines',
                'sku' => 'VITD-1000-001'
            ],
            [
                'name' => 'Oméprazole 20mg',
                'description' => 'Inhibiteur de la pompe à protons. Traite les brûlures d\'estomac et les ulcères.',
                'price' => 8.75,
                'image' => 'https://via.placeholder.com/300x200?text=Oméprazole',
                'stock' => 60,
                'is_active' => true,
                'category' => 'Gastro-entérologie',
                'sku' => 'OMEP-20-001'
            ],
            [
                'name' => 'Loratadine 10mg',
                'description' => 'Antihistaminique non sédatif. Traite les allergies et le rhume des foins.',
                'price' => 6.30,
                'image' => 'https://via.placeholder.com/300x200?text=Loratadine',
                'stock' => 80,
                'is_active' => true,
                'category' => 'Allergies',
                'sku' => 'LORA-10-001'
            ],
            [
                'name' => 'Aspirine 500mg',
                'description' => 'Anti-inflammatoire et antalgique. Utilisé pour la douleur et la prévention cardiovasculaire.',
                'price' => 2.95,
                'image' => 'https://via.placeholder.com/300x200?text=Aspirine',
                'stock' => 120,
                'is_active' => true,
                'category' => 'Antalgiques',
                'sku' => 'ASPI-500-001'
            ],
            [
                'name' => 'Probiotiques Lactobacillus',
                'description' => 'Complément alimentaire pour restaurer la flore intestinale.',
                'price' => 15.40,
                'image' => 'https://via.placeholder.com/300x200?text=Probiotiques',
                'stock' => 30,
                'is_active' => true,
                'category' => 'Digestif',
                'sku' => 'PROB-LAC-001'
            ],
            [
                'name' => 'Magnésium Marin 300mg',
                'description' => 'Complément alimentaire pour réduire la fatigue et les crampes musculaires.',
                'price' => 9.80,
                'image' => 'https://via.placeholder.com/300x200?text=Magnésium',
                'stock' => 45,
                'is_active' => true,
                'category' => 'Minéraux',
                'sku' => 'MAGN-300-001'
            ]
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
