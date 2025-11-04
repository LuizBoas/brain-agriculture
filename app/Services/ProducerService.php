<?php

namespace App\Services;

use App\Models\Producer;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProducerService
{
    protected FarmService $farmService;

    public function __construct(FarmService $farmService)
    {
        $this->farmService = $farmService;
    }

    /**
     * Valida documento (CPF/CNPJ)
     */
    public function validateDocument(string $document, string $documentType): string
    {
        // Remove caracteres não numéricos
        $cleanDocument = preg_replace('/[^0-9]/', '', $document);

        if ($documentType === 'CPF') {
            if (strlen($cleanDocument) !== 11) {
                throw ValidationException::withMessages([
                    'document' => 'CPF inválido. Deve conter 11 dígitos.'
                ]);
            }

            if (!$this->validateCPF($cleanDocument)) {
                throw ValidationException::withMessages([
                    'document' => 'CPF inválido. Verifique os dígitos informados.'
                ]);
            }
        }

        if ($documentType === 'CNPJ') {
            if (strlen($cleanDocument) !== 14) {
                throw ValidationException::withMessages([
                    'document' => 'CNPJ inválido. Deve conter 14 dígitos.'
                ]);
            }

            if (!$this->validateCNPJ($cleanDocument)) {
                throw ValidationException::withMessages([
                    'document' => 'CNPJ inválido. Verifique os dígitos informados.'
                ]);
            }
        }

        return $cleanDocument;
    }

    /**
     * Valida CPF verificando dígitos verificadores
     */
    private function validateCPF(string $cpf): bool
    {
        // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
        $firstDigit = $cpf[0];
        $allSame = true;
        for ($i = 1; $i < 11; $i++) {
            if ($cpf[$i] !== $firstDigit) {
                $allSame = false;
                break;
            }
        }
        if ($allSame) {
            return false;
        }

        // Valida primeiro dígito verificador
        $sum = 0;
        for ($i = 0; $i < 9; $i++) {
            $sum += (int) $cpf[$i] * (10 - $i);
        }
        $remainder = $sum % 11;
        $digit1 = $remainder < 2 ? 0 : 11 - $remainder;

        if ((int) $cpf[9] !== $digit1) {
            return false;
        }

        // Valida segundo dígito verificador
        $sum = 0;
        for ($i = 0; $i < 10; $i++) {
            $sum += (int) $cpf[$i] * (11 - $i);
        }
        $remainder = $sum % 11;
        $digit2 = $remainder < 2 ? 0 : 11 - $remainder;

        if ((int) $cpf[10] !== $digit2) {
            return false;
        }

        return true;
    }

    /**
     * Valida CNPJ verificando dígitos verificadores
     */
    private function validateCNPJ(string $cnpj): bool
    {
        // Verifica se todos os dígitos são iguais (ex: 00.000.000/0000-00)
        $firstDigit = $cnpj[0];
        $allSame = true;
        for ($i = 1; $i < 14; $i++) {
            if ($cnpj[$i] !== $firstDigit) {
                $allSame = false;
                break;
            }
        }
        if ($allSame) {
            return false;
        }

        // Valida primeiro dígito verificador
        $weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        $sum = 0;
        for ($i = 0; $i < 12; $i++) {
            $sum += (int) $cnpj[$i] * $weights1[$i];
        }
        $remainder = $sum % 11;
        $digit1 = $remainder < 2 ? 0 : 11 - $remainder;

        if ((int) $cnpj[12] !== $digit1) {
            return false;
        }

        // Valida segundo dígito verificador
        $weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        $sum = 0;
        for ($i = 0; $i < 13; $i++) {
            $sum += (int) $cnpj[$i] * $weights2[$i];
        }
        $remainder = $sum % 11;
        $digit2 = $remainder < 2 ? 0 : 11 - $remainder;

        if ((int) $cnpj[13] !== $digit2) {
            return false;
        }

        return true;
    }

    /**
     * Verifica se já existe um produtor com o documento
     */
    public function documentExists(string $document, string $documentType, ?string $excludeId = null): bool
    {
        $query = Producer::where('document', $document)
            ->where('document_type', $documentType);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Valida dados do produtor
     */
    public function validateProducerData(array $producerData, bool $includeFarms = true): array
    {
        $rules = [
            'document' => 'required|string',
            'document_type' => 'required|in:CPF,CNPJ',
            'name' => 'required|string|max:255',
        ];

        if ($includeFarms) {
            $rules['farms'] = 'nullable|array';
            $rules['farms.*.name'] = 'required_with:farms|string|max:255';
            $rules['farms.*.city'] = 'required_with:farms|string|max:255';
            $rules['farms.*.state'] = 'required_with:farms|string|size:2';
            $rules['farms.*.total_area'] = 'required_with:farms|numeric|min:0';
            $rules['farms.*.arable_area'] = 'required_with:farms|numeric|min:0';
            $rules['farms.*.vegetation_area'] = 'required_with:farms|numeric|min:0';
            $rules['farms.*.harvests'] = 'nullable|array';
            $rules['farms.*.harvests.*.year'] = 'required_with:farms.*.harvests|string|regex:/^\d{4}$/';
            $rules['farms.*.harvests.*.crops'] = 'nullable|array';
            $rules['farms.*.harvests.*.crops.*'] = 'required|string|max:255';
        }

        $validator = Validator::make($producerData, $rules, [
            'farms.*.harvests.*.year.regex' => 'O ano deve ter exatamente 4 dígitos numéricos (ex: 2024)',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        return $producerData;
    }

    /**
     * Cria um produtor com suas fazendas e safras
     */
    public function createProducer(array $producerData): Producer
    {
        // Validar dados
        $this->validateProducerData($producerData, true);

        // Validar e limpar documento
        $document = $this->validateDocument($producerData['document'], $producerData['document_type']);

        // Verificar duplicidade
        if ($this->documentExists($document, $producerData['document_type'])) {
            throw ValidationException::withMessages([
                'document' => 'Já existe um produtor com este documento'
            ]);
        }

        // Criar produtor
        $producer = Producer::create([
            'document' => $document,
            'document_type' => $producerData['document_type'],
            'name' => $producerData['name'],
            'created_by' => auth()->id(),
        ]);

        // Criar fazendas se fornecidas
        if (isset($producerData['farms']) && is_array($producerData['farms']) && count($producerData['farms']) > 0) {
            $this->farmService->createFarmsForProducer($producer->id, $producerData['farms']);
        }

        return $producer->load('farms.harvests');
    }

    /**
     * Atualiza um produtor (apenas dados do produtor, não fazendas)
     */
    public function updateProducer(Producer $producer, array $producerData): Producer
    {
        // Validar dados (sem fazendas)
        $this->validateProducerData($producerData, false);

        // Validar e limpar documento
        $document = $this->validateDocument($producerData['document'], $producerData['document_type']);

        // Verificar duplicidade (exceto o próprio registro)
        if ($this->documentExists($document, $producerData['document_type'], $producer->id)) {
            throw ValidationException::withMessages([
                'document' => 'Já existe um produtor com este documento'
            ]);
        }

        // Atualizar apenas dados do produtor
        $producer->update([
            'document' => $document,
            'document_type' => $producerData['document_type'],
            'name' => $producerData['name'],
        ]);

        return $producer->fresh();
    }

    /**
     * Deleta um produtor e suas relações (soft delete em cascata)
     */
    public function deleteProducer(Producer $producer): void
    {
        // Carregar relacionamentos para garantir que todos sejam deletados
        $producer->load('farms.harvests.crops');
        
        // Soft delete em cascata: culturas -> colheitas -> fazendas -> produtor
        foreach ($producer->farms as $farm) {
            foreach ($farm->harvests as $harvest) {
                // Soft delete das culturas (safras)
                foreach ($harvest->crops as $crop) {
                    $crop->delete();
                }
                // Soft delete da colheita
                $harvest->delete();
            }
            // Soft delete da fazenda
            $farm->delete();
        }
        
        // Soft delete do produtor
        $producer->delete();
    }

    /**
     * Formata dados do produtor para edição
     */
    public function formatForEdit(Producer $producer): array
    {
        $farmsData = $producer->farms->map(function($farm) {
            $harvestsData = $farm->harvests->load('crops')->map(function($harvest) {
                return [
                    'id' => $harvest->id,
                    'year' => (string) $harvest->year,
                    'crops' => $harvest->crops->pluck('name')->toArray()
                ];
            })->toArray();
            
            return [
                'id' => $farm->id,
                'name' => $farm->name ?? '',
                'city' => $farm->city ?? '',
                'state' => $farm->state ?? '',
                'total_area' => $farm->total_area ? (string) $farm->total_area : '0',
                'arable_area' => $farm->arable_area ? (string) $farm->arable_area : '0',
                'vegetation_area' => $farm->vegetation_area ? (string) $farm->vegetation_area : '0',
                'harvests' => $harvestsData
            ];
        })->toArray();

        return [
            'producer' => [
                'id' => $producer->id,
                'document' => $producer->document ?? '',
                'document_type' => $producer->document_type ?? 'CPF',
                'name' => $producer->name ?? '',
            ],
            'farms' => $farmsData
        ];
    }
}

