import type { VercelRequest, VercelResponse } from '@vercel/node';
import { InMemoryStorage } from '../server/storage';

const storage = new InMemoryStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const animals = await storage.getAnimals();
        return res.status(200).json(animals);
      
      case 'POST':
        const newAnimal = await storage.insertAnimal(req.body);
        return res.status(201).json(newAnimal);
      
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Animals API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}