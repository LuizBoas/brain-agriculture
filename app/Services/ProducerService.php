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

    public function validateDocument(string $document, string $documentType): string
    {
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

    private function validateCPF(string $cpf): bool
    {
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
        $sum = 0;
        for ($i = 0; $i < 9; $i++) {
            $sum += (int) $cpf[$i] * (10 - $i);
        }
        $remainder = $sum % 11;
        $digit1 = $remainder < 2 ? 0 : 11 - $remainder;

        if ((int) $cpf[9] !== $digit1) {
            return false;
        }

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

    private function validateCNPJ(string $cnpj): bool
    {
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

    public function documentExists(string $document, string $documentType, ?string $excludeId = null): bool
    {
        $query = Producer::where('document', $document)
            ->where('document_type', $documentType);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

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

        $messages = [
            'document.required' => 'O campo documento é obrigatório.',
            'document_type.required' => 'O campo tipo de documento é obrigatório.',
            'document_type.in' => 'O tipo de documento deve ser CPF ou CNPJ.',
            'name.required' => 'O campo nome do produtor é obrigatório.',
            'name.max' => 'O nome do produtor não pode ter mais de 255 caracteres.',
            'farms.*.name.required_with' => 'O campo nome da fazenda é obrigatório.',
            'farms.*.name.max' => 'O nome da fazenda não pode ter mais de 255 caracteres.',
            'farms.*.city.required_with' => 'O campo cidade é obrigatório.',
            'farms.*.city.max' => 'O nome da cidade não pode ter mais de 255 caracteres.',
            'farms.*.state.required_with' => 'O campo estado é obrigatório.',
            'farms.*.state.size' => 'O estado deve ter exatamente 2 caracteres.',
            'farms.*.total_area.required_with' => 'O campo área total é obrigatório.',
            'farms.*.total_area.numeric' => 'A área total deve ser um número.',
            'farms.*.total_area.min' => 'A área total deve ser maior ou igual a zero.',
            'farms.*.arable_area.required_with' => 'O campo área agricultável é obrigatório.',
            'farms.*.arable_area.numeric' => 'A área agricultável deve ser um número.',
            'farms.*.arable_area.min' => 'A área agricultável deve ser maior ou igual a zero.',
            'farms.*.vegetation_area.required_with' => 'O campo área de vegetação é obrigatório.',
            'farms.*.vegetation_area.numeric' => 'A área de vegetação deve ser um número.',
            'farms.*.vegetation_area.min' => 'A área de vegetação deve ser maior ou igual a zero.',
            'farms.*.harvests.*.year.required_with' => 'O campo ano da safra é obrigatório.',
            'farms.*.harvests.*.year.regex' => 'O ano deve ter exatamente 4 dígitos numéricos (ex: 2024).',
            'farms.*.harvests.*.crops.*.required' => 'O campo cultura é obrigatório.',
            'farms.*.harvests.*.crops.*.max' => 'O nome da cultura não pode ter mais de 255 caracteres.',
        ];

        $validator = Validator::make($producerData, $rules, $messages);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        return $producerData;
    }

    public function createProducer(array $producerData): Producer
    {
        $this->validateProducerData($producerData, true);
        $document = $this->validateDocument($producerData['document'], $producerData['document_type']);

        if ($this->documentExists($document, $producerData['document_type'])) {
            throw ValidationException::withMessages([
                'document' => 'Já existe um produtor com este documento'
            ]);
        }

        $producer = Producer::create([
            'document' => $document,
            'document_type' => $producerData['document_type'],
            'name' => $producerData['name'],
            'created_by' => auth()->id(),
        ]);

        if (isset($producerData['farms']) && is_array($producerData['farms']) && count($producerData['farms']) > 0) {
            $this->farmService->createFarmsForProducer($producer->id, $producerData['farms']);
        }

        return $producer->load('farms.harvests');
    }

    public function updateProducer(Producer $producer, array $producerData): Producer
    {
        $this->validateProducerData($producerData, false);
        $document = $this->validateDocument($producerData['document'], $producerData['document_type']);

        if ($this->documentExists($document, $producerData['document_type'], $producer->id)) {
            throw ValidationException::withMessages([
                'document' => 'Já existe um produtor com este documento'
            ]);
        }

        $producer->update([
            'document' => $document,
            'document_type' => $producerData['document_type'],
            'name' => $producerData['name'],
        ]);

        return $producer->fresh();
    }

    public function deleteProducer(Producer $producer): void
    {
        $producer->load('farms.harvests.crops');
        
        foreach ($producer->farms as $farm) {
            foreach ($farm->harvests as $harvest) {
                foreach ($harvest->crops as $crop) {
                    $crop->delete();
                }
                $harvest->delete();
            }
            $farm->delete();
        }
        
        $producer->delete();
    }

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

