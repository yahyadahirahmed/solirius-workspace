import { Resend } from "resend";

const sendWelcomeEmail = async (email: string, name: string, password: string): Promise<boolean> => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'Solirius Directory <onboarding@resend.dev>', // Use resend.dev for testing
      to: [email],
      subject: 'Welcome to Solirius Employee Directory!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a73e8; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to Solirius Directory!</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Hi ${name}!</h2>
            <p>Your employee profile has been successfully created.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Login Credentials:</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${password}</p>
            </div>
        
            <p>You can update your password after logging in.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Email error:', error);
      return false;
    }

    console.log('✅ Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};

export { sendWelcomeEmail };