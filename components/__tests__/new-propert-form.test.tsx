import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PropertyForm from '../new-property-form';

describe('Index', () => {
  test('fills out Name field with Street Address 1', () => {
    const onSubmit = jest.fn();
    render(<PropertyForm onSubmit={onSubmit} />);
    const streetAddress1Input = screen.getByRole('textbox', { name: /street address 1/i });
    const nameInput = screen.getByRole('textbox', { name: /name/i });

    userEvent.type(streetAddress1Input, '123 Foo St.');

    expect(nameInput).toHaveValue('123 Foo St.');
  });
});
