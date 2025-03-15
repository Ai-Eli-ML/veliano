import nodemailer from "nodemailer"

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

export async function sendOrderConfirmationEmail(order: any) {
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
            <h1 style="color: #bf953f; margin: 0;">CUSTOM GOLD GRILLZ</h1>
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
            
            <p>Thank you for choosing Custom Gold Grillz!</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Custom Gold Grillz. All rights reserved.</p>
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

export async function sendShippingConfirmationEmail(order: any, trackingNumber: string, carrier: string) {
  try {
    const { email, order_number } = order

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your Order #${order_number} Has Shipped!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h1 style="color: #bf953f; margin: 0;">CUSTOM GOLD GRILLZ</h1>
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
            
            <p>Thank you for choosing Custom Gold Grillz!</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Custom Gold Grillz. All rights reserved.</p>
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

