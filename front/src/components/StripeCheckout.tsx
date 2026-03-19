"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Make sure to call loadStripe outside of a component’s render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx" // Clé de test publique fallback
);

function CheckoutForm({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirection évitée si la carte passe directement
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "Une erreur inattendue s'est produite lors du paiement.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Paiement en Euros réussi ! Emission du certificat numérique en cours...");
      // Déclenche l'appel Web3 via Gasless!
      setTimeout(() => {
        onSuccess();
      }, 1000); // Petit délai visuel pour le flux de luxe
    } else {
      setMessage("Statut du paiement inattendu.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <PaymentElement options={{ layout: "tabs" }} />
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full py-4 mt-6 bg-[#d4bc8d] text-black text-[10px] tracking-[0.4em] uppercase hover:bg-[#c9b17f] transition flex items-center justify-center font-bold disabled:opacity-50"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
          ) : (
             "Payer " + (amount / 100).toLocaleString('fr-FR') + " €"
          )}
        </span>
      </button>
      {message && (
        <div id="payment-message" className="text-[#d4bc8d] text-[10px] tracking-widest text-center mt-4">
          {message}
        </div>
      )}
    </form>
  );
}

export default function StripeCheckout({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Fait un appel vers notre API pour récupérer le clientSecret
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
          if (data.clientSecret) {
              setClientSecret(data.clientSecret);
          } else {
              setClientSecret("mock_mode");
          }
      }).catch(() => {
          setClientSecret("mock_mode");
      });
  }, [amount]);

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#d4bc8d',
      colorBackground: '#121212',
      colorText: '#ffffff',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      borderRadius: '2px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #d4bc8d',
        boxShadow: 'none',
      },
      '.Label': {
        textTransform: 'uppercase',
        fontSize: '10px',
        letterSpacing: '0.1em',
        color: '#a1a1aa',
      }
    }
  };

  return (
    <div className="w-full border-t border-white/10 mt-6 bg-[#0f0f0f]">
      {clientSecret ? (
        clientSecret === "mock_mode" ? (
           <div className="text-center py-8">
              <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest">
                [Mode DEMO - Stripe Keys manquantes]
              </p>
              <button 
                onClick={onSuccess} 
                className="w-full py-4 bg-[#d4bc8d] text-black text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#c9b17f] transition"
              >
                Simuler le Paiement de {amount/100}€
              </button>
           </div>
        ) : (
            <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
              <CheckoutForm amount={amount} onSuccess={onSuccess} />
            </Elements>
        )
      ) : (
        <div className="flex items-center justify-center py-10">
            <div className="animate-pulse text-[10px] tracking-[0.4em] text-[#d4bc8d] uppercase">
              Connexion bancaire cryptée...
            </div>
        </div>
      )}
    </div>
  );
}
