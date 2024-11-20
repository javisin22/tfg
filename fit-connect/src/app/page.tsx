import { redirect } from 'next/navigation';

export default async function Home() {

  // The redirection to '/home' path instead of using the default '/' one
  // is made because the layout structure required it to be so.
  redirect('/home');  
}
