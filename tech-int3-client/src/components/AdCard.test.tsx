import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AdCard } from './AdCard';
import type { Ad } from '../types';

const mockAd: Ad = {
  id: 1,
  title: 'Test Ad Title',
  price: 12345,
  category: 'Транспорт',
  createdAt: new Date().toISOString(),
  status: 'pending',
  priority: 'urgent',
  description: 'Test description',
  categoryId: 2,
  updatedAt: new Date().toISOString(),
  images: ['https://via.placeholder.com/150'],
  seller: {
    id: 1,
    name: 'Test Seller',
    rating: '4.8',
    totalAds: 5,
    registeredAt: '',
  },
  characteristics: {
    Состояние: 'Б/у',
    Гарантия: 'Нет',
    Производитель: 'TestBrand',
    Модель: 'TestModel',
    Цвет: 'Черный',
  },
  moderationHistory: [],
};

describe('AdCard component', () => {
  it('renders ad details correctly', () => {
    render(
      <MemoryRouter>
        <AdCard ad={mockAd} isSelected={false} onToggleSelect={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Ad Title')).toBeInTheDocument();
    expect(screen.getByText(/12.345\s?₽/)).toBeInTheDocument();
    expect(
      screen.getByText(
        `Транспорт • ${new Date(new Date().toISOString()).toLocaleDateString()}`
      )
    ).toBeInTheDocument();

    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();

    expect(screen.getByAltText('Test Ad Title')).toBeInTheDocument();
  });
});
