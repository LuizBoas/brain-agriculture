<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Producer;
use App\Models\Farm;
use App\Models\Harvest;
use App\Models\Crop;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PopulateFakeDataSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🧹 Limpando dados existentes (exceto administradores)...');

        // Limpar dados na ordem correta (respeitando foreign keys)
        DB::table('crops')->delete();
        DB::table('harvests')->delete();
        DB::table('farms')->delete();
        DB::table('producers')->delete();

        $this->command->info('✅ Dados limpos!');
        $this->command->info('📦 Criando dados fake...');

        // Buscar um usuário admin para associar aos produtores
        $adminUser = User::first();
        if (!$adminUser) {
            $this->command->error('❌ Nenhum usuário admin encontrado! Execute DatabaseSeeder primeiro.');
            return;
        }

        // Estados brasileiros
        $states = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
            'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
            'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ];

        // Cidades brasileiras (algumas exemplos)
        $cities = [
            'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador',
            'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Goiânia',
            'Campinas', 'Campina Grande', 'João Pessoa', 'Aracaju', 'Maceió',
            'Natal', 'Teresina', 'São Luís', 'Belém', 'Manaus',
            'Cuiabá', 'Florianópolis', 'Vitória', 'Rio Branco', 'Macapá',
            'Boa Vista', 'Palmas', 'Porto Velho'
        ];

        // Culturas comuns no Brasil
        $crops = [
            'Soja', 'Milho', 'Café', 'Cana-de-açúcar', 'Algodão',
            'Trigo', 'Arroz', 'Feijão', 'Mamona', 'Girassol',
            'Tomate', 'Batata', 'Cebola', 'Cenoura', 'Abóbora',
            'Banana', 'Laranja', 'Limão', 'Manga', 'Uva',
            'Cacau', 'Açaí', 'Coco', 'Abacaxi', 'Melancia'
        ];

        // Criar 20 produtores
        $producers = [];
        for ($i = 0; $i < 20; $i++) {
            $isCpf = fake()->boolean(70); // 70% CPF, 30% CNPJ
            
            if ($isCpf) {
                $document = $this->generateCPF();
                $documentType = 'CPF';
            } else {
                $document = $this->generateCNPJ();
                $documentType = 'CNPJ';
            }

            $producer = Producer::create([
                'document' => $document,
                'document_type' => $documentType,
                'name' => fake()->name(),
                'created_by' => $adminUser->id,
            ]);

            $producers[] = $producer;
        }

        $this->command->info("✅ Criados " . count($producers) . " produtores");

        // Criar fazendas para cada produtor (1-3 fazendas por produtor)
        $farms = [];
        foreach ($producers as $producer) {
            $numFarms = fake()->numberBetween(1, 3);
            
            for ($j = 0; $j < $numFarms; $j++) {
                $totalArea = fake()->randomFloat(2, 10, 5000); // 10 a 5000 hectares
                $arableArea = fake()->randomFloat(2, 5, $totalArea * 0.9); // Até 90% da área total
                $vegetationArea = $totalArea - $arableArea; // O restante é vegetação

                $farm = Farm::create([
                    'producer_id' => $producer->id,
                    'name' => fake()->company() . ' - ' . fake()->words(2, true),
                    'city' => fake()->randomElement($cities),
                    'state' => fake()->randomElement($states),
                    'total_area' => $totalArea,
                    'arable_area' => $arableArea,
                    'vegetation_area' => $vegetationArea,
                ]);

                $farms[] = $farm;
            }
        }

        $this->command->info("✅ Criadas " . count($farms) . " fazendas");

        // Criar safras para cada fazenda (1-4 safras por fazenda)
        $harvests = [];
        foreach ($farms as $farm) {
            $numHarvests = fake()->numberBetween(1, 4);
            
            // Gerar anos diferentes para cada safra (últimos 5 anos)
            $years = [];
            for ($k = 0; $k < $numHarvests; $k++) {
                $year = fake()->numberBetween(2020, 2024);
                while (in_array($year, $years)) {
                    $year = fake()->numberBetween(2020, 2024);
                }
                $years[] = $year;
            }

            foreach ($years as $year) {
                $harvest = Harvest::create([
                    'farm_id' => $farm->id,
                    'year' => (string)$year,
                ]);

                $harvests[] = $harvest;

                // Criar 1-4 culturas por safra
                $numCrops = fake()->numberBetween(1, 4);
                $selectedCrops = fake()->randomElements($crops, min($numCrops, count($crops)));

                foreach ($selectedCrops as $cropName) {
                    Crop::create([
                        'harvest_id' => $harvest->id,
                        'name' => $cropName,
                    ]);
                }
            }
        }

        $this->command->info("✅ Criadas " . count($harvests) . " safras");
        
        $totalCrops = Crop::count();
        $this->command->info("✅ Criadas {$totalCrops} culturas");

        $this->command->info('');
        $this->command->info('🎉 Sistema populado com sucesso!');
        $this->command->info("📊 Resumo:");
        $this->command->info("   - Produtores: " . Producer::count());
        $this->command->info("   - Fazendas: " . Farm::count());
        $this->command->info("   - Safras: " . Harvest::count());
        $this->command->info("   - Culturas: " . Crop::count());
    }

    /**
     * Gera um CPF válido (fictício)
     */
    private function generateCPF(): string
    {
        $n1 = fake()->numberBetween(100, 999);
        $n2 = fake()->numberBetween(100, 999);
        $n3 = fake()->numberBetween(100, 999);
        $d1 = fake()->numberBetween(0, 9);
        $d2 = fake()->numberBetween(0, 9);
        
        return sprintf('%03d.%03d.%03d-%02d', $n1, $n2, $n3, $d1, $d2);
    }

    /**
     * Gera um CNPJ válido (fictício)
     */
    private function generateCNPJ(): string
    {
        $n1 = fake()->numberBetween(10, 99);
        $n2 = fake()->numberBetween(100, 999);
        $n3 = fake()->numberBetween(100, 999);
        $n4 = fake()->numberBetween(1000, 9999);
        $d1 = fake()->numberBetween(0, 9);
        $d2 = fake()->numberBetween(0, 9);
        
        return sprintf('%02d.%03d.%03d/%04d-%02d', $n1, $n2, $n3, $n4, $d1, $d2);
    }
}

