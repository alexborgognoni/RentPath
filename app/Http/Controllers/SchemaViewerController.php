<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class SchemaViewerController extends Controller
{
    public function index()
    {
        $tables = $this->getDatabaseSchema();

        return Inertia::render('schema-viewer', [
            'schema' => $tables,
        ]);
    }

    private function getDatabaseSchema(): array
    {
        $tables = [];

        // Get all table names - works for MySQL, PostgreSQL, SQLite, SQL Server
        $tableNames = $this->getAllTableNames();

        foreach ($tableNames as $tableName) {
            // Skip Laravel internal tables
            if (in_array($tableName, ['migrations', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens'])) {
                continue;
            }

            try {
                $columns = Schema::getColumns($tableName);
                $indexes = Schema::getIndexes($tableName);
                $foreignKeys = Schema::getForeignKeys($tableName);

                $tables[] = [
                    'name' => $tableName,
                    'columns' => array_map(function ($column) {
                        return [
                            'name' => $column['name'] ?? 'unknown',
                            'type' => $column['type_name'] ?? $column['type'] ?? 'unknown',
                            'nullable' => $column['nullable'] ?? false,
                            'default' => $column['default'] ?? null,
                            'auto_increment' => $column['auto_increment'] ?? false,
                        ];
                    }, $columns),
                    'indexes' => array_map(function ($index) {
                        return [
                            'name' => $index['name'] ?? 'unknown',
                            'columns' => $index['columns'] ?? [],
                            'primary' => $index['primary'] ?? false,
                            'unique' => $index['unique'] ?? false,
                        ];
                    }, $indexes),
                    'foreign_keys' => array_map(function ($fk) {
                        return [
                            'columns' => $fk['columns'] ?? [],
                            'foreign_table' => $fk['foreign_table'] ?? 'unknown',
                            'foreign_columns' => $fk['foreign_columns'] ?? [],
                            'on_update' => $fk['on_update'] ?? null,
                            'on_delete' => $fk['on_delete'] ?? null,
                        ];
                    }, $foreignKeys),
                ];
            } catch (\Exception $e) {
                // Skip tables that can't be introspected (views, system tables, etc.)
                continue;
            }
        }

        return $tables;
    }

    private function getAllTableNames(): array
    {
        $driver = config('database.default');
        $connection = config("database.connections.{$driver}.driver");

        try {
            switch ($connection) {
                case 'sqlite':
                    $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

                    return array_column($tables, 'name');

                case 'mysql':
                    $dbName = DB::getDatabaseName();
                    $tables = DB::select('SELECT table_name FROM information_schema.tables WHERE table_schema = ?', [$dbName]);

                    return array_column($tables, 'table_name');

                case 'pgsql':
                    $tables = DB::select("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");

                    return array_column($tables, 'tablename');

                case 'sqlsrv':
                    $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE'");

                    return array_column($tables, 'table_name');

                default:
                    // Fallback: try to get table list from Schema
                    return $this->getFallbackTableNames();
            }
        } catch (\Exception $e) {
            return $this->getFallbackTableNames();
        }
    }

    private function getFallbackTableNames(): array
    {
        // Last resort: try using Schema::getTables() if available in newer Laravel versions
        // or return empty array to prevent errors
        try {
            if (method_exists(Schema::class, 'getTables')) {
                return array_column(Schema::getTables(), 'name');
            }
        } catch (\Exception $e) {
            // Silently fail
        }

        return [];
    }
}
