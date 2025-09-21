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
            // Antalgiques
            [
                'name' => 'Paracétamol 500mg',
                'description' => 'Antalgique et antipyrétique. Soulage la douleur et fait baisser la fièvre.',
                'price' => 3.50,
                'image' => 'https://picsum.photos/300/200?text=Paracétamol',
                'stock' => 100,
                'is_active' => true,
                'category' => 'Antalgiques',
                'sku' => 'PARA-500-001'
            ],
            [
                'name' => 'Aspirine 500mg',
                'description' => 'Anti-inflammatoire et antalgique. Utilisé pour la douleur et la prévention cardiovasculaire.',
                'price' => 2.95,
                'image' => 'https://picsum.photos/300/200?text=Aspirine',
                'stock' => 120,
                'is_active' => true,
                'category' => 'Antalgiques',
                'sku' => 'ASPI-500-001'
            ],
            [
                'name' => 'Tramadol 50mg',
                'description' => 'Antalgique opioïde pour les douleurs modérées à sévères.',
                'price' => 7.80,
                'image' => 'https://picsum.photos/300/200?text=Tramadol',
                'stock' => 25,
                'is_active' => true,
                'category' => 'Antalgiques',
                'sku' => 'TRAM-50-001'
            ],
            [
                'name' => 'Codéine 30mg',
                'description' => 'Antalgique opioïde pour le traitement de la toux et de la douleur.',
                'price' => 5.20,
                'image' => 'https://picsum.photos/300/200?text=Codéine',
                'stock' => 40,
                'is_active' => true,
                'category' => 'Antalgiques',
                'sku' => 'CODE-30-001'
            ],

            // Anti-inflammatoires
            [
                'name' => 'Ibuprofène 400mg',
                'description' => 'Anti-inflammatoire non stéroïdien. Soulage la douleur et l\'inflammation.',
                'price' => 4.20,
                'image' => 'https://picsum.photos/300/200?text=Ibuprofène',
                'stock' => 75,
                'is_active' => true,
                'category' => 'Anti-inflammatoires',
                'sku' => 'IBUP-400-001'
            ],
            [
                'name' => 'Diclofénac 50mg',
                'description' => 'Anti-inflammatoire non stéroïdien pour les douleurs articulaires.',
                'price' => 6.50,
                'image' => 'https://picsum.photos/300/200?text=Diclofénac',
                'stock' => 35,
                'is_active' => true,
                'category' => 'Anti-inflammatoires',
                'sku' => 'DICL-50-001'
            ],
            [
                'name' => 'Naproxène 500mg',
                'description' => 'Anti-inflammatoire non stéroïdien à libération prolongée.',
                'price' => 8.90,
                'image' => 'https://picsum.photos/300/200?text=Naproxène',
                'stock' => 20,
                'is_active' => true,
                'category' => 'Anti-inflammatoires',
                'sku' => 'NAPR-500-001'
            ],

            // Vitamines
            [
                'name' => 'Vitamine D3 1000 UI',
                'description' => 'Complément alimentaire pour renforcer les os et le système immunitaire.',
                'price' => 12.90,
                'image' => 'https://picsum.photos/300/200?text=Vitamine+D3',
                'stock' => 50,
                'is_active' => true,
                'category' => 'Vitamines',
                'sku' => 'VITD-1000-001'
            ],
            [
                'name' => 'Vitamine C 1000mg',
                'description' => 'Complément alimentaire pour renforcer le système immunitaire.',
                'price' => 9.50,
                'image' => 'https://picsum.photos/300/200?text=Vitamine+C',
                'stock' => 80,
                'is_active' => true,
                'category' => 'Vitamines',
                'sku' => 'VITC-1000-001'
            ],
            [
                'name' => 'Vitamine B12 1000mcg',
                'description' => 'Complément alimentaire pour lutter contre la fatigue et l\'anémie.',
                'price' => 11.20,
                'image' => 'https://picsum.photos/300/200?text=Vitamine+B12',
                'stock' => 45,
                'is_active' => true,
                'category' => 'Vitamines',
                'sku' => 'VITB12-1000-001'
            ],
            [
                'name' => 'Multivitamines Complex',
                'description' => 'Complément alimentaire multivitaminé pour un apport complet.',
                'price' => 18.75,
                'image' => 'https://picsum.photos/300/200?text=Multivitamines',
                'stock' => 30,
                'is_active' => true,
                'category' => 'Vitamines',
                'sku' => 'MULTI-COMP-001'
            ],

            // Gastro-entérologie
            [
                'name' => 'Oméprazole 20mg',
                'description' => 'Inhibiteur de la pompe à protons. Traite les brûlures d\'estomac et les ulcères.',
                'price' => 8.75,
                'image' => 'https://picsum.photos/300/200?text=Oméprazole',
                'stock' => 60,
                'is_active' => true,
                'category' => 'Gastro-entérologie',
                'sku' => 'OMEP-20-001'
            ],
            [
                'name' => 'Lansoprazole 30mg',
                'description' => 'Inhibiteur de la pompe à protons pour le traitement des troubles gastriques.',
                'price' => 9.40,
                'image' => 'https://picsum.photos/300/200?text=Lansoprazole',
                'stock' => 35,
                'is_active' => true,
                'category' => 'Gastro-entérologie',
                'sku' => 'LANS-30-001'
            ],
            [
                'name' => 'Probiotiques Lactobacillus',
                'description' => 'Complément alimentaire pour restaurer la flore intestinale.',
                'price' => 15.40,
                'image' => 'https://picsum.photos/300/200?text=Probiotiques',
                'stock' => 30,
                'is_active' => true,
                'category' => 'Gastro-entérologie',
                'sku' => 'PROB-LAC-001'
            ],

            // Allergies
            [
                'name' => 'Loratadine 10mg',
                'description' => 'Antihistaminique non sédatif. Traite les allergies et le rhume des foins.',
                'price' => 6.30,
                'image' => 'https://picsum.photos/300/200?text=Loratadine',
                'stock' => 80,
                'is_active' => true,
                'category' => 'Allergies',
                'sku' => 'LORA-10-001'
            ],
            [
                'name' => 'Cétirizine 10mg',
                'description' => 'Antihistaminique pour le traitement des allergies saisonnières.',
                'price' => 5.80,
                'image' => 'https://picsum.photos/300/200?text=Cétirizine',
                'stock' => 65,
                'is_active' => true,
                'category' => 'Allergies',
                'sku' => 'CETI-10-001'
            ],
            [
                'name' => 'Fexofénadine 120mg',
                'description' => 'Antihistaminique de nouvelle génération pour les allergies.',
                'price' => 7.20,
                'image' => 'https://picsum.photos/300/200?text=Fexofénadine',
                'stock' => 40,
                'is_active' => true,
                'category' => 'Allergies',
                'sku' => 'FEXO-120-001'
            ],

            // Minéraux
            [
                'name' => 'Magnésium Marin 300mg',
                'description' => 'Complément alimentaire pour réduire la fatigue et les crampes musculaires.',
                'price' => 9.80,
                'image' => 'https://picsum.photos/300/200?text=Magnésium',
                'stock' => 45,
                'is_active' => true,
                'category' => 'Minéraux',
                'sku' => 'MAGN-300-001'
            ],
            [
                'name' => 'Fer 14mg',
                'description' => 'Complément alimentaire pour lutter contre l\'anémie ferriprive.',
                'price' => 6.90,
                'image' => 'https://picsum.photos/300/200?text=Fer',
                'stock' => 55,
                'is_active' => true,
                'category' => 'Minéraux',
                'sku' => 'FER-14-001'
            ],
            [
                'name' => 'Zinc 15mg',
                'description' => 'Complément alimentaire pour renforcer le système immunitaire.',
                'price' => 8.40,
                'image' => 'https://picsum.photos/300/200?text=Zinc',
                'stock' => 35,
                'is_active' => true,
                'category' => 'Minéraux',
                'sku' => 'ZINC-15-001'
            ],

            // Cardiologie
            [
                'name' => 'Atorvastatine 20mg',
                'description' => 'Statine pour réduire le cholestérol et prévenir les maladies cardiovasculaires.',
                'price' => 12.50,
                'image' => 'https://picsum.photos/300/200?text=Atorvastatine',
                'stock' => 25,
                'is_active' => true,
                'category' => 'Cardiologie',
                'sku' => 'ATOR-20-001'
            ],
            [
                'name' => 'Amlodipine 5mg',
                'description' => 'Inhibiteur calcique pour le traitement de l\'hypertension artérielle.',
                'price' => 10.80,
                'image' => 'https://picsum.photos/300/200?text=Amlodipine',
                'stock' => 30,
                'is_active' => true,
                'category' => 'Cardiologie',
                'sku' => 'AMLO-5-001'
            ],

            // Dermatologie
            [
                'name' => 'Hydrocortisone 1%',
                'description' => 'Corticoïde topique pour traiter les inflammations cutanées.',
                'price' => 4.60,
                'image' => 'https://picsum.photos/300/200?text=Hydrocortisone',
                'stock' => 70,
                'is_active' => true,
                'category' => 'Dermatologie',
                'sku' => 'HYDR-1-001'
            ],
            [
                'name' => 'Bétaméthasone 0.05%',
                'description' => 'Corticoïde topique puissant pour les dermatoses sévères.',
                'price' => 7.90,
                'image' => 'https://picsum.photos/300/200?text=Bétaméthasone',
                'stock' => 20,
                'is_active' => true,
                'category' => 'Dermatologie',
                'sku' => 'BETA-0.05-001'
            ],

            // Produits inactifs pour tester les filtres
            [
                'name' => 'Produit Inactif Test',
                'description' => 'Ce produit est inactif et ne devrait pas apparaître dans les résultats publics.',
                'price' => 99.99,
                'image' => 'https://picsum.photos/300/200?text=Inactif',
                'stock' => 0,
                'is_active' => false,
                'category' => 'Test',
                'sku' => 'INACTIF-001'
            ]
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
