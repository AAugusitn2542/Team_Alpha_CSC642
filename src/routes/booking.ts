import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = express.Router();

// The /booking route is now in src/index.ts
// This file is only for POST routes

router.post('/create', async (req: Request, res: Response) => {
  try {
    const user = (req.session as any).user;

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const {
      communityId,
      checkInDate,
      checkOutDate,
      guestsCount,
      totalPrice,
      cardNumber,
      billingAddress,
      phoneNumber
    } = req.body;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        community_id: communityId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        guests_count: guestsCount || 1,
        total_price: totalPrice,
        status: 'confirmed'
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: booking.id,
        card_number: cardNumber.slice(-4),
        billing_address: billingAddress,
        phone_number: phoneNumber,
        amount: totalPrice,
        status: 'completed'
      });

    if (paymentError) throw paymentError;

    res.json({ success: true, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;