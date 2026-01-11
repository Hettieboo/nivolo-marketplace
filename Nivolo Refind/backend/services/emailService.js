const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Placeholder methods - will be implemented in later tasks
  async sendPasswordResetEmail(email, resetToken) {
    // Implementation will be added in task 9.1
    throw new Error('Not implemented yet');
  }

  async sendOrderConfirmationEmail(email, orderDetails) {
    // Implementation will be added in task 9.1
    throw new Error('Not implemented yet');
  }
}

module.exports = new EmailService();