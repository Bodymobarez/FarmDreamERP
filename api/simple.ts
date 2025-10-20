import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Mock data for all endpoints
  const mockData = {
    '/api/animals': [],
    '/api/inventory': [],
    '/api/treatments': [],
    '/api/transactions': [],
    '/api/batches': [],
    '/api/goals': [],
    '/api/suppliers': [],
    '/api/customers': [],
    '/api/receptions': [],
    '/api/vouchers': [],
    '/api/accounting-entries': []
  };

  const data = mockData[req.url as keyof typeof mockData];
  if (data) {
    res.status(200).json(data);
    return;
  }

  // Health check
  if (req.url === '/api/health') {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      hasDatabase: !!process.env.DATABASE_URL
    });
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
