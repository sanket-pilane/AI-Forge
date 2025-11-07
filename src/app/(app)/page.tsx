import { redirect } from 'next/navigation';

export default function AppPage() {
  // This page is protected by the (app) layout,
  // so we know the user is authenticated.
  // Redirect them to the default tool.
  redirect('/chat');
}