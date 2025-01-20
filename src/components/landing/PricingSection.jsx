import React from 'react';
import { Button } from '../ui/Button';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      'Up to 50 guests',
      'Basic budget tracking',
      'Essential planning tools',
      'Basic templates',
      'Community access',
      'Email support'
    ],
    cta: 'Start Free'
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    description: 'Most popular for medium weddings',
    features: [
      'Unlimited guests',
      'Advanced budget analytics',
      'Premium planning tools',
      'Premium templates',
      'Vendor marketplace access',
      'Priority support'
    ],
    featured: true,
    cta: 'Get Premium'
  },
  {
    name: 'Ultimate',
    price: '$19.99',
    period: 'month',
    description: 'For the perfect wedding experience',
    features: [
      'Everything in Premium',
      'Custom wedding website',
      'Dedicated planner',
      'Vendor negotiations',
      'VIP community access',
      '24/7 priority support'
    ],
    cta: 'Go Ultimate'
  }
];

export function PricingSection() {
  return (
    <div className="bg-white dark:bg-dark-bg py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Choose Your Perfect Plan
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Start planning your dream wedding today with our flexible pricing options
          </p>
        </div>

        <div className="mt-20 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl ${
                plan.featured
                  ? 'bg-white dark:bg-dark-card ring-4 ring-primary shadow-xl'
                  : 'bg-white dark:bg-dark-card ring-1 ring-gray-200 dark:ring-gray-700 shadow-lg'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-primary to-primary-light py-1 px-3 text-sm font-semibold text-white text-center">
                  Most Popular
                </div>
              )}

              <div className="p-8 flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-0">
                <Button
                  variant={plan.featured ? 'primary' : 'secondary'}
                  className="w-full justify-center py-3"
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}