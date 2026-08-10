<?php

namespace Database\Seeders;

use App\Models\GalleryImage;
use App\Models\HeroSlide;
use App\Models\OpeningHour;
use App\Models\Promotion;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@sopheanaildesign.ch'],
            [
                'name' => 'Sophea Admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        $settings = [
            'business_name' => 'Sophea Naildesign',
            'phone' => '079 827 94 98',
            'phone_intl' => '+41 79 827 94 98',
            'address_line1' => 'Marktgasse 58',
            'address_line2' => '8440 Winterthur',
            'website_url' => 'www.naildesign-sophea.ch',
            'instagram' => 'https://www.instagram.com/sopheanaildesign',
            'facebook' => 'https://www.facebook.com/sopheanaildesign',
            'instagram_handle' => '@sopheanaildesign',
            'instagram_posts' => '142',
            'instagram_followers' => '138',
            'instagram_following' => '570',
            'hero_tagline' => 'WENN ES UM PERFEKTE NÄGEL GEHT',
            'about_title' => 'Warum Sophea Naildesign',
            'about_subtitle' => 'Gepflegte Hände stehen im Mittelpunkt',
            'about_body' => "Oft ist der erste Eindruck entscheidend. Auf den Blick in das Gesicht folgt ein Blick auf die Hände.\n\nGepflegte Hände verraten viel über eine Person. Die Hände ermöglichen uns den Alltag zu bestreiten, denn alles was wir am Tag geleistet haben, ist oftmals nur möglich durch unsere Hände. Schöne Hände zeigen Klarheit und Souveränität im Leben.",
            'about_me_title' => 'Über Mich',
            'about_me_subtitle' => 'Die richtige Pflege gibt Dir Sicherheit',
            'about_me_body' => "Ich beschränke die Maniküre nicht nur auf die Nägel. Die Pflege der Haut ist ebenso wichtig. Durch meine mehr als 25-jährige Erfahrung kann ich Damen und Herren umfassende Wellnessbehandlungen für Hände und Füße bieten.\n\nNach der Entfernung des alten Lacks kommen die Hände in ein Bad, das nicht nur die Nagelhaut löst, sondern auch die Haut pflegt und widerstandsfähiger gegen Umwelteinflüsse macht. Vor dem Auftragen des neuen Nageldesigns feile ich Deine Nägel in die optimale Form.",
            'study_label' => 'ÜBERRASCHENDE STUDIE',
            'study_title' => 'DARUM SOLLTEST DU ÖFTER INS NAGELSTUDIO GEHEN',
            'study_body' => 'Diejenigen, die regelmäßig eine Maniküre genießen, sind sich des Effekts bewusst: Ein Besuch im Nagelstudio kann selbst den schlechtesten Tag aufhellen und zu einem positiven Erlebnis machen. Eine kürzlich durchgeführte Studie hat nun wissenschaftlich bestätigt, dass dieser Effekt real ist.',
            'promotions_heading' => 'PREIS REDUKTION NUR FÜR KURZE ZEIT!',
            'social_heading' => 'FOLGEN SIE UNS AUF INSTAGRAM UND FACEBOOK @SOPHEA NAILDESIGN',
            'copyright' => '© 2023 Sophea Naildesign. All rights reserved.',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::putValue($key, $value);
        }

        HeroSlide::query()->delete();
        foreach ([
            ['title' => 'Salon Interior', 'image_path' => '/images/hero/nail-studio.jpg', 'sort_order' => 1],
            ['title' => 'Nail Art', 'image_path' => '/images/about/nail-art.jpg', 'sort_order' => 2],
            ['title' => 'Studio', 'image_path' => '/images/hero/nail-studio-2.jpg', 'sort_order' => 3],
        ] as $slide) {
            HeroSlide::query()->create($slide + ['is_active' => true]);
        }

        ServiceCategory::query()->delete();

        $categories = [
            [
                'name' => 'Maniküre/Hände',
                'subtitle' => 'Damen/Herren',
                'slug' => 'manikuere-haende',
                'sort_order' => 1,
                'services' => [
                    ['name' => 'Maniküre', 'price' => 39],
                    ['name' => 'Maniküre mit Lack', 'price' => 45],
                    ['name' => 'Maniküre mit Shellac', 'price' => 55],
                    ['name' => 'Permanent Makeup H/F', 'price' => 69, 'is_from_price' => true],
                ],
            ],
            [
                'name' => 'Extras',
                'subtitle' => null,
                'slug' => 'extras',
                'sort_order' => 2,
                'services' => [
                    ['name' => 'Ablösen Shellac', 'price' => 30, 'is_from_price' => true],
                    ['name' => 'Ablösen Gel/Acryl', 'price' => 35, 'is_from_price' => true],
                    ['name' => 'Piercing', 'price' => 25],
                    ['name' => 'Strassstein', 'price' => 3],
                    ['name' => 'Design pro Nagel', 'price' => 5, 'is_from_price' => true],
                    ['name' => 'Chrom/Farbe/Glitzer', 'price' => 8],
                ],
            ],
            [
                'name' => 'Pulver-Gel-Acryl System',
                'subtitle' => null,
                'slug' => 'pulver-gel-acryl',
                'sort_order' => 3,
                'services' => [
                    ['name' => 'Neuset Ombre/French', 'price' => 89],
                    ['name' => 'Auffüllen Ombre/French', 'price' => 69],
                    ['name' => 'Abgebrochener Nagel', 'price' => 8, 'price_prefix' => '+'],
                ],
            ],
            [
                'name' => 'Pediküre/Füsse',
                'subtitle' => 'Damen/Herren',
                'slug' => 'pedikuere-fuesse',
                'sort_order' => 4,
                'services' => [
                    ['name' => 'Water-Pediküre', 'price' => 55],
                    ['name' => 'Water-Pediküre mit Lack', 'price' => 65],
                    ['name' => 'Water-Pediküre mit Shellac', 'price' => 75],
                    ['name' => 'Trocken-Pediküre', 'price' => 49],
                    ['name' => 'Trocken-Pediküre mit Shellac', 'price' => 69],
                ],
            ],
            [
                'name' => 'Reparatur',
                'subtitle' => null,
                'slug' => 'reparatur',
                'sort_order' => 5,
                'services' => [
                    ['name' => 'Nagelreparatur', 'price' => 10, 'is_from_price' => true],
                ],
            ],
            [
                'name' => 'Zehen Neumodellage',
                'subtitle' => null,
                'slug' => 'zehen-neumodellage',
                'sort_order' => 6,
                'services' => [
                    ['name' => 'Neuset ohne Farbe', 'price' => 79],
                    ['name' => 'Neuset/Auffüllen mit Shellac', 'price' => 90],
                    ['name' => 'Hand/Fuss/Schulter massage 10min', 'price' => 15],
                ],
            ],
        ];

        foreach ($categories as $catData) {
            $services = $catData['services'];
            unset($catData['services']);
            $category = ServiceCategory::query()->create($catData + ['is_active' => true]);

            foreach ($services as $index => $service) {
                Service::query()->create([
                    'service_category_id' => $category->id,
                    'name' => $service['name'],
                    'price' => $service['price'],
                    'is_from_price' => $service['is_from_price'] ?? false,
                    'price_prefix' => $service['price_prefix'] ?? null,
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]);
            }
        }

        Promotion::query()->delete();
        foreach ([
            [
                'title' => 'NEUSET',
                'highlight' => 'VERSTÄRKUNG',
                'price' => 69,
                'header_style' => 'dark',
                'image_path' => '/images/promotions/nail1.png',
                'sort_order' => 1,
            ],
            [
                'title' => 'WATER-PEDIKÜRE',
                'highlight' => 'OHNE LACK',
                'price' => 69,
                'header_style' => 'pink',
                'is_featured' => true,
                'image_path' => '/images/promotions/pedi2.png',
                'sort_order' => 2,
            ],
            [
                'title' => 'TROCKEN-PEDIKÜRE',
                'highlight' => 'MIT SHELLAC',
                'price' => 50,
                'header_style' => 'dark',
                'image_path' => '/images/promotions/pedi1.png',
                'sort_order' => 3,
            ],
        ] as $promo) {
            Promotion::query()->create($promo + [
                'currency' => 'CHF',
                'description' => 'Profitieren Sie Heute noch von den Preisreduktion. Spitzenleistung zu unschlagbaren Preis.',
                'is_active' => true,
                'is_featured' => $promo['is_featured'] ?? false,
            ]);
        }

        OpeningHour::query()->delete();
        foreach ([
            ['day_label' => 'Montag', 'hours' => '09:00 – 19:00', 'sort_order' => 1],
            ['day_label' => 'Dienstag', 'hours' => '09:30 – 19:00', 'sort_order' => 2],
            ['day_label' => 'Mittwoch', 'hours' => '09:00 – 19:00', 'sort_order' => 3],
            ['day_label' => 'Donnerstag', 'hours' => '09:30 – 19:00', 'sort_order' => 4],
            ['day_label' => 'Freitag', 'hours' => '09:00 – 19:00', 'sort_order' => 5],
            ['day_label' => 'Samstag', 'hours' => '09:00 – 17:00', 'sort_order' => 6],
        ] as $hour) {
            OpeningHour::query()->create($hour + ['is_active' => true]);
        }

        GalleryImage::query()->delete();
        for ($i = 1; $i <= 8; $i++) {
            GalleryImage::query()->create([
                'title' => "Nail Design {$i}",
                'image_path' => "/images/gallery/nail-{$i}.jpg",
                'alt_text' => 'Sophea Naildesign Nail Art',
                'sort_order' => $i,
                'is_active' => true,
            ]);
        }
    }
}
