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

// ===== ROUTES =====

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
// Communities page (with filtering) - ADD THIS BEFORE app.use('/community', ...)
app.get('/communities', async (req: Request, res: Response) => {
  try {
    let query = supabase
      .from('communities')
      .select('*');

    // Filter by tags if a filter is selected
    const filterParam = req.query.filter as string;
    if (filterParam && filterParam !== 'All') {
      query = query.contains('tags', [filterParam]);
    }

    const { data: communities, error } = await query;

    if (error) throw error;

    res.render('pages/discover', {
      communities: communities || [],
      filterOptions: ['All', 'Students', 'Religion', 'Families', 'Interns', 'Gaming-Nerds', 'Entrepreneurs', 'Pet-Friendly', 'Gym'],
      //filterOptions: ['All', 'Modern', 'Young-Professionals', 'Urban', 'Beachside', 'Pet-Friendly', 'Family'],
      activeFilter: filterParam || 'All',
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.render('pages/discover', {
      communities: [],
      filterOptions: ['All', 'Students', 'Religion', 'Families', 'Interns', 'Entrepreneurs', 'Pet-Friendly', 'Gym'],
      //filterOptions: ['All', 'Modern', 'Young-Professionals', 'Urban', 'Beachside', 'Pet-Friendly', 'Family'],
      activeFilter: req.query.filter || 'All',
      user: (req.session as any).user || null
    });
  }
})

// Discover page (alias for communities)
app.get('/discover', async (req: Request, res: Response) => {
  try {
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*');

    if (error) throw error;

    res.render('pages/discover', {
      communities: communities || [],
      filterOptions: ['All', 'Students', 'Religion', 'Families', 'Entrepreneurs', 'Pet owners', 'Fitness enthusiasts'],
      activeFilter: req.query.filter || 'All',
      user: (req.session as any).user || null
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.render('pages/discover', {
      communities: [],
      filterOptions: ['All', 'Students', 'Religion', 'Families', 'Entrepreneurs', 'Pet owners', 'Fitness enthusiasts'],
      activeFilter: req.query.filter || 'All',
      user: (req.session as any).user || null
    });
  }
});


app.get('/booking', (req: Request, res: Response) => {
  res.render('pages/booking', {
    user: (req.session as any).user || null
  });
});

// Payment page
app.get('/payment', (req: Request, res: Response) => {
  res.render('pages/payment', {
    user: (req.session as any).user || null
  });
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