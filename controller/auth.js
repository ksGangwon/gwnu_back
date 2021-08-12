import * as authRepository from '../data/auth.js';

export async function login(req, res) {
  const { id, password } = req.body;
  const user = await authRepository.findById({id, password});

  if(!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  res.status(200).json({ user, message: 'Login success' });
}