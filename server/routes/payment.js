// import express from "express";
// import Razorpay from "razorpay";
// import nodemailer from "nodemailer";
// import crypto from "crypto";
// import { PrismaClient } from "@prisma/client";

// const router = express.Router();
// const prisma = new PrismaClient();

// // ✅ Razorpay instance using env
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET
// });

// // ✅ CREATE ORDER + SAVE INITIAL RECORD
// router.post("/create-order", async (req, res) => {
//   try {
//     const { name, email, phone, amount, plan, planPrice, addOns } = req.body;

//     // ✅ Create Razorpay order
//     const order = await razorpay.orders.create({
//       amount,
//       currency: "INR",
//       receipt: "rcpt_" + Date.now(),
//     });

//     // ✅ Save payment info to DB
//     await prisma.payment.create({
//     data: {
//         customerName: name,
//         customerEmail: email,
//         phoneNumber: phone,
//         amount,
//         orderId: order.id,
//         status: "PENDING",
//         plan,
//         planPrice,
//         addOns: JSON.stringify(addOns && addOns.length > 0 ? addOns : []),
//     },
//     });


//     res.json(order);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Order creation failed" });
//   }
// });

// // ✅ VERIFY PAYMENT + UPDATE DB + EMAIL INVOICE
// router.post("/verify-payment", async (req, res) => {
//   try {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

//     // Signature Check
//     const sign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (sign !== razorpay_signature) {
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     // ✅ Update Payment as Paid
//     const payment = await prisma.payment.update({
//       where: { orderId: razorpay_order_id },
//       data: { 
//         paymentId: razorpay_payment_id,
//         signature: razorpay_signature,
//         status: "PAID"
//       }
//     });

//     // ✅ Email Setup
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASS,
//       },
//       connectionTimeout: 10000,
//     });



//     // ✅ Invoice Email
//     await transporter.sendMail({
//       from: process.env.SMTP_EMAIL,
//       to: payment.customerEmail,
//       cc: process.env.SMTP_EMAIL,
//       subject: "Abacco Technology — Payment Invoice",
//       html: `
//             <div style="font-family: Arial, sans-serif; background:#ffffff; padding:25px; border:1px solid #e5e5e5; border-radius:8px; max-width:600px; margin:auto;">
//                 <div style="text-align:center; padding-bottom:20px; border-bottom:2px solid #22c55e;">
//                 <img src="https://abaccotech.com/Logo/icon.png" alt="Abacco Technology Logo" style="width:120px; margin-bottom:10px;" />
//                 <h1 style="color:#22c55e; margin:0; font-size:28px;">Abacco Technology</h1>
//                 <p style="color:#555; font-size:14px; margin-top:5px;">Official Payment Invoice</p>
//                 </div>

//                 <h2 style="color:#22c55e; font-size:22px; margin-top:25px;">Payment Receipt</h2>
//                 <p style="font-size:15px; color:#444;">Thank you for choosing <b>Abacco Technology</b>. Your payment has been successfully received.</p>

//                 <table style="width:100%; margin-top:20px; border-collapse:collapse;">
//                 <tr><td style="padding:10px;border-bottom:1px solid #ddd;"><b>Customer Name</b></td><td style="padding:10px;border-bottom:1px solid #ddd;">${payment.customerName}</td></tr>
//                 <tr><td style="padding:10px;border-bottom:1px solid #ddd;"><b>Email</b></td><td style="padding:10px;border-bottom:1px solid #ddd;">${payment.customerEmail}</td></tr>
//                 <tr><td style="padding:10px;border-bottom:1px solid #ddd;"><b>Phone</b></td><td style="padding:10px;border-bottom:1px solid #ddd;">${payment.phoneNumber}</td></tr>

//                 <tr><td style="padding:10px;border-bottom:1px solid #ddd;"><b>Selected Plan</b></td>
//                     <td style="padding:10px;border-bottom:1px solid #ddd;">${payment.plan || "N/A"} — ₹${payment.planPrice || (payment.amount / 100)}</td></tr>

//                     ${payment.addOns && JSON.parse(payment.addOns).length > 0
//                     ? `
//                         <tr>
//                         <td style="padding:10px;border-bottom:1px solid #ddd;"><b>Add-Ons</b></td>
//                         <td style="padding:10px;border-bottom:1px solid #ddd;">
//                             ${JSON.parse(payment.addOns)
//                             .map((a) => `${a.title} — ₹${a.price.replace(/\D/g, "")}`)
//                             .join("<br>")}
//                         </td>
//                         </tr>
//                     `
//                     : ""
//                     }

//                 </td></tr>

//                 <tr><td style="padding:10px;border-bottom:1px solid #ddd;"><b>Total Amount Paid</b></td>
//                 <td style="padding:10px;border-bottom:1px solid #ddd;">₹${(payment.amount / 100).toLocaleString()}</td></tr>

//                 <tr><td style="padding:10px;border-bottom:1px solid #ddd;"><b>Payment ID</b></td>
//                 <td style="padding:10px;border-bottom:1px solid #ddd;">${payment.paymentId}</td></tr>

//                 <tr><td style="padding:10px;"><b>Date</b></td>
//                 <td style="padding:10px;">${new Date().toLocaleString()}</td></tr>
//                 </table>

//                 <div style="margin-top:25px; text-align:center;">
//                 <a style="background:#22c55e; color:#fff; padding:12px 25px; border-radius:6px; text-decoration:none; font-size:16px;">Payment Successful</a>
//                 </div>

//                 <p style="font-size:13px; color:#888; text-align:center; margin-top:25px;">
//                 Thank you for your business.<br>
//                 © ${new Date().getFullYear()} Abacco Technology — All Rights Reserved.
//                 </p>
//             </div>
//             `
//     });

//     res.json({ success: true });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Verification failed" });
//   }
// });

// export default router;



import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const router = express.Router();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
   
// --------------------------------------------
// CREATE ORDER
// --------------------------------------------
router.post("/create-order", async (req, res) => {
  try {
    const { name, email, phone, amount, plan, planPrice, addOns } = req.body;

    // Razorpay Order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    // Save to DB
    await prisma.payment.create({
      data: {
        customerName: name,
        customerEmail: email,
        phoneNumber: phone,
        amount,
        orderId: order.id,
        status: "PENDING",
        plan,
        planPrice,
        addOns: JSON.stringify(addOns || []),
      },
    });

    res.json(order);
  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// --------------------------------------------
// VERIFY PAYMENT + SEND INVOICE (RESEND)
// --------------------------------------------
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Validate Signature
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Update DB to PAID
    const payment = await prisma.payment.update({
      where: { orderId: razorpay_order_id },
      data: {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "PAID",
      },
    });

    // --------------------------------------------
    // SEND EMAIL USING RESEND (SAFE WRAPPER)
    // --------------------------------------------
    try {

      const addOnsList = payment.addOns ? JSON.parse(payment.addOns) : [];

      await resend.emails.send({
        from: "Abacco Technology <noreply@abaccotech.com>",
        to: payment.customerEmail,
        cc: "info@abaccotech.com",
        subject: "Abacco Technology — Payment Invoice",

        html: `
          <div style="font-family: Arial; padding:20px; border:1px solid #ddd; border-radius:10px; max-width:600px; margin:auto;">
            <h2 style="color:#22c55e; text-align:center;">Payment Invoice</h2>

            <p>Hello <b>${payment.customerName}</b>,</p>
            <p>Thank you for your payment. Below are your invoice details:</p>

            <table style="width:100%; margin-top:20px; border-collapse:collapse;">
              <tr><td><b>Customer Name:</b></td><td>${payment.customerName}</td></tr>
              <tr><td><b>Email:</b></td><td>${payment.customerEmail}</td></tr>
              <tr><td><b>Phone:</b></td><td>${payment.phoneNumber}</td></tr>
              <tr><td><b>Selected Plan:</b></td><td>${payment.plan} — ₹${payment.planPrice}</td></tr>

              ${
                addOnsList.length > 0
                  ? `<tr>
                      <td><b>Add-Ons:</b></td>
                      <td>
                        ${addOnsList.map(a => `${a.title} — ₹${a.price.replace(/\D/g, "")}`).join("<br>")}
                      </td>
                    </tr>`
                  : ""
              }

              <tr><td><b>Total Amount Paid:</b></td><td>₹${payment.amount / 100}</td></tr>
              <tr><td><b>Payment ID:</b></td><td>${payment.paymentId}</td></tr>
              <tr><td><b>Date:</b></td><td>${new Date().toLocaleString()}</td></tr>
            </table>

            <p style="margin-top:20px; font-size:12px; text-align:center; color:#777;">
              © ${new Date().getFullYear()} Abacco Technology — All Rights Reserved.
            </p>
          </div>
        `,
      });

    } catch (emailErr) {
      console.error("EMAIL SEND FAILED:", emailErr);
    }


    // Final response
    res.json({ success: true });

  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});


export default router;
