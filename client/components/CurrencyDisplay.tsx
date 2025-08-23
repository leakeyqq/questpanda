'use client';

import { useCurrency } from '../contexts/CurrencyContext';

export default function CurrencyDisplay() {
  const { currency } = useCurrency();

  return <span className='ps-1'>{currency}</span>;
}
