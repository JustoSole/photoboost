export default function handler(req, res) {
  console.log('🟢 HELLO FUNCTION EXECUTED!');
  res.json({ message: 'Hello from Vercel!', timestamp: new Date() });
}
