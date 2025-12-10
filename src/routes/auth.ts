import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          first_name: firstName || '',
          last_name: lastName || ''
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      (req.session as any).user = {
        id: authData.user.id,
        email: authData.user.email,
        first_name: firstName || '',
        last_name: lastName || ''
      };

      return res.json({ success: true, redirect: '/' });
    }

    res.status(400).json({ error: 'Signup failed' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (authData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      (req.session as any).user = {
        id: authData.user.id,
        email: authData.user.email,
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || ''
      };

      return res.json({ success: true, redirect: '/' });
    }

    res.status(400).json({ error: 'Login failed' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

export default router;
