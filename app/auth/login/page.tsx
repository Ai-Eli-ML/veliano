import { redirect } from 'next/navigation';

export default function AuthLoginRedirect() {
  redirect('/account/login');
} 