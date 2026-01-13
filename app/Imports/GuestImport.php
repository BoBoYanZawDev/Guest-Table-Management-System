<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use App\Models\Guest;
use App\Models\GuestTable;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class GuestImport implements
    ToModel,
    WithHeadingRow,
    WithChunkReading,
    WithBatchInserts,
    SkipsEmptyRows
{
    public int $created = 0;
    public int $skipped = 0;
    public array $errors = [];

    private array $tableNameMap = [];
    private array $tableCapacityMap = [];
    private array $seatCache = [];
    private array $nextSeatPointer = [];
    private int $defaultCapacity = 10;

    public function __construct()
    {
        $tables = GuestTable::query()
            ->get(['id', 'name', 'capacity']);

        foreach ($tables as $table) {
            $this->tableNameMap[strtolower(trim($table->name))] = $table->id;
            $this->tableCapacityMap[$table->id] = (int) $table->capacity;
        }
    }

    /**
    * @param array $row
    */
    public function model(array $row)
    {
        $name = $this->normalizeString($row['name'] ?? null);
        $tableValue = $this->normalizeString($row['table_id'] ?? $row['table'] ?? null);
        if (!$name && !$tableValue) {
            return null;
        }

        if (!$name) {
            $this->skipped++;
            $this->errors[] = 'Name is required.';
            return null;
        }

        $tableId = $this->resolveTableId($tableValue);
        if (!$tableId) {
            $this->skipped++;
            $this->errors[] = 'Table not found.';
            return null;
        }

        $seatNo = $this->nextAvailableSeat($tableId);
        if (!$seatNo) {
            $this->skipped++;
            $this->errors[] = 'No available seats for selected table.';
            return null;
        }

        $this->seatCache[$tableId][$seatNo] = true;
        $this->created++;

        return new Guest([
            'name' => $name,
            'table_id' => $tableId,
            'seat_no' => $seatNo,
            'checked_in' => false,
            'source' => 'imported',
        ]);
    }

    public function chunkSize(): int
    {
        return 500;
    }

    public function batchSize(): int
    {
        return 500;
    }

    private function resolveTableId($tableValue): ?int
    {
        if (!$tableValue) {
            return null;
        }

        if (is_numeric($tableValue)) {
            return isset($this->tableCapacityMap[(int) $tableValue])
                ? (int) $tableValue
                : null;
        }

        $key = strtolower(trim($tableValue));
        if (isset($this->tableNameMap[$key])) {
            return $this->tableNameMap[$key];
        }

        $table = GuestTable::create([
            'name' => trim($tableValue),
            'capacity' => $this->defaultCapacity,
            'is_active' => 1,
        ]);

        $this->tableNameMap[$key] = $table->id;
        $this->tableCapacityMap[$table->id] = (int) $table->capacity;

        return $table->id;
    }

    private function normalizeString($value): ?string
    {
        if ($value === null) {
            return null;
        }
        $value = trim((string) $value);
        return $value === '' ? null : $value;
    }

    private function ensureSeatCache(int $tableId): void
    {
        if (isset($this->seatCache[$tableId])) {
            return;
        }

        $taken = Guest::where('table_id', $tableId)
            ->whereNotNull('seat_no')
            ->pluck('seat_no')
            ->all();

        $this->seatCache[$tableId] = array_fill_keys($taken, true);
        $this->nextSeatPointer[$tableId] = 1;
    }

    private function nextAvailableSeat(int $tableId): ?int
    {
        $capacity = $this->tableCapacityMap[$tableId] ?? null;
        if (!$capacity) {
            return null;
        }

        $this->ensureSeatCache($tableId);

        $seat = $this->nextSeatPointer[$tableId] ?? 1;
        while ($seat <= $capacity) {
            if (!isset($this->seatCache[$tableId][$seat])) {
                $this->nextSeatPointer[$tableId] = $seat + 1;
                return $seat;
            }
            $seat++;
        }

        $this->nextSeatPointer[$tableId] = $seat;
        return null;
    }
}
