import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NewHouseForm from '../new-house-form';

describe('NewHouseForm', () => {
  test('fills out Name field with Street Address 1', () => {
    const onSubmit = jest.fn();
    render(<NewHouseForm onSubmit={onSubmit} />);
    const streetAddress1Input = screen.getByRole('textbox', { name: /street address 1/i });
    const nameInput = screen.getByRole('textbox', { name: /name/i });

    userEvent.type(streetAddress1Input, '123 Foo St.');

    expect(nameInput).toHaveValue('123 Foo St.');
  });
});
