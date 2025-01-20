import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function ShoppingCart() {
  const cartItems = [
    {
      id: 1,
      name: 'Wedding Guest Book',
      price: 29.99,
      quantity: 1
    },
    {
      id: 2,
      name: 'Floral Centerpiece',
      price: 49.99,
      quantity: 2
    }
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shopping Cart</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${item.price} × {item.quantity}
                </p>
              </div>
              <button className="text-red-500 hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                </svg>
              </button>
            </div>
          ))}
          
          {cartItems.length > 0 ? (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Button className="w-full">Checkout</Button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Your cart is empty
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}