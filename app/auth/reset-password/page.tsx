import { redirect } from 'next/navigation';

export default function AuthResetPasswordRedirect() {
  redirect('/account/reset-password');
} 