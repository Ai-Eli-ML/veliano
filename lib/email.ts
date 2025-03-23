import nodemailer from "nodemailer"

// Define types for order data
interface OrderEmailData {
  email: string
  order_number: string
  total_price: number
  created_at: string | Date
}

interface EmailResponse {
  success: boolean
  error?: unknown
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_PORT === "465",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendOrderConfirmationEmail(order: OrderEmailData): Promise<EmailResponse> {
  try {
    const { email, order_number, total_price, created_at } = order

    // Format date
    const orderDate = new Date(created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Format total price
    const formattedTotal = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total_price)

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Order Confirmation #${order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #bf953f; margin: 0;">Veliano & Co</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2>Thank You for Your Order!</h2>
            <p>We're excited to confirm your order has been received and is being processed.</p>
            
            <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; margin: 20px 0;">
              <p><strong>Order Number:</strong> ${order_number}</p>
              <p><strong>Order Date:</strong> ${orderDate}</p>
              <p><strong>Order Total:</strong> ${formattedTotal}</p>
            </div>
            
            <p>You can track your order status by visiting your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" style="color: #bf953f;">account dashboard</a>.</p>
            
            <p>If you have any questions about your order, please don't hesitate to <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="color: #bf953f;">contact us</a>.</p>
            
            <p>Thank you for choosing Veliano & Co!</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Veliano & Co. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return { success: false, error }
  }
}

export async function sendShippingConfirmationEmail(
  order: Pick<OrderEmailData, 'email' | 'order_number'>,
  trackingNumber: string,
  carrier: string
): Promise<EmailResponse> {
  try {
    const { email, order_number } = order

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your Order #${order_number} Has Shipped!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #bf953f; margin: 0;">Veliano & Co</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2>Your Order Has Shipped!</h2>
            <p>Great news! Your order #${order_number} is on its way to you.</p>
            
            <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; margin: 20px 0;">
              <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
              <p><strong>Carrier:</strong> ${carrier}</p>
            </div>
            
            <p>You can track your package by visiting the carrier's website and entering your tracking number.</p>
            
            <p>If you have any questions about your shipment, please don't hesitate to <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" style="color: #bf953f;">contact us</a>.</p>
            
            <p>Thank you for choosing Veliano & Co!</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Veliano & Co. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending shipping confirmation email:", error)
    return { success: false, error }
  }
}

export function generateOrderEmailHtml(order: OrderWithRelations) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Order Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Base styles */
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background-color: #f8f8f8;
      }
      .order-details {
        margin: 20px 0;
        border: 1px solid #ddd;
        padding: 15px;
      }
      .item {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #777;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="color: #bf953f; margin: 0;">Veliano & Co</h1>
        <p>Order Confirmation: #${order.id.substring(0, 8)}</p>
      </div>
      
      <p>Dear ${order.customer_name || 'Valued Customer'},</p>
      
      <p>Thank you for your order! We're preparing it for shipment and will notify you when it's on the way.</p>
      
      <div class="order-details">
        <h2>Order Summary</h2>
        <p><strong>Order ID:</strong> #${order.id.substring(0, 8)}</p>
        <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        
        <h3>Items:</h3>
        ${order.items.map(item => `
          <div class="item">
            <p><strong>${item.product_name}</strong> x ${item.quantity}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
          </div>
        `).join('')}
      </div>
      
      <p>If you have any questions about your order, please contact our customer service at support@veliano.co.</p>
      
      <p>Thank you for choosing Veliano & Co!</p>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Veliano & Co. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

export function generatePasswordResetEmailHtml(resetUrl: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Password Reset</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Base styles */
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background-color: #f8f8f8;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background-color: #bf953f;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #777;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="color: #bf953f; margin: 0;">Veliano & Co</h1>
        <p>Password Reset Request</p>
      </div>
      
      <p>Hello,</p>
      
      <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
      
      <p>To reset your password, please click the button below:</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #777;">${resetUrl}</p>
      
      <p>This link will expire in 1 hour for security reasons.</p>
      
      <p>Thank you for choosing Veliano & Co!</p>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Veliano & Co. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

