import { config } from 'dotenv';

config();

beforeAll(() => {
  if (!process.env.ETH_PRIVATE_KEY) {
    console.warn('ETH_PRIVATE_KEY not set in environment, using default test key');
  }
});