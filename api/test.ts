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

  // Test endpoint
  if (req.url === '/api/test') {
    res.status(200).json({ 
      message: 'API is working!', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL
    });
    return;
  }

  // Mock data for testing
  const mockData = {
    '/api/animals': [],
    '/api/inventory': [],
    '/api/treatments': [],
    '/api/transactions': [],
    '/api/batches': [],
    '/api/goals': []
  };

  const data = mockData[req.url as keyof typeof mockData];
  if (data) {
    res.status(200).json(data);
    return;
  }

  res.status(404).json({ message: 'Not found' });
}
