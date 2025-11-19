import React, { useRef, useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

interface Column {
    name: string;
    type: string;
    nullable: boolean;
    default: string | null;
    auto_increment: boolean;
}

interface Index {
    name: string;
    columns: string[];
    primary: boolean;
    unique: boolean;
}

interface ForeignKey {
    columns: string[];
    foreign_table: string;
    foreign_columns: string[];
    on_update: string | null;
    on_delete: string | null;
}

interface Table {
    name: string;
    columns: Column[];
    indexes: Index[];
    foreign_keys: ForeignKey[];
}

interface SchemaViewerProps {
    schema: Table[];
}

export default function SchemaViewer({ schema }: SchemaViewerProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [draggingTable, setDraggingTable] = useState<string | null>(null);
    const [tableDragStart, setTableDragStart] = useState({ x: 0, y: 0 });
    const [resizingTable, setResizingTable] = useState<string | null>(null);
    const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

    // Store table sizes (width and height)
    const [tableSizes, setTableSizes] = useState<Record<string, { width: number; height: number }>>({});

    // Hierarchical layout based on connectivity with proper spacing
    const getInitialPositions = () => {
        if (schema.length === 0) return {};

        // Count connections for each table
        const connections: Record<string, number> = {};
        schema.forEach((table) => {
            connections[table.name] = 0;
            const foreignKeys = Array.isArray(table.foreign_keys) ? table.foreign_keys : [];
            foreignKeys.forEach((fk) => {
                connections[table.name] = (connections[table.name] || 0) + 1;
                connections[fk.foreign_table] = (connections[fk.foreign_table] || 0) + 1;
            });
        });

        // Sort by connectivity
        const sorted = [...schema].sort(
            (a, b) => (connections[b.name] || 0) - (connections[a.name] || 0)
        );

        const positions: Record<string, { x: number; y: number }> = {};

        // Table dimensions and spacing (account for actual rendered sizes)
        const tableWidth = 280;
        const tableHeight = 400;
        const minGap = 100; // Minimum gap between table edges

        // Center point
        const centerX = 800;
        const centerY = 500;

        // Divide into tiers
        const getTierAllocation = (total: number) => {
            if (total <= 2) return [total];
            if (total <= 6) return [2, total - 2];
            if (total <= 10) return [2, 4, total - 6];
            return [2, 4, 6, total - 12];
        };

        const tierSizes = getTierAllocation(sorted.length);
        let tableIndex = 0;

        tierSizes.forEach((tierSize, tierIdx) => {
            if (tierIdx === 0) {
                // Center tier - arrange horizontally
                const totalWidth = tierSize * tableWidth + (tierSize - 1) * minGap;
                const startX = centerX - totalWidth / 2;

                for (let i = 0; i < tierSize; i++) {
                    if (tableIndex >= sorted.length) break;
                    positions[sorted[tableIndex].name] = {
                        x: startX + i * (tableWidth + minGap),
                        y: centerY,
                    };
                    tableIndex++;
                }
            } else {
                // Outer tiers - arrange in circle
                // The diagonal distance between table corners must account for gap
                // For a table at angle θ, we need: distance from center = r
                // Arc length between adjacent tables = 2πr/n
                // This arc must be >= (tableWidth + minGap)
                // So: 2πr/n >= (tableWidth + minGap)
                // Therefore: r >= n(tableWidth + minGap)/(2π)

                const itemsOnCircle = tierSize;

                // Add diagonal component since tables have width AND height
                const tableDiagonal = Math.sqrt(tableWidth * tableWidth + tableHeight * tableHeight);

                // Calculate minimum radius based on arc length needed
                const arcLengthNeeded = tableWidth + minGap;
                const calculatedRadius = (itemsOnCircle * arcLengthNeeded) / (2 * Math.PI);

                // Also ensure radius accounts for table diagonal + gap from center
                const radiusFromDiagonal = (tableDiagonal / 2) + minGap + (tierIdx * 600);

                const radius = Math.max(calculatedRadius, radiusFromDiagonal);

                for (let i = 0; i < tierSize; i++) {
                    if (tableIndex >= sorted.length) break;

                    // Add offset to tier rotation to prevent alignment
                    const angleOffset = (tierIdx % 2) * (Math.PI / itemsOnCircle);
                    const angle = (i / itemsOnCircle) * 2 * Math.PI + angleOffset;

                    // Position from circle center, accounting for table size
                    positions[sorted[tableIndex].name] = {
                        x: centerX + radius * Math.cos(angle),
                        y: centerY + radius * Math.sin(angle),
                    };
                    tableIndex++;
                }
            }
        });

        return positions;
    };

    const [tablePositions, setTablePositions] = useState<Record<string, { x: number; y: number }>>(
        getInitialPositions()
    );

    // Update positions when schema changes
    useEffect(() => {
        setTablePositions(getInitialPositions());
    }, [schema]);

    const handleWheel = (e: React.WheelEvent) => {
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale((prev) => Math.min(Math.max(0.3, prev * delta), 3));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0 && e.target === canvasRef.current) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }

        if (draggingTable) {
            setTablePositions((prev) => ({
                ...prev,
                [draggingTable]: {
                    x: (e.clientX - position.x) / scale - tableDragStart.x,
                    y: (e.clientY - position.y) / scale - tableDragStart.y,
                },
            }));
        }

        if (resizingTable) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;
            setTableSizes((prev) => ({
                ...prev,
                [resizingTable]: {
                    width: Math.max(280, resizeStart.width + deltaX / scale),
                    height: Math.max(200, resizeStart.height + deltaY / scale),
                },
            }));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggingTable(null);
        setResizingTable(null);
    };

    const handleTableMouseDown = (e: React.MouseEvent, tableName: string) => {
        e.stopPropagation();

        // Double-click to view details
        if (e.detail === 2) {
            setSelectedTable(tableName);
            return;
        }

        const tablePos = tablePositions[tableName];
        setDraggingTable(tableName);
        setTableDragStart({
            x: (e.clientX - position.x) / scale - tablePos.x,
            y: (e.clientY - position.y) / scale - tablePos.y,
        });
    };

    const handleResizeMouseDown = (e: React.MouseEvent, tableName: string) => {
        e.stopPropagation();
        const currentSize = tableSizes[tableName] || { width: 280, height: 400 };
        setResizingTable(tableName);
        setResizeStart({
            width: currentSize.width,
            height: currentSize.height,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const resetLayout = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setTablePositions(getInitialPositions());
        setTableSizes({});
    };

    const getPrimaryKey = (table: Table): string | null => {
        const indexes = Array.isArray(table.indexes) ? table.indexes : [];
        const pkIndex = indexes.find((idx) => idx.primary);
        return pkIndex ? pkIndex.columns[0] : null;
    };

    const drawRelationship = (
        fromTable: string,
        toTable: string,
        fromPos: { x: number; y: number },
        toPos: { x: number; y: number },
        fromWidth: number
    ) => {
        // Offset for infinite canvas
        const offset = 10000;
        const startX = fromPos.x + fromWidth + offset;
        const startY = fromPos.y + 30 + offset;
        const endX = toPos.x + offset;
        const endY = toPos.y + 30 + offset;

        const midX = (startX + endX) / 2;

        return (
            <path
                d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                stroke="#64748b"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
                markerEnd="url(#arrowhead)"
            />
        );
    };

    return (
        <>
            <Head title="Database Schema Viewer" />
            <div className="min-h-screen bg-slate-950 text-white">
                {/* Controls */}
                <div className="fixed top-4 left-4 z-50 bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700">
                    <h1 className="text-lg font-bold mb-2">Schema Viewer</h1>
                    <div className="text-sm space-y-1 text-slate-300">
                        <div>Tables: {schema.length}</div>
                        <div>Zoom: {(scale * 100).toFixed(0)}%</div>
                        <div className="pt-2 border-t border-slate-600 space-y-1">
                            <div>🖱️ Drag canvas to pan</div>
                            <div>🔍 Scroll to zoom</div>
                            <div>✋ Drag tables to move</div>
                            <div>📐 Drag corner to resize</div>
                            <div>👆 Double-click for details</div>
                        </div>
                    </div>
                    <button
                        onClick={resetLayout}
                        className="mt-3 w-full px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
                    >
                        Reset Layout
                    </button>
                </div>

                {/* Selected Table Details */}
                {selectedTable && (
                    <div className="fixed top-4 right-4 z-50 bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700 max-w-md max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-start mb-3">
                            <h2 className="text-lg font-bold">{selectedTable}</h2>
                            <button
                                onClick={() => setSelectedTable(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        {schema
                            .filter((t) => t.name === selectedTable)
                            .map((table) => {
                                const columns = Array.isArray(table.columns) ? table.columns : [];
                                const foreignKeys = Array.isArray(table.foreign_keys) ? table.foreign_keys : [];

                                return (
                                    <div key={table.name} className="space-y-3 text-sm">
                                        <div>
                                            <h3 className="font-semibold mb-2 text-slate-300">Columns</h3>
                                            <div className="space-y-1">
                                                {columns.map((col) => (
                                                    <div
                                                        key={col.name}
                                                        className="p-2 bg-slate-900 rounded text-xs"
                                                    >
                                                        <div className="font-mono text-emerald-400">
                                                            {col.name}
                                                        </div>
                                                        <div className="text-slate-400">
                                                            {col.type}
                                                            {!col.nullable && ' NOT NULL'}
                                                            {col.auto_increment && ' AUTO_INCREMENT'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {foreignKeys.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold mb-2 text-slate-300">
                                                    Foreign Keys
                                                </h3>
                                                <div className="space-y-1">
                                                    {foreignKeys.map((fk, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="p-2 bg-slate-900 rounded text-xs"
                                                        >
                                                            <div className="font-mono">
                                                                {Array.isArray(fk.columns) ? fk.columns.join(', ') : ''} →{' '}
                                                                {fk.foreign_table}.
                                                                {Array.isArray(fk.foreign_columns) ? fk.foreign_columns.join(', ') : ''}
                                                            </div>
                                                            <div className="text-slate-400 mt-1">
                                                                {fk.on_delete && `ON DELETE ${fk.on_delete}`}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* Canvas */}
                <div
                    ref={canvasRef}
                    className="w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
                    style={{ touchAction: 'none' }}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transformOrigin: '0 0',
                            transition: isDragging ? 'none' : 'transform 0.1s',
                        }}
                    >
                        {/* SVG for relationships - infinite canvas */}
                        <svg
                            className="absolute pointer-events-none"
                            style={{
                                left: '-10000px',
                                top: '-10000px',
                                width: '20000px',
                                height: '20000px',
                            }}
                        >
                            <defs>
                                <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="9"
                                    refY="3"
                                    orient="auto"
                                >
                                    <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
                                </marker>
                            </defs>
                            {schema.map((table, tableIdx) => {
                                const foreignKeys = Array.isArray(table.foreign_keys) ? table.foreign_keys : [];
                                const fromSize = tableSizes[table.name] || { width: 280, height: 400 };
                                return foreignKeys.map((fk, fkIdx) => {
                                    const fromPos = tablePositions[table.name];
                                    const toPos = tablePositions[fk.foreign_table];
                                    if (!fromPos || !toPos) return null;

                                    // Create unique key using both table index and foreign key index
                                    const uniqueKey = `${table.name}-${fk.foreign_table}-${tableIdx}-${fkIdx}`;

                                    return (
                                        <g key={uniqueKey}>
                                            {drawRelationship(
                                                table.name,
                                                fk.foreign_table,
                                                fromPos,
                                                toPos,
                                                fromSize.width
                                            )}
                                        </g>
                                    );
                                });
                            })}
                        </svg>

                        {/* Tables */}
                        {schema.map((table) => {
                            const pos = tablePositions[table.name];
                            const size = tableSizes[table.name] || { width: 280, height: 400 };
                            const pk = getPrimaryKey(table);
                            const columns = Array.isArray(table.columns) ? table.columns : [];
                            const foreignKeys = Array.isArray(table.foreign_keys) ? table.foreign_keys : [];

                            // Calculate how many columns fit based on height
                            const headerHeight = 50;
                            const fkSectionHeight = foreignKeys.length > 0 ? 40 + foreignKeys.length * 35 : 0;
                            const availableHeight = size.height - headerHeight - fkSectionHeight - 20;
                            const rowHeight = 28;
                            const maxVisibleColumns = Math.floor(availableHeight / rowHeight);

                            return (
                                <div
                                    key={table.name}
                                    className="absolute bg-slate-800 rounded-lg shadow-xl border-2 border-slate-700 hover:border-slate-500 select-none flex flex-col"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        width: size.width,
                                        height: size.height,
                                        cursor: draggingTable === table.name ? 'grabbing' : 'grab',
                                    }}
                                    onMouseDown={(e) => handleTableMouseDown(e, table.name)}
                                >
                                    {/* Table Header */}
                                    <div className="bg-slate-700 px-3 py-2 rounded-t-lg border-b border-slate-600 flex-shrink-0">
                                        <div className="font-bold text-sm">{table.name}</div>
                                        <div className="text-xs text-slate-400">
                                            {columns.length} columns
                                        </div>
                                    </div>

                                    {/* Columns */}
                                    <div className="p-2 flex-1 overflow-auto">
                                        {columns.slice(0, maxVisibleColumns).map((col) => (
                                            <div
                                                key={col.name}
                                                className="px-2 py-1 text-xs font-mono flex justify-between items-center hover:bg-slate-700 rounded"
                                            >
                                                <span
                                                    className={
                                                        col.name === pk
                                                            ? 'text-yellow-400 font-bold'
                                                            : 'text-slate-300'
                                                    }
                                                >
                                                    {col.name === pk && '🔑 '}
                                                    {col.name}
                                                </span>
                                                <span className="text-slate-500 text-[10px]">
                                                    {col.type}
                                                </span>
                                            </div>
                                        ))}
                                        {columns.length > maxVisibleColumns && (
                                            <div className="px-2 py-1 text-xs text-slate-500 italic">
                                                +{columns.length - maxVisibleColumns} more...
                                            </div>
                                        )}
                                    </div>

                                    {/* Foreign Keys Section */}
                                    {foreignKeys.length > 0 && (
                                        <div className="px-3 py-2 border-t border-slate-700 flex-shrink-0">
                                            <div className="text-xs font-semibold text-slate-400 mb-1">
                                                Foreign Keys
                                            </div>
                                            {foreignKeys.map((fk, idx) => (
                                                <div
                                                    key={idx}
                                                    className="text-xs font-mono text-slate-300 py-0.5"
                                                >
                                                    {Array.isArray(fk.columns) ? fk.columns.join(', ') : ''} → {fk.foreign_table}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Resize Handle */}
                                    <div
                                        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                                        style={{
                                            background: 'linear-gradient(135deg, transparent 50%, #64748b 50%)',
                                        }}
                                        onMouseDown={(e) => handleResizeMouseDown(e, table.name)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
