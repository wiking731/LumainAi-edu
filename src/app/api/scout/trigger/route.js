// Scout Trigger API Route (Mock)
import { NextResponse } from 'next/server';

// POST - Trigger scout scan (mock)
export async function POST(request) {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock scan results
    const mockResults = {
        success: true,
        timestamp: new Date().toISOString(),
        scanned: 5,
        relevant: 2,
        ingested: 1,
        logs: [
            {
                id: `scan_${Date.now()}`,
                status: 'success',
                title: `PQ-${Math.floor(Math.random() * 1000)}: Yangi soliq imtiyozlari`,
                relevance_score: 85 + Math.floor(Math.random() * 10),
                message: 'Bazaga qo\'shildi'
            }
        ]
    };

    return NextResponse.json(mockResults);
}

// GET - Get scan status
export async function GET() {
    return NextResponse.json({
        status: 'idle',
        last_scan: new Date().toISOString(),
        next_scheduled: null,
        stats: {
            total_scanned: 47,
            total_ingested: 32,
            new_this_week: 12
        }
    });
}
