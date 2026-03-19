import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    // Si la clé n'existe pas (mode démo), on renvoie une erreur légère pour que le frontend active le mock
    if (!stripeKey) {
      return NextResponse.json({ error: "Missing Stripe secret key" }, { status: 400 });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2026-02-25.clover',
    });

    const { amount } = await req.json();

    // Crée un PaymentIntent avec le montant (en centimes)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
