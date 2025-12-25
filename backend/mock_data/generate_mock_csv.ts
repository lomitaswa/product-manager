import fs from 'fs';
import path from 'path';

/**
 * CONFIG
 */
const OUTPUT_DIR = path.resolve(process.cwd(), 'mock-data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'products_mock.csv');
const TOTAL_RECORDS = 500;

/**
 * CATEGORY META (Elegant palette)
 */
const CATEGORY_META: Record<string, {
    bg: string;
    fg: string;
    names: string[];
    priceRange: [number, number];
}> = {
    '1ea0c0d3-9683-4fe5-b033-0cd94795b40c': {
        bg: '1E3A8A',
        fg: 'FFFFFF',
        names: [
            'Smartphone', 'Laptop', 'Bluetooth Headphones',
            'Wireless Mouse', 'Mechanical Keyboard'
        ],
        priceRange: [500, 150000]
    },
    '5fa61451-b12d-44fb-863d-9b2c9e9496f0': {
        bg: '065F46',
        fg: 'FFFFFF',
        names: [
            'Clean Code', 'JavaScript Deep Dive',
            'System Design Handbook'
        ],
        priceRange: [200, 2000]
    },
    'f51dbd03-8798-4c37-bea0-38e750385ce6': {
        bg: '9A3412',
        fg: 'FFFFFF',
        names: [
            'Cotton T-Shirt', 'Slim Fit Jeans',
            'Hooded Sweatshirt'
        ],
        priceRange: [300, 5000]
    },
    'ac13c7a3-f2a1-4f9c-bf71-e4803f2a44da': {
        bg: '3F3F46',
        fg: 'FFFFFF',
        names: [
            'Microwave Oven', 'Air Fryer',
            'Vacuum Cleaner'
        ],
        priceRange: [2000, 80000]
    },
    'ab22bdf7-c260-4beb-b403-cc919cf474ae': {
        bg: '7F1D1D',
        fg: 'FFFFFF',
        names: [
            'Cricket Bat', 'Football',
            'Badminton Racket'
        ],
        priceRange: [400, 30000]
    }
};

const CATEGORY_IDS = Object.keys(CATEGORY_META);

/**
 * HELPERS
 */
function productName(categoryId: string, index: number): string {
    const meta = CATEGORY_META[categoryId];
    return `${meta.names[index % meta.names.length]} ${index}`;
}

function randomPrice(categoryId: string): string {
    const [min, max] = CATEGORY_META[categoryId].priceRange;
    return (Math.random() * (max - min) + min).toFixed(2);
}

function imageUrl(categoryId: string, productName: string): string {
    const meta = CATEGORY_META[categoryId];
    const text = encodeURIComponent(productName);
    return `https://placehold.co/400x400/${meta.bg}/${meta.fg}?text=${text}`;
}

/**
 * CSV GENERATION
 */
async function generateCSV() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const stream = fs.createWriteStream(OUTPUT_FILE, { encoding: 'utf8' });

    console.log(`Generating ${TOTAL_RECORDS} elegant records...`);
    stream.write('name,price,image_url,category_id\n');

    for (let i = 1; i <= TOTAL_RECORDS; i++) {
        const categoryId = CATEGORY_IDS[i % CATEGORY_IDS.length];
        const name = productName(categoryId, i);

        const row = [
            name,
            randomPrice(categoryId),
            imageUrl(categoryId, name),
            categoryId
        ].join(',');

        if (!stream.write(row + '\n')) {
            await new Promise(r => stream.once('drain', r));
        }
    }

    stream.end();
    console.log(`CSV generated at ${OUTPUT_FILE}`);
}

generateCSV().catch(console.error);
