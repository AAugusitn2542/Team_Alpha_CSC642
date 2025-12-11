import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

// Get all communities (for discover/home page)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('pages/home', {
      communities: communities || [],
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).send('Error loading communities');
  }
});

// Get single community details (View & Book button)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: community, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!community) {
      return res.status(404).send('Community not found');
    }

    // Render booking page with community details
    res.render('pages/booking', {
      community,
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).send('Error loading community');
  }
});

export default router;