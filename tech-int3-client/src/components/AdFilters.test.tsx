import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AdFilters } from './AdFilters';

describe('AdFilters component', () => {
  it('calls onSearchChange when user types in the search field', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <AdFilters
        onSearchChange={onSearchChange}
        searchTerm=""
        statusFilter={[]}
        onStatusChange={vi.fn()}
        categoryFilter=""
        onCategoryChange={vi.fn()}
        minPrice=""
        onMinPriceChange={vi.fn()}
        maxPrice=""
        onMaxPriceChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search by title/i);
    await user.type(searchInput, 'laptop');

    expect(onSearchChange).toHaveBeenCalledTimes(6);

    expect(onSearchChange).toHaveBeenCalledWith('l');
    expect(onSearchChange).toHaveBeenCalledWith('a');
    expect(onSearchChange).toHaveBeenCalledWith('p');
    expect(onSearchChange).toHaveBeenCalledWith('t');
    expect(onSearchChange).toHaveBeenCalledWith('o');
    expect(onSearchChange).toHaveBeenCalledWith('p');
  });

  it('calls onReset when the reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <AdFilters
        onSearchChange={vi.fn()}
        searchTerm=""
        statusFilter={[]}
        onStatusChange={vi.fn()}
        categoryFilter=""
        onCategoryChange={vi.fn()}
        minPrice=""
        onMinPriceChange={vi.fn()}
        maxPrice=""
        onMaxPriceChange={vi.fn()}
        onReset={onReset}
      />
    );

    const resetButton = screen.getByRole('button', { name: /Reset All Filters/i });
    await user.click(resetButton);

    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
