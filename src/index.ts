import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { supabase } from './config/supabase';
import communityRoutes from './routes/communities';
import authRoutes from './routes/auth';
import bookingRoutes from './routes/booking';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'community-housing-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
  })
);

app.use((req, res, next) => {
  res.locals.user = (req.session as any).user || null;
  next();
});



// Home page
app.get('/', async (req: Request, res: Response) => {
  try {
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .limit(6);

    if (error) throw error;

    res.render('pages/home', {
      communities: communities || [],
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.render('pages/home', {
      communities: [],
      user: (req.session as any).user || null
    });
  }
});

app.get('/communities', async (req: Request, res: Response) => {
  try {
    let query = supabase
      .from('communities')
      .select('*');

    const filterParam = req.query.filter as string;
    if (filterParam && filterParam !== 'All') {
      query = query.contains('tags', [filterParam]);
    }

    const { data: communities, error } = await query;

    if (error) throw error;

    res.render('pages/discover', {
      communities: communities || [],
      filterOptions: ['All', 'Students', 'Influencer', 'Families', 'Interns', 'Gaming-Nerds', 'Entrepreneurs', 'Pet-Friendly', 'Gym'],
      activeFilter: filterParam || 'All',
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.render('pages/discover', {
      communities: [],
      filterOptions: ['All', 'Students', 'Influencer', 'Families', 'Interns', 'Entrepreneurs', 'Pet-Friendly', 'Gym'],
      activeFilter: req.query.filter || 'All',
      user: (req.session as any).user || null
    });
  }
})

// Discover page 

app.get('/discover', async (req: Request, res: Response) => {
  try {
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*');

    if (error) throw error;

    res.render('pages/discover', {
      communities: communities || [],
      filterOptions: ['All', 'Students', 'Influencer', 'Families', 'Entrepreneurs', 'Pet owners', 'Fitness enthusiasts'],
      activeFilter: req.query.filter || 'All',
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.render('pages/discover', {
      communities: [],
      filterOptions: ['All', 'Students', 'Influencer', 'Families', 'Entrepreneurs', 'Pet owners', 'Fitness enthusiasts'],
      activeFilter: req.query.filter || 'All',
      user: (req.session as any).user || null
    });
  }
});



// Booking page 
app.get('/booking/:communityId', async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const { data: community, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', communityId)
      .maybeSingle();

    if (error) throw error;
    if (!community) {
      return res.status(404).send('Community not found');
    }

    res.render('pages/booking', {
      community,
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).send('Error loading community');
  }
});

// Payment page 
app.get('/payment/:communityId', async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const { checkIn, checkOut } = req.query;

    const { data: community, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', communityId)
      .maybeSingle();

    if (error) throw error;
    if (!community) {
      return res.status(404).send('Community not found');
    }

    // Calculate the total cost
    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const subtotal = community.price_per_night * nights;
    const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
    const taxes = Math.round((subtotal + serviceFee) * 0.08); // 8% tax
    const total = subtotal + serviceFee + taxes;

    res.render('pages/payment', {
      community,
      checkIn,
      checkOut,
      nights,
      subtotal,
      serviceFee,
      taxes,
      total,
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error loading payment:', error);
    res.status(500).send('Error loading payment');
  }
});

// FAQ page
app.get('/faq', (req: Request, res: Response) => {
  res.render('pages/faq', {
    user: (req.session as any).user || null
  });
});

// External routes
app.use('/auth', authRoutes);
app.use('/community', communityRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});