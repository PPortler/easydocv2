import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '@/app/register/page';
import { useRouter } from 'next/navigation';
import axios from 'axios';


jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn().mockResolvedValue(true),
}));

jest.mock('axios');


test('register empty input', async ()  => {
    (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(), // Mock push function
        pathname: '/register', // Mock current path
        query: {}, // Mock query object
    });

    render(<Register />);
    
    const firstName = screen.getByTestId('firstName');
    const lastName = screen.getByTestId('lastName');
    const phone = screen.getByTestId('phone');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');
    const confirmPassword = screen.getByTestId('confirmPassword');
    const btnSubmit = screen.getByTestId('btn-submit');
 

    fireEvent.change(firstName, { target: { value: '' } });
    fireEvent.change(lastName, { target: { value: '' } });
    fireEvent.change(phone, { target: { value: '' } });
    fireEvent.change(email, { target: { value: '' } });
    fireEvent.change(password, { target: { value: '' } });
    fireEvent.change(confirmPassword, { target: { value: '' } });
    fireEvent.click(btnSubmit);

    await waitFor(() => {
        const ErrorMessage = screen.getByTestId('error-message');
        expect(ErrorMessage).toHaveTextContent('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    })
});

test('register success', async ()  => {
    const pushMock = jest.fn(); // เพิ่ม mock สำหรับ replace
    const replaceMock = jest.fn(); // เพิ่ม mock สำหรับ replace

    const swalMock = jest.spyOn(require('sweetalert2'), 'fire').mockImplementation(() => Promise.resolve());

    (useRouter as jest.Mock).mockReturnValue({
        push: pushMock,
        replace: replaceMock, 
        pathname: '/register', // Mock current path
        query: {}, // Mock query object
    });

      // Mock API response สำหรับการ register สำเร็จ
      (axios.post as jest.Mock).mockResolvedValue({
        status: 201,
        data: { message: 'Created User' }
    });

    render(<Register />);
    
    const firstName = screen.getByTestId('firstName');
    const lastName = screen.getByTestId('lastName');
    const phone = screen.getByTestId('phone');
    const email = screen.getByTestId('email');
    const password = screen.getByTestId('password');
    const confirmPassword = screen.getByTestId('confirmPassword');
    const btnSubmit = screen.getByTestId('btn-submit');
 

    fireEvent.change(firstName, { target: { value: 'Phitakpong' } });
    fireEvent.change(lastName, { target: { value: 'Supapphet' } });
    fireEvent.change(phone, { target: { value: '0992538834' } });
    fireEvent.change(email, { target: { value: 'pportler.sss@gmail.com' } });
    fireEvent.change(password, { target: { value: '12345678@a' } });
    fireEvent.change(confirmPassword, { target: { value: '12345678@a' } });
    fireEvent.click(btnSubmit);

    // screen.debug();
    await waitFor(() => {
        expect(swalMock).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: 'success',
                text: 'ลงทะเบียนสำเร็จ!'
            })
        );
    });

    await waitFor(() => {
        expect(replaceMock).toHaveBeenCalledWith('/login')
    })
});
