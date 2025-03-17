import { redirect } from 'next/navigation';

export default function AuthForgotPasswordRedirect() {
  redirect('/account/forgot-password');
} 