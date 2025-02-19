import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// /api/user/updateInfo
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    // const { username, email, profilePicture, biography, currentPassword, newPassword } = await request.json();
    const {
      username,
      profilePicture,
      biography,
      weight,
      height,
      currentPassword,
      newPassword,
      weightUnit, // "kg" or "lbs"
      heightUnit, // "cm" or "ftin"
    } = await request.json();

    // Convert weight to kg if necessary
    let convertedWeight = Number(weight);
    if (weightUnit && weightUnit.toLowerCase() === 'lbs') {
      convertedWeight = Number(weight) / 2.20462;
    }

    // Convert height to cm if necessary
    let convertedHeight = Number(height);
    if (heightUnit && heightUnit.toLowerCase() === 'ftin') {
      const regex = /(\d+)\s*ft\s*(\d+)\s*in/i; // example: 5ft10 in
      const match = String(height).match(regex);
      if (match) {
        const feet = Number(match[1]);
        const inches = Number(match[2]);
        // 1 inch = 2.54 cm; total cm = ((feet * 12) + inches) * 2.54
        convertedHeight = (feet * 12 + inches) * 2.54;
      }
    }

    // Get user session data
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Error fetching user session');

    // Update user details in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({
        username,
        profilePicture,
        biography,
        weight: convertedWeight,
        height: convertedHeight,
      })
      .eq('email', authData?.user?.email)
      .single();

    if (userError) throw new Error(userError.message);

    console.log(userData);

    // Update password if provided
    if (newPassword && currentPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) throw new Error('Error updating password');
    }

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
