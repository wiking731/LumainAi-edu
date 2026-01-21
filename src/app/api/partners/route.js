// Partners API Route
import { NextResponse } from 'next/server';
import lawyersData from '@/data/lawyers.json';

// GET - List all partners
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const specialty = searchParams.get('specialty');
    const city = searchParams.get('city');

    let partners = [...lawyersData.partners];

    // Apply filters
    if (type && type !== 'all') {
        partners = partners.filter(p => p.type === type);
    }
    if (specialty && specialty !== 'all') {
        partners = partners.filter(p => p.specializations.includes(specialty));
    }
    if (city && city !== 'all') {
        partners = partners.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
    }

    return NextResponse.json({
        partners,
        total: partners.length,
        specializations: lawyersData.specializations,
        cities: lawyersData.cities,
        partner_types: lawyersData.partner_types
    });
}

// POST - Register new partner (mock)
export async function POST(request) {
    const body = await request.json();

    // Validate required fields
    const required = ['name', 'type', 'specializations', 'experience_years', 'city', 'phone'];
    for (const field of required) {
        if (!body[field]) {
            return NextResponse.json(
                { error: `${field} is required` },
                { status: 400 }
            );
        }
    }

    // Create new partner object (in real app, would save to database)
    const newPartner = {
        id: `p${Date.now()}`,
        name: body.name,
        type: body.type,
        specializations: body.specializations,
        experience_years: parseInt(body.experience_years),
        city: body.city,
        phone: body.phone,
        email: body.email || null,
        bio_uz: body.bio || '',
        bio_ru: body.bio || '',
        rating: 0,
        reviews_count: 0,
        consultations: 0,
        price_per_hour: body.price_per_hour || 100000,
        languages: body.languages || ['uz', 'ru'],
        verified: false, // Needs admin approval
        created_at: new Date().toISOString()
    };

    // In a real app, would save to database here
    // For now, just return success
    return NextResponse.json({
        success: true,
        message: 'Partner registered successfully. Pending verification.',
        partner: newPartner
    });
}
