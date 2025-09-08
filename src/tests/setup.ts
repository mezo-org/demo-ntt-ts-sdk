import { config } from 'dotenv';

config();

beforeAll(() => {
  if (!process.env.PRIVATE_KEY) {
    console.warn('PRIVATE_KEY not set in environment, using default test key');
  }
});